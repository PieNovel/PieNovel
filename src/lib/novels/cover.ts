import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { createPrismaClient } from "@/lib/prisma";

export type UpdateNovelCoverInput = {
  env: CloudflareEnv;
  novelId: string;
  file: File;
  publicId?: string;
};

export type UpdatedNovelCover = {
  id: string;
  slug: string;
  title: string;
  coverUrl: string;
};

export async function uploadNovelCoverAndSave({
  env,
  novelId,
  file,
  publicId,
}: UpdateNovelCoverInput): Promise<UpdatedNovelCover> {
  const prisma = createPrismaClient(env.DB);
  const novel = await prisma.novel.findUnique({
    where: { id: novelId },
    select: { id: true, slug: true, title: true },
  });

  if (!novel) {
    throw new Error("Novel tidak ditemukan.");
  }

  const upload = await uploadImageToCloudinary({
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    file,
    folder: env.CLOUDINARY_UPLOAD_FOLDER,
    publicId: publicId ?? `novels/${novel.slug}/cover`,
    tags: ["pie-novel", "cover", novel.slug],
  });

  const updatedNovel = await prisma.novel.update({
    where: { id: novel.id },
    data: { coverUrl: upload.secureUrl },
    select: {
      id: true,
      slug: true,
      title: true,
      coverUrl: true,
    },
  });

  await invalidateNovelCoverCache(env.KV_CACHE, updatedNovel.slug);

  return {
    id: updatedNovel.id,
    slug: updatedNovel.slug,
    title: updatedNovel.title,
    coverUrl: updatedNovel.coverUrl ?? upload.secureUrl,
  };
}

async function invalidateNovelCoverCache(
  cache: KVNamespace,
  slug: string,
): Promise<void> {
  await Promise.all([
    cache.delete(`novel:${slug}`),
    cache.delete(`novel:slug:${slug}`),
    cache.delete("novels:list"),
    cache.delete("novels:trending"),
  ]);
}

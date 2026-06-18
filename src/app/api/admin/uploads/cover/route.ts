import { getCloudflareEnv } from "@/lib/cloudflare";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth/session";

export async function POST(request: Request): Promise<Response> {
  try {
    await requireAdmin();
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unauthorized" },
      { status: 401 },
    );
  }

  const env = getCloudflareEnv();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const publicId = formData.get("publicId");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Field file wajib berisi gambar cover." },
        { status: 400 },
      );
    }

    const result = await uploadImageToCloudinary({
      apiKey: env.CLOUDINARY_API_KEY,
      apiSecret: env.CLOUDINARY_API_SECRET,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      file,
      folder: env.CLOUDINARY_UPLOAD_FOLDER,
      publicId: typeof publicId === "string" ? publicId : undefined,
    });

    return Response.json({
      coverUrl: result.secureUrl,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload cover tidak bisa diproses.",
      },
      { status: 400 },
    );
  }
}

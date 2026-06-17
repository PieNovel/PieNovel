import { getCloudflareEnv } from "@/lib/cloudflare";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export const runtime = "edge";

export async function POST(request: Request): Promise<Response> {
  const env = getCloudflareEnv();
  const authError = validateAdminUploadToken(request, env.ADMIN_UPLOAD_TOKEN);

  if (authError) {
    return authError;
  }

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

function validateAdminUploadToken(
  request: Request,
  expectedToken?: string,
): Response | null {
  if (!expectedToken) {
    return Response.json(
      { error: "ADMIN_UPLOAD_TOKEN belum dikonfigurasi." },
      { status: 503 },
    );
  }

  if (request.headers.get("x-admin-upload-token") !== expectedToken) {
    return Response.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  return null;
}

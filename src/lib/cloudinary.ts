export type CloudinaryUploadResult = {
  assetId: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: string;
  createdAt: string;
};

type CloudinaryUploadResponse = {
  asset_id: string;
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resource_type: string;
  created_at: string;
  error?: {
    message?: string;
  };
};

export type UploadImageOptions = {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
  file: File;
  folder?: string;
  publicId?: string;
  tags?: string[];
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function assertAllowedImageFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Format gambar harus AVIF, JPEG, PNG, atau WebP.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }
}

export async function uploadImageToCloudinary({
  apiKey,
  apiSecret,
  cloudName,
  file,
  folder = "pie-novel/covers",
  publicId,
  tags = ["pie-novel", "cover"],
}: UploadImageOptions): Promise<CloudinaryUploadResult> {
  assertAllowedImageFile(file);

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedParams: Record<string, string> = {
    folder,
    overwrite: "true",
    timestamp,
  };

  if (publicId) {
    signedParams.public_id = publicId;
  }

  if (tags.length > 0) {
    signedParams.tags = tags.join(",");
  }

  const signature = await signCloudinaryParams(signedParams, apiSecret);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  for (const [key, value] of Object.entries(signedParams)) {
    formData.append(key, value);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Upload Cloudinary gagal.");
  }

  return {
    assetId: payload.asset_id,
    publicId: payload.public_id,
    secureUrl: payload.secure_url,
    width: payload.width,
    height: payload.height,
    format: payload.format,
    bytes: payload.bytes,
    resourceType: payload.resource_type,
    createdAt: payload.created_at,
  };
}

export function buildCloudinaryImageUrl(
  cloudName: string,
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb";
    quality?: "auto" | number;
    format?: "auto" | string;
  } = {},
): string {
  const transformations = [
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : null,
    `q_${options.quality ?? "auto"}`,
    `f_${options.format ?? "auto"}`,
  ].filter(Boolean);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(",")}/${publicId}`;
}

async function signCloudinaryParams(
  params: Record<string, string>,
  apiSecret: string,
): Promise<string> {
  const source = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const data = new TextEncoder().encode(`${source}${apiSecret}`);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  return [...new Uint8Array(hashBuffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

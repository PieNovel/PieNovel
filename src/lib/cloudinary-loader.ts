import type { ImageLoaderProps } from "next/image";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const transformations = `f_auto,q_${quality ?? "auto"},w_${width}`;

  if (src.startsWith("https://res.cloudinary.com/")) {
    return src.replace("/image/upload/", `/image/upload/${transformations}/`);
  }

  if (!cloudName) {
    return src;
  }

  const publicId = src.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

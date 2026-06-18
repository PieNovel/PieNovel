"use server";

import { revalidatePath } from "next/cache";

import { getCloudflareEnv } from "@/lib/cloudflare";
import { requireAdmin } from "@/lib/auth/session";
import { uploadNovelCoverAndSave } from "@/lib/novels/cover";

export type UploadNovelCoverState = {
  status: "idle" | "success" | "error";
  message: string;
  coverUrl?: string;
  novelTitle?: string;
};

export async function uploadNovelCoverAction(
  _previousState: UploadNovelCoverState,
  formData: FormData,
): Promise<UploadNovelCoverState> {
  try {
    await requireAdmin();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unauthorized",
    };
  }

  const env = getCloudflareEnv();

  try {
    const locale = getRequiredTextField(formData, "locale");
    const novelId = getRequiredTextField(formData, "novelId");
    const cover = formData.get("cover");

    if (!(cover instanceof File) || cover.size === 0) {
      throw new Error("Pilih file cover terlebih dahulu.");
    }

    const updatedNovel = await uploadNovelCoverAndSave({
      env,
      novelId,
      file: cover,
    });

    revalidatePath(`/${locale}/admin/novels`, "page");
    revalidatePath(`/${locale}/novels/${updatedNovel.slug}`, "page");

    return {
      status: "success",
      message: "Cover berhasil diunggah dan disimpan.",
      coverUrl: updatedNovel.coverUrl,
      novelTitle: updatedNovel.title,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Cover gagal diunggah. Coba lagi sebentar.",
    };
  }
}

function getRequiredTextField(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${key} wajib diisi.`);
  }

  return value.trim();
}

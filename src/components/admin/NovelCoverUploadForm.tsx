"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import type { ReactElement } from "react";

import {
  type UploadNovelCoverState,
  uploadNovelCoverAction,
} from "@/app/[locale]/admin/novels/actions";

type NovelCoverUploadFormProps = {
  locale: string;
  novelId: string;
  novelTitle: string;
  currentCoverUrl?: string | null;
};

export function NovelCoverUploadForm({
  locale,
  novelId,
  novelTitle,
  currentCoverUrl,
}: NovelCoverUploadFormProps): ReactElement {
  const initialState: UploadNovelCoverState = {
    status: "idle",
    message: "",
  };
  const [state, formAction, isPending] = useActionState(
    uploadNovelCoverAction,
    initialState,
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const coverUrl = state.coverUrl ?? previewUrl ?? currentCoverUrl;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <form
      action={formAction}
      className="grid gap-5 rounded-lg border border-[var(--border)] bg-[var(--card)] p-5 text-[var(--card-foreground)]"
    >
      <input name="locale" type="hidden" value={locale} />
      <input name="novelId" type="hidden" value={novelId} />

      <div className="grid gap-1">
        <h2 className="text-lg font-medium text-[var(--foreground)]">
          Upload Cover
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          {novelTitle}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-[var(--border)] bg-[var(--secondary)]">
          {coverUrl ? (
            <Image
              alt={`Cover ${novelTitle}`}
              className="object-cover"
              fill
              sizes="120px"
              src={coverUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-[var(--muted-foreground)]">
              Belum ada cover
            </div>
          )}
        </div>

        <div className="grid content-start gap-4">
          <label className="grid gap-2 text-sm text-[var(--foreground)]">
            File cover
            <input
              accept="image/avif,image/jpeg,image/png,image/webp"
              className="rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--primary)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[var(--primary-foreground)]"
              name="cover"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                setPreviewUrl((currentPreviewUrl) => {
                  if (currentPreviewUrl) {
                    URL.revokeObjectURL(currentPreviewUrl);
                  }

                  return file ? URL.createObjectURL(file) : null;
                });
              }}
              required
              type="file"
            />
          </label>

          <label className="grid gap-2 text-sm text-[var(--foreground)]">
            Token admin
            <input
              className="rounded-md border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--ring)] transition focus:ring-2"
              name="adminToken"
              placeholder="ADMIN_UPLOAD_TOKEN"
              required
              type="password"
            />
          </label>

          <button
            className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Mengunggah..." : "Simpan cover"}
          </button>
        </div>
      </div>

      {state.message ? (
        <p
          className={
            state.status === "success"
              ? "text-sm text-[var(--primary)]"
              : "text-sm text-[var(--destructive)]"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

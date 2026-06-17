interface CloudflareEnv {
  DB: D1Database;
  KV_CACHE: KVNamespace;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_UPLOAD_FOLDER?: string;
  ADMIN_UPLOAD_TOKEN?: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};

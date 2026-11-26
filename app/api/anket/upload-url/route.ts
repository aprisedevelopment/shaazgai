import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_TYPES: Record<string, { ext: string; isVideo?: boolean }> = {
  "image/jpeg": { ext: ".jpg" },
  "image/jpg": { ext: ".jpg" },
  "image/png": { ext: ".png" },
  "image/webp": { ext: ".webp" },
  "image/gif": { ext: ".gif" },
  "application/pdf": { ext: ".pdf" },
  "video/mp4": { ext: ".mp4", isVideo: true },
  "video/quicktime": { ext: ".mov", isVideo: true },
  "video/webm": { ext: ".webm", isVideo: true },
};

const MAX_IMAGE_OR_DOC_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || "anket-uploads";

let bucketEnsured = false;

function deriveSupabaseUrlFromDatabaseUrl(): string | null {
  const dbUrl = process.env.DATABASE_URL || "";
  const directMatch = dbUrl.match(/db\.([a-z0-9]+)\.supabase\.co/i);
  if (directMatch?.[1]) {
    return `https://${directMatch[1]}.supabase.co`;
  }
  const poolerMatch = dbUrl.match(/postgres\.([a-z0-9]+):/i);
  if (poolerMatch?.[1]) {
    return `https://${poolerMatch[1]}.supabase.co`;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const contentType = String(body.contentType || "").toLowerCase();
    const size = Number(body.size || 0);
    const field = String(body.field || "files").replace(/[^a-zA-Z0-9_-]/g, "");

    const typeMeta = ALLOWED_TYPES[contentType];
    if (!typeMeta) {
      return NextResponse.json(
        { error: "Зөвхөн JPG, PNG, WEBP, GIF, PDF, MP4, MOV, WEBM төрлийн файл зөвшөөрнө." },
        { status: 400 }
      );
    }

    const maxBytes = typeMeta.isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_OR_DOC_BYTES;
    if (!Number.isFinite(size) || size <= 0 || size > maxBytes) {
      return NextResponse.json(
        { error: `Файлын хэмжээ буруу эсвэл хэт том байна (дээд хязгаар ${maxBytes / (1024 * 1024)}MB).` },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      deriveSupabaseUrlFromDatabaseUrl();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        mode: "local",
        uploadUrl: "/api/upload-local",
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    if (!bucketEnsured) {
      const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
      if (listErr) {
        console.error("Supabase listBuckets error:", listErr);
        return NextResponse.json(
          { error: "Supabase Storage холбогдож чадсангүй: " + listErr.message },
          { status: 500 }
        );
      }
      const exists = buckets?.some((b) => b.name === BUCKET_NAME);
      if (!exists) {
        const { error: bucketErr } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: MAX_VIDEO_BYTES,
        });
        if (bucketErr && !bucketErr.message?.toLowerCase().includes("already")) {
          console.error("Supabase createBucket error:", bucketErr);
          return NextResponse.json(
            { error: "Storage bucket үүсгэхэд алдаа гарлаа: " + bucketErr.message },
            { status: 500 }
          );
        }
      }
      bucketEnsured = true;
    }

    const objectPath = `${field}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}${typeMeta.ext}`;
    const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUploadUrl(objectPath);

    if (error || !data) {
      console.error("createSignedUploadUrl error:", error);
      return NextResponse.json(
        { error: error?.message || "Upload холбоос үүсгэж чадсангүй" },
        { status: 500 }
      );
    }

    const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(objectPath);

    return NextResponse.json({
      mode: "supabase",
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: publicData.publicUrl,
    });
  } catch (error: any) {
    console.error("POST /api/anket/upload-url error:", error);
    return NextResponse.json({ error: error.message || "Серверийн алдаа" }, { status: 500 });
  }
}

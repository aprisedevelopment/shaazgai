import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Файл илгээгдээгүй байна." }, { status: 400 });
    }

    const typeMeta = ALLOWED_TYPES[file.type];
    if (!typeMeta) {
      return NextResponse.json(
        { error: "Зөвхөн JPG, PNG, WEBP, GIF, PDF, MP4, MOV, WEBM төрлийн файл зөвшөөрнө." },
        { status: 400 }
      );
    }

    const maxBytes = typeMeta.isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_OR_DOC_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `Файлын хэмжээ хэт том байна (дээд хязгаар ${maxBytes / (1024 * 1024)}MB).` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${typeMeta.ext}`;

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        filename: fileName,
      });
    } catch {
      if (typeMeta.isVideo || file.size > 2 * 1024 * 1024) {
        return NextResponse.json(
          {
            error:
              "Серверийн диск рүү бичих боломжгүй байна. Production орчинд SUPABASE_URL болон SUPABASE_SERVICE_ROLE_KEY тохируулна уу.",
          },
          { status: 500 }
        );
      }

      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: fileName,
      });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

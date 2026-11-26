const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

const COMPRESSIBLE_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const ALLOWED_DOC_AND_IMAGE = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/quicktime", "video/webm"]);

function resolveMimeType(file: File): string {
  if (file.type) return file.type.toLowerCase();
  const match = file.name.toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? EXT_TO_MIME[match[0]] || "" : "";
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

/**
 * Compresses large camera/mobile photos client-side to stay well under upload limits.
 */
export async function compressImageIfNeeded(
  file: File,
  maxDimension = 1600,
  targetMaxBytes = 900 * 1024
): Promise<File> {
  const mime = resolveMimeType(file);
  if (!COMPRESSIBLE_IMAGE_TYPES.has(mime) || file.size <= 600 * 1024) {
    return file;
  }

  let objectUrl = "";
  try {
    objectUrl = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = objectUrl;
    });

    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(img, 0, 0, width, height);

    const outMime = "image/jpeg";
    const qualities = [0.85, 0.72, 0.6];
    let bestBlob: Blob | null = null;

    for (const q of qualities) {
      const blob = await canvasToBlob(canvas, outMime, q);
      if (!blob) break;
      bestBlob = blob;
      if (blob.size <= targetMaxBytes) break;
    }

    if (!bestBlob || bestBlob.size >= file.size) {
      return file;
    }

    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([bestBlob], `${baseName}.jpg`, { type: outMime });
  } catch {
    return file;
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function uploadWithProgress(
  method: "PUT" | "POST",
  url: string,
  body: FormData,
  onProgress?: (pct: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.min(99, Math.round((event.loaded / event.total) * 100)));
      }
    };

    xhr.onload = () => {
      let parsed: any = {};
      try {
        parsed = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        parsed = {};
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve(parsed);
      } else {
        reject(new Error(parsed.error || parsed.message || `Upload амжилтгүй (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error("Сүлжээний алдаа гарлаа. Дахин оролдоно уу."));
    xhr.send(body);
  });
}

export async function uploadAnketFile(
  rawFile: File,
  options: {
    field?: string;
    isVideo?: boolean;
    onProgress?: (pct: number) => void;
  } = {}
): Promise<string> {
  const { field = "files", isVideo = false, onProgress } = options;
  const initialMime = resolveMimeType(rawFile);

  if (isVideo) {
    if (!ALLOWED_VIDEO.has(initialMime)) {
      throw new Error("Видео нь зөвхөн MP4, MOV, эсвэл WEBM форматтай байна.");
    }
  } else if (!ALLOWED_DOC_AND_IMAGE.has(initialMime)) {
    throw new Error("Зөвхөн JPG, PNG, WEBP, GIF зураг эсвэл PDF файл оруулна уу.");
  }

  onProgress?.(5);
  const file = isVideo ? rawFile : await compressImageIfNeeded(rawFile);
  const contentType = resolveMimeType(file) || initialMime;
  const maxSize = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(`Файл хэтэрхий том байна. Дээд хязгаар: ${maxSize / (1024 * 1024)}MB`);
  }

  const targetRes = await fetch("/api/anket/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentType,
      size: file.size,
      field,
    }),
  });

  const targetData = await targetRes.json();
  if (!targetRes.ok) {
    throw new Error(targetData.error || "Upload бэлдэхэд алдаа гарлаа");
  }

  if (targetData.mode === "supabase") {
    const formData = new FormData();
    formData.append("cacheControl", "3600");
    formData.append("", file);
    await uploadWithProgress("PUT", targetData.signedUrl, formData, onProgress);
    return targetData.publicUrl;
  }

  const localFormData = new FormData();
  localFormData.append("file", file);
  const localResult = await uploadWithProgress("POST", targetData.uploadUrl || "/api/upload-local", localFormData, onProgress);
  if (!localResult.success || !localResult.url) {
    throw new Error(localResult.error || "Файл хуулахад алдаа гарлаа");
  }
  return localResult.url;
}

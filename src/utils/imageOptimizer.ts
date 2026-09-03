import { UploadedImage } from '../types/builder';

export const MAX_IMAGES_PER_SITE = 20;
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface OptimizationResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

/**
 * Automatically resizes and compresses an image in the browser using HTML5 Canvas.
 * Caps maximum dimension at 1600px and encodes as WebP (or JPEG fallback).
 */
export async function optimizeImage(file: File, maxDimension = 1600, quality = 0.85): Promise<OptimizationResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('対応形式は JPG, PNG, WebP のみです。');
  }

  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました。'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('画像の解析に失敗しました。'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate scaling ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context could not be acquired'));
          return;
        }

        // Smooth drawing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let mimeType = 'image/webp';
        let dataUrl = canvas.toDataURL(mimeType, quality);

        // If WebP is not supported or returns empty/PNG, fallback to JPEG
        if (!dataUrl.startsWith('data:image/webp')) {
          mimeType = 'image/jpeg';
          dataUrl = canvas.toDataURL(mimeType, quality);
        }

        // Approximate compressed size from base64 string
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const compressedSize = Math.round((base64Length * 3) / 4);

        resolve({
          dataUrl,
          originalSize,
          compressedSize,
          width,
          height,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

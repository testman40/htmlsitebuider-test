import React, { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  FileCheck2,
  HardDrive
} from 'lucide-react';
import { UploadedImage } from '../types/builder';
import { optimizeImage, formatFileSize, MAX_IMAGES_PER_SITE } from '../utils/imageOptimizer';

interface ImageManagerModalProps {
  images: UploadedImage[];
  onAddImage: (img: UploadedImage) => void;
  onDeleteImage: (id: string) => void;
  onSelectImage?: (img: UploadedImage) => void;
  onClose: () => void;
}

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  images,
  onAddImage,
  onDeleteImage,
  onSelectImage,
  onClose
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES_PER_SITE) {
      setUploadError(`1サイトにつき最大 ${MAX_IMAGES_PER_SITE} 枚までです。残り ${MAX_IMAGES_PER_SITE - images.length} 枚追加可能です。`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await optimizeImage(file);
        const newImg: UploadedImage = {
          id: 'img_' + Math.random().toString(36).substring(2, 9),
          name: file.name,
          dataUrl: res.dataUrl,
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          uploadedAt: new Date().toISOString()
        };
        onAddImage(newImg);
      }
    } catch (err: any) {
      setUploadError(err.message || '画像のアップロード・圧縮に失敗しました。');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden border border-gray-200 font-sans">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-gray-900">
              画像ライブラリ・自動圧縮管理
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-2.5 py-0.5 bg-gray-200/70 text-gray-700 rounded-md flex items-center gap-1 font-mono">
              <HardDrive className="w-3 h-3 text-gray-500" />
              <span>{images.length} / {MAX_IMAGES_PER_SITE} 枚</span>
            </span>
            <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          
          {/* Upload Drop Zone */}
          <div className="border border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-500 hover:bg-blue-50/20 transition bg-gray-50/60 relative group">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              disabled={images.length >= MAX_IMAGES_PER_SITE || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">
                  {isUploading ? '自動リサイズ＆WebP圧縮中...' : '画像をクリックして選択、またはドラッグ＆ドロップ'}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  対応形式: JPG, PNG, WebP（長辺1600px以内に自動圧縮して高速表示）
                </p>
              </div>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
              {uploadError}
            </div>
          )}

          {/* Image grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              アップロード済み画像一覧 ({images.length}件)
            </h4>

            {images.length === 0 ? (
              <div className="py-12 text-center text-gray-400 space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-xs">アップロードされた画像はまだありません</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {images.map((img) => {
                  const savedRatio = Math.round(
                    ((img.originalSize - img.compressedSize) / (img.originalSize || 1)) * 100
                  );
                  return (
                    <div
                      key={img.id}
                      className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs hover:shadow-xs transition flex flex-col"
                    >
                      <div className="h-32 bg-gray-100 overflow-hidden relative">
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Compression badge */}
                        {savedRatio > 0 && (
                          <div className="absolute top-1.5 left-1.5 bg-emerald-600/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-2xs">
                            {savedRatio}% 削減
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 flex-1 flex flex-col justify-between text-[11px] space-y-1 bg-white">
                        <p className="font-semibold text-xs text-gray-800 truncate" title={img.name}>
                          {img.name}
                        </p>
                        <div className="flex items-center justify-between text-gray-400 text-[10px]">
                          <span className="font-mono">{formatFileSize(img.compressedSize)}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteImage(img.id);
                            }}
                            className="text-gray-400 hover:text-rose-600 p-1 transition"
                            title="画像を削除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {onSelectImage && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectImage(img);
                              onClose();
                            }}
                            className="w-full mt-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[10px] shadow-2xs transition"
                          >
                            この画像を使用
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition shadow-xs"
          >
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
};

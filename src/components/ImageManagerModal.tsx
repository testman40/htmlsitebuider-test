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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-800">
              画像ライブラリ・自動圧縮管理
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200/80 text-slate-700 rounded-full flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              <span>{images.length} / {MAX_IMAGES_PER_SITE} 枚</span>
            </span>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Upload Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition bg-slate-50 relative group">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              disabled={images.length >= MAX_IMAGES_PER_SITE || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {isUploading ? '自動リサイズ＆WebP圧縮中...' : '画像をクリックして選択、またはドラッグ＆ドロップ'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  対応形式: JPG, PNG, WebP（長辺1600px以内に自動圧縮して高速表示）
                </p>
              </div>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
              {uploadError}
            </div>
          )}

          {/* Image grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              アップロード済み画像一覧 ({images.length}件)
            </h4>

            {images.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto opacity-40" />
                <p className="text-xs">アップロードされた画像はまだありません</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img) => {
                  const savedRatio = Math.round(
                    ((img.originalSize - img.compressedSize) / (img.originalSize || 1)) * 100
                  );
                  return (
                    <div
                      key={img.id}
                      className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                    >
                      <div className="h-32 bg-slate-100 overflow-hidden relative">
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Compression badge */}
                        {savedRatio > 0 && (
                          <div className="absolute top-1.5 left-1.5 bg-emerald-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                            {savedRatio}% 削減
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 flex-1 flex flex-col justify-between text-[11px] space-y-1 bg-white">
                        <p className="font-bold text-slate-800 truncate" title={img.name}>
                          {img.name}
                        </p>
                        <div className="flex items-center justify-between text-slate-400 text-[10px]">
                          <span>{formatFileSize(img.compressedSize)}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteImage(img.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 transition"
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
                            className="w-full mt-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[10px] transition"
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
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition shadow-sm"
          >
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
};

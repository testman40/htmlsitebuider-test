import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Palette, 
  Upload, 
  X, 
  Check, 
  Sparkles,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { BackgroundConfig, UploadedImage } from '../types/builder';
import { VIDEO_PRESETS } from '../data/templates';
import { optimizeImage, MAX_IMAGES_PER_SITE } from '../utils/imageOptimizer';

interface BackgroundSettingsModalProps {
  currentBackground: BackgroundConfig;
  uploadedImages: UploadedImage[];
  onUpdateBackground: (bg: BackgroundConfig) => void;
  onAddUploadedImage: (img: UploadedImage) => void;
  onClose: () => void;
}

export const BackgroundSettingsModal: React.FC<BackgroundSettingsModalProps> = ({
  currentBackground,
  uploadedImages,
  onUpdateBackground,
  onAddUploadedImage,
  onClose
}) => {
  const [bgType, setBgType] = useState<'template_default' | 'image' | 'video'>(
    currentBackground.type
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    currentBackground.preset_id || VIDEO_PRESETS[0].id
  );
  const [imageUrl, setImageUrl] = useState<string>(currentBackground.src || '');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(
    currentBackground.overlayOpacity ?? 20
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadedImages.length >= MAX_IMAGES_PER_SITE) {
      alert(`1サイトあたりの画像枚数上限 (${MAX_IMAGES_PER_SITE}枚) に達しています。不要な画像を整理してください。`);
      return;
    }

    try {
      setIsUploading(true);
      const res = await optimizeImage(file);
      const newImg: UploadedImage = {
        id: 'img_' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        dataUrl: res.dataUrl,
        originalSize: res.originalSize,
        compressedSize: res.compressedSize,
        uploadedAt: new Date().toISOString()
      };
      onAddUploadedImage(newImg);
      setImageUrl(res.dataUrl);
    } catch (err: any) {
      alert(err.message || '画像の最適化に失敗しました。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    onUpdateBackground({
      type: bgType,
      src: bgType === 'image' ? imageUrl : undefined,
      preset_id: bgType === 'video' ? selectedPresetId : undefined,
      overlayOpacity
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 font-sans">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-gray-900">サイト背景設定</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main tabs */}
        <div className="flex border-b border-gray-200 px-5 bg-white gap-2">
          <button
            onClick={() => setBgType('template_default')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
              bgType === 'template_default'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>テンプレート標準</span>
          </button>
          <button
            onClick={() => setBgType('image')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
              bgType === 'image'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>静止画 (アップロード)</span>
          </button>
          <button
            onClick={() => setBgType('video')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition ${
              bgType === 'video'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>動く背景 (動画プリセット)</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {bgType === 'template_default' && (
            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 text-sm">テンプレート標準の配色パターン</p>
                <p>
                  各ジャンルに最適化された清潔感のあるライト背景です。文字の可読性が最も高く、ビジネスや店舗サイトに推奨されます。
                </p>
              </div>
            </div>
          )}

          {bgType === 'image' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  背景画像をアップロード (自動リサイズ・圧縮対応)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition bg-slate-50 relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="w-7 h-7 text-blue-600" />
                    <span className="text-xs font-bold text-slate-700">
                      {isUploading ? '画像を圧縮・処理中...' : 'クリックまたは画像をドラッグ＆ドロップ'}
                    </span>
                    <span className="text-[11px] text-slate-400">対応形式: JPG, PNG, WebP (上限20枚)</span>
                  </div>
                </div>
              </div>

              {/* Current image preview */}
              {imageUrl && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700">選択中の画像プレビュー:</span>
                  <div className="h-36 rounded-xl overflow-hidden border border-slate-200 relative">
                    <img src={imageUrl} alt="Background preview" className="w-full h-full object-cover" />
                    <div 
                      className="absolute inset-0 bg-white"
                      style={{ opacity: overlayOpacity / 100 }}
                    />
                  </div>
                </div>
              )}

              {/* Previously uploaded images */}
              {uploadedImages.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-700">保存済み画像から選ぶ:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedImages.map(img => (
                      <div
                        key={img.id}
                        onClick={() => setImageUrl(img.dataUrl)}
                        className={`h-20 rounded-lg overflow-hidden border-2 cursor-pointer transition relative ${
                          imageUrl === img.dataUrl ? 'border-blue-600 shadow-sm' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                        {imageUrl === img.dataUrl && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {bgType === 'video' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                <strong>※ 仕様に準拠した最適化済み動画プリセット:</strong><br />
                長さ5〜10秒の無音ループ・軽量圧縮(1〜3MB)。OSの「視覚効果を減らす(prefers-reduced-motion)」設定時は自動的に高画質静止画へ切り替わります。
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {VIDEO_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition p-3 space-y-2 flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="h-28 rounded-lg overflow-hidden relative bg-slate-900">
                        <img
                          src={preset.thumbnailUrl}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                          {preset.duration} ({preset.fileSize})
                        </div>
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-blue-600">{preset.category}</span>
                        <h4 className="text-xs font-bold text-slate-800">{preset.name}</h4>
                        <p className="text-[11px] text-slate-500 leading-tight">{preset.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* White Overlay Opacity Slider (Ensures text contrast) */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>テキスト可読性オーバーレイ (白ベール)</span>
              <span className="font-mono text-blue-600">{overlayOpacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-400">
              数値を高くすると文字がよりくっきりと読みやすくなります。
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition shadow-xs"
          >
            背景を適用する
          </button>
        </div>

      </div>
    </div>
  );
};

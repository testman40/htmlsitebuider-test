import React, { useState } from 'react';
import { 
  Check, 
  Eye, 
  Sparkles, 
  ArrowRight, 
  Palette, 
  Layers, 
  Layout, 
  HelpCircle,
  Laptop
} from 'lucide-react';
import { GENRE_DEFINITIONS, GenreDefinition, createInitialSiteData } from '../data/templates';
import { GenreType, SiteData } from '../types/builder';
import { PreviewModal } from './PreviewModal';

interface GenreSelectorProps {
  onSelectGenre: (siteData: SiteData) => void;
  onOpenLegal: () => void;
}

export const GenreSelector: React.FC<GenreSelectorProps> = ({ 
  onSelectGenre,
  onOpenLegal 
}) => {
  const [selectedGenreId, setSelectedGenreId] = useState<GenreType>('shop_business');
  const [selectedVariationId, setSelectedVariationId] = useState<Record<GenreType, string>>({
    shop_business: 'natural_wood',
    personal_bio: 'minimal_mono',
    portfolio: 'gallery_dark',
    blog_column: 'clean_journal',
    event_notice: 'vibrant_festival',
    scratch: 'blank_neutral'
  });

  const [siteTitleInput, setSiteTitleInput] = useState<string>('');
  const [samplePreviewSite, setSamplePreviewSite] = useState<SiteData | null>(null);

  const selectedGenre = GENRE_DEFINITIONS.find(g => g.id === selectedGenreId) || GENRE_DEFINITIONS[0];
  const activeVariationId = selectedVariationId[selectedGenreId] || selectedGenre.variations[0]?.id;

  const handleOpenSamplePreview = (genreId: GenreType) => {
    const varId = selectedVariationId[genreId];
    const previewSite = createInitialSiteData(genreId, varId);
    setSamplePreviewSite(previewSite);
  };

  const handleStartBuilding = () => {
    const newSite = createInitialSiteData(
      selectedGenreId,
      activeVariationId,
      siteTitleInput.trim() || undefined
    );
    onSelectGenre(newSite);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800 py-10 px-4 sm:px-6 flex flex-col items-center font-sans">
      
      {/* Header section */}
      <div className="w-full max-w-5xl text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>インストール不要・HTML知識ゼロで作れる</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          初心者向け HTMLビルダー
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          作りたいサイトのジャンルを選ぶだけ。複数ページのナビゲーションも自動生成され、ドラッグ＆ドロップで手軽にカスタマイズできます。
        </p>
      </div>

      {/* Main card grid container */}
      <div className="w-full max-w-5xl space-y-8">
        
        {/* Step 1: Genre Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
              <span>サイトのジャンルを選択してください</span>
            </h2>
            <span className="text-xs text-gray-500 font-medium">全6ジャンル (全ジャンル複数ページ対応)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GENRE_DEFINITIONS.map((genre) => {
              const isSelected = selectedGenreId === genre.id;
              return (
                <div
                  key={genre.id}
                  onClick={() => setSelectedGenreId(genre.id)}
                  className={`relative rounded-xl overflow-hidden bg-white border transition-all duration-200 cursor-pointer flex flex-col ${
                    isSelected
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20 translate-y-[-2px]'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <img
                      src={genre.thumbnail}
                      alt={genre.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                      {genre.badge}
                    </div>

                    {/* Quick Live Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSamplePreview(genre.id);
                      }}
                      className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-gray-800 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm border border-gray-200 flex items-center gap-1.5 transition"
                      title="実物大のライブプレビューを開く"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>サンプルを見る</span>
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-gray-900">{genre.title}</h3>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-600 font-medium">{genre.tagline}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {genre.description}
                      </p>
                    </div>

                    {/* Standard page structure */}
                    <div className="pt-3 border-t border-gray-100 space-y-1.5">
                      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>標準構成 ({genre.defaultPages.length}ページ)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {genre.defaultPages.map((page, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                          >
                            {page}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Variations & Site Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
              <span>「{selectedGenre.title}」の配色・バリエーションを選択</span>
            </h2>
          </div>

          {/* Color variation buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {selectedGenre.variations.map((variation) => {
              const isVarSelected = activeVariationId === variation.id;
              return (
                <button
                  key={variation.id}
                  type="button"
                  onClick={() => {
                    setSelectedVariationId(prev => ({
                      ...prev,
                      [selectedGenreId]: variation.id
                    }));
                  }}
                  className={`p-4 rounded-lg border text-left transition flex flex-col justify-between gap-3 ${
                    isVarSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">{variation.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-2xs"
                        style={{ backgroundColor: variation.primaryColor }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-2xs"
                        style={{ backgroundColor: variation.accentColor }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{variation.paletteName}</span>
                </button>
              );
            })}
          </div>

          {/* Custom site name input */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              サイト名 (後からいつでも変更できます)
            </label>
            <input
              type="text"
              value={siteTitleInput}
              onChange={(e) => setSiteTitleInput(e.target.value)}
              placeholder="例: 私のカフェサイト、ポートフォリオ2026..."
              className="w-full max-w-md px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Start Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleOpenSamplePreview(selectedGenreId)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>選択中のデザインを実寸サンプルで確認</span>
            </button>

            <button
              type="button"
              onClick={handleStartBuilding}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-sm rounded-md shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>このテンプレートでエディタを開く</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer disclaimer according to Section 7 */}
      <footer className="mt-12 text-center text-xs text-gray-500 space-y-2">
        <p>
          ※ 本サービスが担う範囲は「サイト作成」です。サーバーへの公開はお手持ちのレンタルサーバー等にユーザー自身で行っていただきます。
        </p>
        <div className="flex items-center justify-center gap-4 text-gray-400">
          <button onClick={onOpenLegal} className="hover:underline">利用規約・ライセンス</button>
          <span>•</span>
          <button onClick={onOpenLegal} className="hover:underline">プライバシーポリシー</button>
        </div>
      </footer>

      {/* Live Sample Preview Modal */}
      {samplePreviewSite && (
        <PreviewModal
          site={samplePreviewSite}
          onClose={() => setSamplePreviewSite(null)}
          onExport={() => {
            const site = samplePreviewSite;
            setSamplePreviewSite(null);
            onSelectGenre(site);
          }}
        />
      )}

    </div>
  );
};

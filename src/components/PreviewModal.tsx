import React, { useState, useMemo } from 'react';
import { 
  Monitor, 
  Smartphone, 
  X, 
  Download, 
  ExternalLink, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { PageData, SiteData } from '../types/builder';
import { generatePageHtml } from '../utils/htmlGenerator';

interface PreviewModalProps {
  site: SiteData;
  initialPageId?: string;
  onClose: () => void;
  onExport: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  site,
  initialPageId,
  onClose,
  onExport
}) => {
  const [deviceMode, setDeviceMode] = useState<'pc' | 'mobile'>('pc');
  const [currentPageId, setCurrentPageId] = useState<string>(
    initialPageId || (site.pages[0]?.id ?? '')
  );
  const [iframeKey, setIframeKey] = useState<number>(0);

  const currentPage = useMemo(() => {
    return site.pages.find(p => p.id === currentPageId) || site.pages[0];
  }, [site.pages, currentPageId]);

  // Generate complete HTML for current page
  const htmlContent = useMemo(() => {
    if (!currentPage) return '';
    return generatePageHtml(site, currentPage);
  }, [site, currentPage]);

  const handleRefresh = () => {
    setIframeKey(k => k + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md">
      
      {/* Top Toolbar */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
        
        {/* Left info & Page switcher */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-200 hidden sm:inline">
            プレビュー確認:
          </span>

          <select
            value={currentPageId}
            onChange={(e) => setCurrentPageId(e.target.value)}
            className="bg-slate-800 text-slate-100 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
          >
            {site.pages.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.slug === 'index' ? 'index.html' : `${p.slug}.html`})
              </option>
            ))}
          </select>
        </div>

        {/* Center: Device Switcher (PC / Smartphone) */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setDeviceMode('pc')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              deviceMode === 'pc'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">PC表示</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              deviceMode === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">スマホ表示 (375px)</span>
          </button>
        </div>

        {/* Right actions: Export CTA & Close */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="プレビューを再読み込み"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>HTMLを生成する</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="プレビューを閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Main Preview Frame Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-6 bg-slate-900/60">
        
        {deviceMode === 'pc' ? (
          // PC Screen Frame
          <div className="w-full h-full max-w-6xl max-h-[88vh] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col transition-all duration-300">
            {/* Browser faux bar */}
            <div className="h-8 bg-slate-100 border-b border-slate-200 px-4 flex items-center gap-2 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
              </div>
              <div className="flex-1 max-w-sm mx-auto bg-white border border-slate-200 rounded px-3 py-0.5 text-xs text-slate-500 text-center font-mono truncate">
                https://your-domain.com/{currentPage.slug === 'index' ? '' : `${currentPage.slug}.html`}
              </div>
            </div>
            
            {/* iframe */}
            <iframe
              key={iframeKey}
              srcDoc={htmlContent}
              title="Site PC Preview"
              className="w-full flex-1 border-0"
              sandbox="allow-scripts"
            />
          </div>
        ) : (
          // Mobile Phone Device Frame
          <div className="relative w-[375px] h-[720px] max-h-[86vh] bg-slate-800 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 flex flex-col transition-all duration-300">
            {/* Phone Speaker Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-10 flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-700 rounded-full"></div>
            </div>

            {/* Mobile screen */}
            <div className="w-full h-full bg-white rounded-[34px] overflow-hidden flex flex-col pt-6">
              <iframe
                key={iframeKey}
                srcDoc={htmlContent}
                title="Site Mobile Preview"
                className="w-full flex-1 border-0"
                sandbox="allow-scripts"
              />
            </div>

            {/* Home indicator bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full"></div>
          </div>
        )}

      </div>
    </div>
  );
};

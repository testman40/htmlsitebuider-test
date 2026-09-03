import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  FileCode, 
  Check, 
  Copy, 
  FileText, 
  X, 
  Sparkles, 
  ArrowRight, 
  HelpCircle,
  ExternalLink,
  Layers,
  FolderArchive
} from 'lucide-react';
import { SiteData } from '../types/builder';
import { generatePageHtml } from '../utils/htmlGenerator';
import { exportSiteAsZip, downloadBlob } from '../utils/zipExporter';

interface ExportModalProps {
  site: SiteData;
  onClose: () => void;
  onOpenGuide: (guideType: 'upload' | 'domain') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ 
  site, 
  onClose,
  onOpenGuide 
}) => {
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);

  useEffect(() => {
    // Trigger celebratory confetti on open
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  const currentPage = site.pages[selectedPageIndex] || site.pages[0];
  const pageHtml = generatePageHtml(site, currentPage);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(pageHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsExportingZip(true);
      const zipBlob = await exportSiteAsZip(site);
      const safeSiteName = site.name.replace(/[^a-zA-Z0-9_\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff-]/g, '_') || 'website';
      downloadBlob(zipBlob, `${safeSiteName}_html_package.zip`);
    } catch (err) {
      console.error('Failed to export zip:', err);
      alert('ZIPファイルの生成に失敗しました。');
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-gray-200 font-sans">
        
        {/* Header with celebration */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                HTMLサイトが完成しました！
              </h2>
              <p className="text-xs text-blue-100">全{site.pages.length}ページのHTMLパッケージをダウンロードしてサーバーに公開しましょう</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Primary Action Card: Download Package */}
          <div className="p-6 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-semibold shadow-2xs">
                <FolderArchive className="w-3.5 h-3.5" />
                <span>推奨・一括ダウンロード</span>
              </div>
              <h3 className="text-base font-bold text-gray-900">
                完成サイトZIPパッケージ ({site.pages.length}ページ + 画像)
              </h3>
              <p className="text-xs text-gray-600 max-w-lg leading-relaxed">
                <code className="bg-white px-1.5 py-0.5 rounded font-bold text-blue-700 border border-blue-100">index.html</code>をはじめとする全HTMLファイルと、最適化済み画像、アップロード手順メモが1つのZIPにまとまっています。
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isExportingZip}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-sm rounded-md shadow-sm flex items-center justify-center gap-2 transition shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingZip ? 'ZIP生成中...' : 'ZIPファイルをダウンロード'}</span>
            </button>
          </div>

          {/* Critical Next Steps: PDF Guides Section (Section 6.7 of specs) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>ダウンロードした後のステップ (公式PDFガイド)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Guide 1: Upload instructions (Mandatory) */}
              <div 
                onClick={() => onOpenGuide('upload')}
                className="group relative p-5 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">必須・優先</span>
                    <span className="text-xs text-slate-500">PDF形式 / 印刷対応</span>
                  </div>
                  <h5 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition flex items-center gap-1.5">
                    <span>PDF①: サーバーアップロード手順書</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition" />
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    無料FTPソフト「FileZilla」の接続方法、エックスサーバー・ロリポップ・さくら・ConoHa WINGでの設置先フォルダ、404/403エラーの対処法を完全図解。
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>手順書を読む・PDF印刷</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Guide 2: Domain instructions (Optional) */}
              <div 
                onClick={() => onOpenGuide('domain')}
                className="group relative p-5 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">任意・ステップアップ</span>
                    <span className="text-xs text-slate-500">PDF形式 / 印刷対応</span>
                  </div>
                  <h5 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition flex items-center gap-1.5">
                    <span>PDF②: 独自ドメイン取得・DNS設定手順書</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition" />
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    お名前.comやムームードメインでのドメイン取得、各サーバーのネームサーバー設定一覧、DNS反映待ち時間の目安を初心者向けに解説。
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>ドメイン設定手順を読む</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

          {/* Code Inspector & Single Page Copy */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-slate-600" />
                <h4 className="text-sm font-bold text-slate-800">生成されたHTMLコードの確認・コピー</h4>
              </div>

              {/* Page selection pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {site.pages.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPageIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      selectedPageIndex === idx
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p.name} ({p.slug === 'index' ? 'index.html' : `${p.slug}.html`})
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-xl bg-slate-900 text-slate-100 text-xs font-mono border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                <span className="text-slate-400">
                  {currentPage.slug === 'index' ? 'index.html' : `${currentPage.slug}.html`}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition px-2.5 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">コピーしました</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>HTMLをコピー</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 max-h-56 overflow-y-auto overflow-x-auto text-slate-300 leading-relaxed selection:bg-blue-600">
                <code>{pageHtml}</code>
              </pre>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-xs text-slate-500">
            ※ サーバー代やホスティング費用は発生しません。ご自身のレンタルサーバーをご利用ください。
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition shadow-sm"
          >
            編集画面に戻る
          </button>
        </div>

      </div>
    </div>
  );
};

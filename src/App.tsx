/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteData } from './types/builder';
import { GenreSelector } from './components/GenreSelector';
import { MainEditor } from './components/Editor/MainEditor';
import { LegalModal } from './components/Legal/LegalModal';
import { GuideViewerModal } from './components/Guides/GuideViewerModal';
import { ContentProtection } from './components/Protection/ContentProtection';
import { FileText, ArrowRight, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentSite, setCurrentSite] = useState<SiteData | null>(null);
  const [savedSite, setSavedSite] = useState<SiteData | null>(null);
  const [showLegal, setShowLegal] = useState<boolean>(false);
  const [showGlobalGuide, setShowGlobalGuide] = useState<boolean>(false);

  // Check if there is a previously saved site in localStorage
  useEffect(() => {
    try {
      const lastSiteId = localStorage.getItem('webbuilder_last_site_id');
      if (lastSiteId) {
        const raw = localStorage.getItem('webbuilder_site_' + lastSiteId);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSavedSite(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSelectGenreSite = (site: SiteData) => {
    setCurrentSite(site);
  };

  const handleResumeSavedSite = () => {
    if (savedSite) {
      setCurrentSite(savedSite);
    }
  };

  const handleBackToGenres = () => {
    if (confirm('エディタを閉じてテンプレート一覧に戻りますか？現在の内容は自動保存されています。')) {
      setCurrentSite(null);
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased text-slate-800 bg-slate-50">
      
      {/* If editing a site, show MainEditor */}
      {currentSite ? (
        <MainEditor
          initialSite={currentSite}
          onBackToGenres={handleBackToGenres}
        />
      ) : (
        /* Otherwise show Genre Selector Start View */
        <div className="relative">
          {/* Top banner if saved site exists */}
          {savedSite && (
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-40 shadow-sm">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  前回の作成データがあります: <strong>{savedSite.name}</strong> ({savedSite.pages.length}ページ)
                </span>
              </div>
              <button
                onClick={handleResumeSavedSite}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
              >
                <span>続きから編集する</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Genre & Template Picker */}
          <GenreSelector
            onSelectGenre={handleSelectGenreSite}
            onOpenLegal={() => setShowLegal(true)}
          />

          {/* Persistent Help & Guide floating bar */}
          <div className="fixed bottom-4 right-4 z-30">
            <button
              onClick={() => setShowGlobalGuide(true)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-full shadow-lg border border-slate-200 flex items-center gap-2 transition hover:scale-105"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>サーバー公開手順書 (PDF)</span>
            </button>
          </div>
        </div>
      )}

      {/* Global Legal Modal */}
      {showLegal && (
        <LegalModal onClose={() => setShowLegal(false)} />
      )}

      {/* Global Guide Viewer Modal */}
      {showGlobalGuide && (
        <GuideViewerModal
          initialGuide="upload"
          onClose={() => setShowGlobalGuide(false)}
        />
      )}

      {/* Global Content & Source Protection */}
      <ContentProtection />

    </div>
  );
}

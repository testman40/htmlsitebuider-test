import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Eye, 
  Download, 
  Layers, 
  Image as ImageIcon, 
  Sliders, 
  Save, 
  Check, 
  AlertCircle, 
  Plus, 
  FileText, 
  HelpCircle, 
  User, 
  Sparkles, 
  ChevronDown,
  ArrowLeft,
  Settings,
  Palette
} from 'lucide-react';
import { 
  SiteData, 
  PageData, 
  BlockData, 
  BlockType, 
  BackgroundConfig, 
  UploadedImage, 
  UserSession 
} from '../../types/builder';
import { VIDEO_PRESETS } from '../../data/templates';
import { BlockSelector } from './BlockSelector';
import { BlockItemRenderer } from './BlockItemRenderer';
import { PageManagerModal } from './PageManagerModal';
import { BackgroundSettingsModal } from '../BackgroundSettingsModal';
import { ImageManagerModal } from '../ImageManagerModal';
import { PreviewModal } from '../PreviewModal';
import { ExportModal } from '../ExportModal';
import { GuideViewerModal } from '../Guides/GuideViewerModal';
import { MagicLinkModal } from '../Auth/MagicLinkModal';
import { LegalModal } from '../Legal/LegalModal';

interface MainEditorProps {
  initialSite: SiteData;
  onBackToGenres: () => void;
}

export const MainEditor: React.FC<MainEditorProps> = ({ initialSite, onBackToGenres }) => {
  const [site, setSite] = useState<SiteData>(() => {
    // Attempt to restore from local storage if existing
    const saved = localStorage.getItem('webbuilder_site_' + initialSite.site_id);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return initialSite;
  });

  const [currentPageId, setCurrentPageId] = useState<string>(site.pages[0]?.id || '');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [deviceView, setDeviceView] = useState<'pc' | 'mobile'>('pc');

  // Modals state
  const [showPageManager, setShowPageManager] = useState<boolean>(false);
  const [showBackgroundSettings, setShowBackgroundSettings] = useState<boolean>(false);
  const [showImageManager, setShowImageManager] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showExport, setShowExport] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [guideInitialType, setGuideInitialType] = useState<'upload' | 'domain'>('upload');
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [showLegal, setShowLegal] = useState<boolean>(false);

  // Auth session state
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('webbuilder_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt > Date.now()) return parsed;
      } catch {}
    }
    return null;
  });

  // Save notification toast state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Target block for image picker
  const [imagePickerTargetBlockId, setImagePickerTargetBlockId] = useState<string | null>(null);

  // Autosave interval (Section 6.6: 一定間隔・ページ切り替え時のオートセーブ)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      handleSaveSite(true); // Silent autosave
    }, 2500);

    return () => clearTimeout(timer);
  }, [site]);

  const currentPage = site.pages.find(p => p.id === currentPageId) || site.pages[0];

  // Save handler
  const handleSaveSite = (isAuto = false) => {
    try {
      setSaveStatus('saving');
      const updatedSite = {
        ...site,
        updatedAt: new Date().toISOString()
      };
      // Local persistence (emulating Cloudflare D1 JSON storage)
      localStorage.setItem('webbuilder_site_' + site.site_id, JSON.stringify(updatedSite));
      localStorage.setItem('webbuilder_last_site_id', site.site_id);

      setSaveStatus('saved');
      setSaveMessage(isAuto ? '自動保存済み' : '保存が完了しました');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2500);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setSaveMessage('保存に失敗しました');
    }
  };

  // Switch page with autosave
  const handleSelectPage = (pageId: string) => {
    handleSaveSite(true);
    setCurrentPageId(pageId);
    setSelectedBlockId(null);
  };

  // Page management
  const handleAddPage = (name: string, slug: string) => {
    const newPage: PageData = {
      id: 'page_' + Math.random().toString(36).substring(2, 9),
      name,
      slug,
      blocks: [
        {
          id: 'b_' + Math.random().toString(36).substring(2, 9),
          type: 'heading',
          level: 2,
          text: name,
          align: 'center'
        },
        {
          id: 'b_' + Math.random().toString(36).substring(2, 9),
          type: 'text',
          size: 'base',
          text: `${name}ページのコンテンツをここに入力してください。`,
          align: 'left'
        }
      ]
    };
    setSite(prev => ({
      ...prev,
      pages: [...prev.pages, newPage]
    }));
    setCurrentPageId(newPage.id);
  };

  const handleUpdatePage = (id: string, name: string, slug: string) => {
    setSite(prev => ({
      ...prev,
      pages: prev.pages.map(p => (p.id === id ? { ...p, name, slug } : p))
    }));
  };

  const handleDeletePage = (id: string) => {
    if (site.pages.length <= 1) return;
    setSite(prev => {
      const remaining = prev.pages.filter(p => p.id !== id);
      if (currentPageId === id) {
        setCurrentPageId(remaining[0].id);
      }
      return { ...prev, pages: remaining };
    });
  };

  const handleReorderPages = (reorderedPages: PageData[]) => {
    setSite(prev => ({ ...prev, pages: reorderedPages }));
  };

  // Block management
  const handleAddBlock = (type: BlockType) => {
    const newId = 'b_' + Math.random().toString(36).substring(2, 9);
    let newBlock: BlockData;

    switch (type) {
      case 'heading':
        newBlock = {
          id: newId,
          type: 'heading',
          level: 2,
          text: '新しい見出しテキスト',
          align: 'center'
        };
        break;
      case 'text':
        newBlock = {
          id: newId,
          type: 'text',
          size: 'base',
          text: 'ここをクリックして文章を入力してください。詳細な説明やメッセージを自由に記述できます。',
          align: 'left'
        };
        break;
      case 'image':
        newBlock = {
          id: newId,
          type: 'image',
          src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
          alt: '新しく追加された画像',
          caption: '画像の説明文',
          align: 'center',
          maxWidth: 'medium',
          rounded: true
        };
        break;
      case 'button':
        newBlock = {
          id: newId,
          type: 'button',
          label: 'ボタンをクリック',
          link: '#',
          variant: 'primary',
          align: 'center'
        };
        break;
      case 'card_grid':
        newBlock = {
          id: newId,
          type: 'card_grid',
          columns: 3,
          items: [
            {
              id: 'c_' + Math.random().toString(36).substring(2, 7),
              title: 'カード 1',
              description: 'カードの説明文です。',
              priceOrDate: '¥1,000',
              tag: 'NEW',
              imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80'
            },
            {
              id: 'c_' + Math.random().toString(36).substring(2, 7),
              title: 'カード 2',
              description: 'カードの説明文です。',
              priceOrDate: '¥2,000',
              imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80'
            }
          ]
        };
        break;
      case 'contact_form':
        newBlock = {
          id: newId,
          type: 'contact_form',
          title: 'お問い合わせフォーム',
          description: 'ご質問・ご要望はこちらからお寄せください。',
          buttonLabel: '送信する',
          fields: [
            { id: 'f1', label: 'お名前', type: 'text', required: true },
            { id: 'f2', label: 'メールアドレス', type: 'email', required: true },
            { id: 'f3', label: 'メッセージ', type: 'textarea', required: true }
          ]
        };
        break;
      case 'access_map':
        newBlock = {
          id: newId,
          type: 'access_map',
          title: '店舗・会場情報',
          address: '〒100-0001 東京都千代田区千代田1-1',
          accessInfo: '最寄り駅より徒歩3分',
          businessHours: '10:00〜19:00',
          phone: '03-0000-0000',
          mapEmbedQuery: 'Tokyo'
        };
        break;
      case 'divider':
        newBlock = {
          id: newId,
          type: 'divider',
          style: 'solid'
        };
        break;
    }

    setSite(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === currentPage.id ? { ...p, blocks: [...p.blocks, newBlock] } : p
      )
    }));
    setSelectedBlockId(newId);
  };

  const handleUpdateBlock = (updatedBlock: BlockData) => {
    setSite(prev => ({
      ...prev,
      pages: prev.pages.map(p =>
        p.id === currentPage.id
          ? {
              ...p,
              blocks: p.blocks.map(b => (b.id === updatedBlock.id ? updatedBlock : b))
            }
          : p
      )
    }));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentPage.blocks.length) return;

    const newBlocks = [...currentPage.blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;

    setSite(prev => ({
      ...prev,
      pages: prev.pages.map(p => (p.id === currentPage.id ? { ...p, blocks: newBlocks } : p))
    }));
  };

  const handleDuplicateBlock = (index: number) => {
    const target = currentPage.blocks[index];
    const dup: BlockData = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'b_' + Math.random().toString(36).substring(2, 9)
    };
    const newBlocks = [...currentPage.blocks];
    newBlocks.splice(index + 1, 0, dup);

    setSite(prev => ({
      ...prev,
      pages: prev.pages.map(p => (p.id === currentPage.id ? { ...p, blocks: newBlocks } : p))
    }));
    setSelectedBlockId(dup.id);
  };

  const handleDeleteBlock = (index: number) => {
    const newBlocks = currentPage.blocks.filter((_, i) => i !== index);
    setSite(prev => ({
      ...prev,
      pages: prev.pages.map(p => (p.id === currentPage.id ? { ...p, blocks: newBlocks } : p))
    }));
    setSelectedBlockId(null);
  };

  // Image Selection from Manager
  const handleOpenImagePicker = (targetBlockId: string) => {
    setImagePickerTargetBlockId(targetBlockId);
    setShowImageManager(true);
  };

  const handleSelectImageForBlock = (img: UploadedImage) => {
    if (!imagePickerTargetBlockId) return;
    const block = currentPage.blocks.find(b => b.id === imagePickerTargetBlockId);
    if (block && block.type === 'image') {
      handleUpdateBlock({
        ...block,
        src: img.dataUrl,
        alt: img.name
      });
    }
    setImagePickerTargetBlockId(null);
  };

  // Background video preset helper
  const videoPreset = site.background.type === 'video' && site.background.preset_id
    ? VIDEO_PRESETS.find(p => p.id === site.background.preset_id)
    : null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none text-slate-800">
      
      {/* 1. TOP HEADER TOOLBAR */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 sticky top-0 shadow-xs">
        
        {/* Left: Brand & Back to templates */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGenres}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition"
            title="ジャンル選択に戻る"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">テンプレート一覧</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Editable Site Name */}
          <input
            type="text"
            value={site.name}
            onChange={(e) => setSite(prev => ({ ...prev, name: e.target.value }))}
            className="font-bold text-sm text-slate-900 bg-transparent hover:bg-slate-50 px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-none transition max-w-[180px] sm:max-w-xs"
            title="クリックしてサイト名を変更"
          />

          {/* Autosave badge */}
          {saveStatus === 'saving' && (
            <span className="text-[11px] text-slate-400 font-medium animate-pulse hidden md:inline">
              編集中を保存中...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 hidden md:inline">
              <Check className="w-3.5 h-3.5" />
              <span>{saveMessage}</span>
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1 hidden md:inline">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{saveMessage}</span>
            </span>
          )}
        </div>

        {/* Center: Device Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setDeviceView('pc')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              deviceView === 'pc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="PC表示 (全幅)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">PC表示</span>
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              deviceView === 'mobile' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="スマホ表示 (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">スマホ表示</span>
          </button>
        </div>

        {/* Right: Actions (Preview, Guides, Export) */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => handleSaveSite(false)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            title="手動保存"
          >
            <Save className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 shadow-xs transition"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">プレビュー</span>
          </button>

          <button
            onClick={() => setShowExport(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>HTML生成</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Guides / Help */}
          <button
            onClick={() => {
              setGuideInitialType('upload');
              setShowGuide(true);
            }}
            className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
            title="公開マニュアル・PDFガイド"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* User Account / Magic Link */}
          <button
            onClick={() => setShowAuth(true)}
            className={`p-2 rounded-lg transition ${
              session ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title={session ? `ログイン中: ${session.email}` : 'メールログイン'}
          >
            <User className="w-4 h-4" />
          </button>

        </div>

      </header>

      {/* 2. SECONDARY SUB-HEADER (Page switcher & Visual Settings) */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Active Page Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="font-bold text-slate-400 mr-1 uppercase text-[10px] tracking-wider">ページ:</span>
          {site.pages.map((p) => {
            const isCurrent = p.id === currentPage.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPage(p.id)}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{p.name}</span>
                <span className={`text-[10px] opacity-75 font-mono`}>
                  ({p.slug === 'index' ? 'index.html' : `${p.slug}.html`})
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowPageManager(true)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-bold flex items-center gap-1 transition"
            title="ページの追加・並べ替え・削除"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ページ管理</span>
          </button>
        </div>

        {/* Visual Settings: Background & Images */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBackgroundSettings(true)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>背景設定 ({site.background.type === 'video' ? '動画' : site.background.type === 'image' ? '静止画' : '標準'})</span>
          </button>

          <button
            onClick={() => {
              setImagePickerTargetBlockId(null);
              setShowImageManager(true);
            }}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1.5 transition"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>画像マネージャー ({site.images.length}/20)</span>
          </button>
        </div>

      </div>

      {/* 3. MAIN WORKSPACE (Left sidebar blocks + Center canvas) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Block Library */}
        <aside className="w-72 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto hidden lg:block shrink-0 space-y-4">
          <BlockSelector onAddBlock={handleAddBlock} />

          {/* Beginner tips banner */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>初心者のための操作のコツ</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              キャンバス上のブロックをクリックすると、その場で文字や配置を直接編集できます。複数ページ間のリンクは自動的に連動します。
            </p>
          </div>
        </aside>

        {/* Center Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70 relative">
          
          {/* Simulated Site Canvas */}
          <div
            className={`transition-all duration-300 ${
              deviceView === 'pc'
                ? 'w-full max-w-4xl'
                : 'w-[375px] max-w-full shadow-2xl rounded-3xl border-4 border-slate-800 overflow-hidden my-4'
            }`}
          >
            {/* Background container emulation */}
            <div 
              className="min-h-[85vh] bg-white rounded-2xl shadow-sm border border-slate-300 flex flex-col relative overflow-hidden"
              style={{
                background: site.background.type === 'image' && site.background.src 
                  ? `url('${site.background.src}') center/cover no-repeat` 
                  : undefined
              }}
            >
              {/* Optional Background video or overlay emulation */}
              {site.background.type === 'video' && videoPreset && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  {videoPreset.videoUrl ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={videoPreset.fallbackImageUrl}
                      className="w-full h-full object-cover opacity-80"
                    >
                      <source src={videoPreset.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 opacity-50" />
                  )}
                  <div
                    className="absolute inset-0 bg-white"
                    style={{ opacity: (site.background.overlayOpacity ?? 20) / 100 }}
                  />
                </div>
              )}

              {site.background.type === 'image' && (
                <div
                  className="absolute inset-0 bg-white pointer-events-none z-0"
                  style={{ opacity: (site.background.overlayOpacity ?? 20) / 100 }}
                />
              )}

              {/* Faux Header & Navigation (Auto-generated as per specs) */}
              <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <span className="font-bold text-base text-slate-900 tracking-tight">
                  {site.name}
                </span>
                
                <nav className="flex items-center gap-1.5 flex-wrap">
                  {site.pages.map((p) => {
                    const isCur = p.id === currentPage.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPage(p.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                          isCur
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </nav>
              </header>

              {/* Page Content Card Container */}
              <div className="relative z-10 flex-1 p-6 sm:p-10 space-y-6">
                
                {/* Current Page Title Banner indicator */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md uppercase">
                      編集中ページ
                    </span>
                    <h2 className="text-sm font-bold text-slate-700">
                      {currentPage.name} ({currentPage.slug === 'index' ? 'index.html' : `${currentPage.slug}.html`})
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPageManager(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ページ名を変更
                  </button>
                </div>

                {/* Blocks List */}
                <div className="space-y-6">
                  {currentPage.blocks.map((block, index) => (
                    <BlockItemRenderer
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      canMoveUp={index > 0}
                      canMoveDown={index < currentPage.blocks.length - 1}
                      allPages={site.pages}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onUpdate={handleUpdateBlock}
                      onMoveUp={() => handleMoveBlock(index, 'up')}
                      onMoveDown={() => handleMoveBlock(index, 'down')}
                      onDuplicate={() => handleDuplicateBlock(index)}
                      onDelete={() => handleDeleteBlock(index)}
                      onOpenImagePicker={handleOpenImagePicker}
                    />
                  ))}
                </div>

                {/* Add block CTA inside canvas */}
                <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-full text-center mb-1">
                    パーツを新しく追加:
                  </span>
                  {(['heading', 'text', 'image', 'button', 'card_grid', 'contact_form'] as BlockType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddBlock(t)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold border border-slate-200 transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>
                        {t === 'heading' ? '見出し' :
                         t === 'text' ? 'テキスト' :
                         t === 'image' ? '画像' :
                         t === 'button' ? 'ボタン' :
                         t === 'card_grid' ? 'カード一覧' : 'フォーム'}
                      </span>
                    </button>
                  ))}
                </div>

              </div>

              {/* Faux Footer (Auto-generated as per specs) */}
              <footer className="relative z-10 border-t border-slate-100 bg-white/90 px-6 py-6 text-center text-xs text-slate-400 mt-auto">
                <div className="flex justify-center gap-4 mb-2">
                  {site.pages.map(p => (
                    <span key={p.id} className="text-slate-500 hover:underline cursor-pointer" onClick={() => handleSelectPage(p.id)}>
                      {p.name}
                    </span>
                  ))}
                </div>
                <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
              </footer>

            </div>
          </div>

        </main>
      </div>

      {/* 4. MODALS & POPUPS */}

      {/* Page Manager Modal */}
      {showPageManager && (
        <PageManagerModal
          pages={site.pages}
          currentPageId={currentPage.id}
          onSelectPage={handleSelectPage}
          onAddPage={handleAddPage}
          onUpdatePage={handleUpdatePage}
          onDeletePage={handleDeletePage}
          onReorderPages={handleReorderPages}
          onClose={() => setShowPageManager(false)}
        />
      )}

      {/* Background Settings Modal */}
      {showBackgroundSettings && (
        <BackgroundSettingsModal
          currentBackground={site.background}
          uploadedImages={site.images}
          onUpdateBackground={(bg) => setSite(prev => ({ ...prev, background: bg }))}
          onAddUploadedImage={(img) => setSite(prev => ({ ...prev, images: [...prev.images, img] }))}
          onClose={() => setShowBackgroundSettings(false)}
        />
      )}

      {/* Image Manager Modal */}
      {showImageManager && (
        <ImageManagerModal
          images={site.images}
          onAddImage={(img) => setSite(prev => ({ ...prev, images: [...prev.images, img] }))}
          onDeleteImage={(id) => setSite(prev => ({ ...prev, images: prev.images.filter(i => i.id !== id) }))}
          onSelectImage={imagePickerTargetBlockId ? handleSelectImageForBlock : undefined}
          onClose={() => {
            setShowImageManager(false);
            setImagePickerTargetBlockId(null);
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          site={site}
          initialPageId={currentPage.id}
          onClose={() => setShowPreview(false)}
          onExport={() => {
            setShowPreview(false);
            setShowExport(true);
          }}
        />
      )}

      {/* Export & Celebration Modal */}
      {showExport && (
        <ExportModal
          site={site}
          onClose={() => setShowExport(false)}
          onOpenGuide={(type) => {
            setGuideInitialType(type);
            setShowGuide(true);
          }}
        />
      )}

      {/* PDF Guides Viewer Modal */}
      {showGuide && (
        <GuideViewerModal
          initialGuide={guideInitialType}
          onClose={() => setShowGuide(false)}
        />
      )}

      {/* Magic Link Auth Modal */}
      {showAuth && (
        <MagicLinkModal
          currentSession={session}
          onLoginSuccess={(newSession) => {
            setSession(newSession);
            localStorage.setItem('webbuilder_user_session', JSON.stringify(newSession));
          }}
          onLogout={() => {
            setSession(null);
            localStorage.removeItem('webbuilder_user_session');
          }}
          onClose={() => setShowAuth(false)}
        />
      )}

      {/* Legal Modal */}
      {showLegal && (
        <LegalModal onClose={() => setShowLegal(false)} />
      )}

    </div>
  );
};

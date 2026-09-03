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
  Palette,
  Layout,
  ExternalLink,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown
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

  const selectedBlock = currentPage.blocks.find(b => b.id === selectedBlockId);
  const selectedBlockIndex = currentPage.blocks.findIndex(b => b.id === selectedBlockId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col select-none text-gray-800 font-sans">
      
      {/* 1. TOP HEADER TOOLBAR */}
      <header className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-30 sticky top-0 shrink-0 shadow-2xs">
        
        {/* Left: Brand & Back to templates */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBackToGenres}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 px-2 py-1.5 rounded-md hover:bg-gray-100 transition"
            title="ジャンル選択に戻る"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">テンプレート</span>
          </button>

          <div className="h-5 w-px bg-gray-200 hidden sm:block" />

          {/* App Logo */}
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white shadow-xs shrink-0">
            <Layout className="w-4 h-4" />
          </div>

          {/* Project Title Pill */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 font-medium hidden md:inline">Project:</span>
            <input
              type="text"
              value={site.name}
              onChange={(e) => setSite(prev => ({ ...prev, name: e.target.value }))}
              className="font-semibold text-xs text-gray-900 bg-gray-100 hover:bg-gray-200/70 px-2.5 py-1 rounded-md border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none transition max-w-[130px] sm:max-w-[180px]"
              title="クリックしてサイト名を変更"
            />
          </div>

          {/* Autosave badge */}
          {saveStatus === 'saving' && (
            <span className="text-[11px] text-gray-400 font-medium animate-pulse hidden md:inline">
              保存中...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 hidden md:inline">
              <Check className="w-3.5 h-3.5" />
              <span>{saveMessage}</span>
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 hidden md:inline">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{saveMessage}</span>
            </span>
          )}
        </div>

        {/* Center: Device Switcher */}
        <div className="flex items-center bg-gray-100 p-1 rounded-md border border-gray-200">
          <button
            onClick={() => setDeviceView('pc')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
              deviceView === 'pc' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
            title="PC表示 (全幅)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">PC表示</span>
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition ${
              deviceView === 'mobile' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
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
            className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition"
            title="手動保存"
          >
            <Save className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-xs transition"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">プレビュー</span>
          </button>

          <button
            onClick={() => setShowExport(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>HTML生成</span>
          </button>

          <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />

          {/* Guides / Help */}
          <button
            onClick={() => {
              setGuideInitialType('upload');
              setShowGuide(true);
            }}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-100 transition"
            title="公開マニュアル・PDFガイド"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* User Account / Magic Link */}
          <button
            onClick={() => setShowAuth(true)}
            className={`p-2 rounded-md transition ${
              session ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title={session ? `ログイン中: ${session.email}` : 'メールログイン'}
          >
            <User className="w-4 h-4" />
          </button>

        </div>

      </header>

      {/* 2. SECONDARY SUB-HEADER (Page switcher & Visual Settings) */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        
        {/* Active Page Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="font-bold text-gray-400 mr-1 uppercase text-[10px] tracking-wider">ページ:</span>
          {site.pages.map((p) => {
            const isCurrent = p.id === currentPage.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPage(p.id)}
                className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="px-2.5 py-1 rounded-md text-blue-600 hover:bg-blue-50 font-medium flex items-center gap-1 border border-blue-200 transition"
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
            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-200 flex items-center gap-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>背景設定 ({site.background.type === 'video' ? '動画' : site.background.type === 'image' ? '静止画' : '標準'})</span>
          </button>

          <button
            onClick={() => {
              setImagePickerTargetBlockId(null);
              setShowImageManager(true);
            }}
            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-200 flex items-center gap-1.5 transition"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>画像マネージャー ({site.images.length}/20)</span>
          </button>
        </div>

      </div>

      {/* 3. MAIN WORKSPACE (Left sidebar blocks + Center canvas + Right Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Block Library */}
        <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto hidden lg:flex flex-col shrink-0 space-y-4">
          <BlockSelector onAddBlock={handleAddBlock} />

          {/* Beginner tips banner */}
          <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs space-y-1.5 mt-auto">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>操作のコツ</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              キャンバス上のブロックをクリックすると直接文字編集や並べ替えができます。右側のプロパティパネルでも調整可能です。
            </p>
          </div>
        </aside>

        {/* Center Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-[#E2E8F0] relative">
          
          {/* Simulated Site Canvas Mockup Window */}
          <div
            className={`transition-all duration-300 ${
              deviceView === 'pc'
                ? 'w-full max-w-4xl bg-white shadow-2xl rounded-lg border border-slate-300/80 flex flex-col overflow-hidden my-auto'
                : 'w-[375px] max-w-full shadow-2xl rounded-3xl border-8 border-slate-800 bg-white overflow-hidden my-4 flex flex-col'
            }`}
          >
            {/* Browser Mockup Window Titlebar */}
            {deviceView === 'pc' ? (
              <div className="h-10 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50 shrink-0 select-none">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2.5 h-2.5 bg-[#FF5F57] rounded-full border border-red-500/20" />
                  <div className="w-2.5 h-2.5 bg-[#FEBC2E] rounded-full border border-yellow-500/20" />
                  <div className="w-2.5 h-2.5 bg-[#28C840] rounded-full border border-green-500/20" />
                </div>
                <div className="text-[11px] font-mono text-gray-500 bg-white px-3 py-1 rounded border border-gray-200 shadow-2xs flex items-center gap-1.5">
                  <span className="text-emerald-500 text-xs">🔒</span>
                  <span>https://localhost:3000/{currentPage.slug === 'index' ? '' : `${currentPage.slug}.html`}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 font-medium">1280 × 800</span>
              </div>
            ) : (
              <div className="h-7 bg-slate-800 flex items-center justify-between px-6 text-[11px] text-slate-300 select-none">
                <span>9:41</span>
                <div className="w-16 h-3 bg-slate-900 rounded-full" />
                <span>5G</span>
              </div>
            )}

            {/* Background container emulation */}
            <div 
              className="min-h-[80vh] bg-white flex flex-col relative overflow-hidden"
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
              <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                <span className="font-bold text-base text-gray-900 tracking-tight">
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
                        className={`text-xs font-medium px-2.5 py-1 rounded-md transition ${
                          isCur
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-100'
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
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase font-mono">
                      編集中ページ
                    </span>
                    <h2 className="text-sm font-semibold text-gray-800">
                      {currentPage.name} ({currentPage.slug === 'index' ? 'index.html' : `${currentPage.slug}.html`})
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPageManager(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ページ設定
                  </button>
                </div>

                {/* Blocks List */}
                <div className="space-y-4">
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
                <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs font-semibold text-gray-400 w-full text-center mb-1">
                    パーツを新しく追加:
                  </span>
                  {(['heading', 'text', 'image', 'button', 'card_grid', 'contact_form'] as BlockType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddBlock(t)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-md text-xs font-medium border border-gray-200 transition flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
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
              <footer className="relative z-10 border-t border-gray-200 bg-white/90 px-6 py-6 text-center text-xs text-gray-400 mt-auto">
                <div className="flex justify-center gap-4 mb-2">
                  {site.pages.map(p => (
                    <span key={p.id} className="text-gray-500 hover:underline cursor-pointer" onClick={() => handleSelectPage(p.id)}>
                      {p.name}
                    </span>
                  ))}
                </div>
                <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
              </footer>

            </div>
          </div>

        </main>

        {/* Right Sidebar: Style & Properties Inspector */}
        <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto hidden xl:flex flex-col shrink-0 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-gray-900">プロパティ設定</h3>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded font-mono">
              {selectedBlock ? selectedBlock.type : 'ページ'}
            </span>
          </div>

          {selectedBlock ? (
            <div className="space-y-4 text-xs">
              {/* Quick Actions for Selected Block */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  ブロックの操作
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={selectedBlockIndex <= 0}
                    onClick={() => handleMoveBlock(selectedBlockIndex, 'up')}
                    className="p-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-white text-gray-700 disabled:opacity-30 flex items-center justify-center gap-1.5 transition font-medium"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>上へ移動</span>
                  </button>

                  <button
                    type="button"
                    disabled={selectedBlockIndex >= currentPage.blocks.length - 1}
                    onClick={() => handleMoveBlock(selectedBlockIndex, 'down')}
                    className="p-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-white text-gray-700 disabled:opacity-30 flex items-center justify-center gap-1.5 transition font-medium"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>下へ移動</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicateBlock(selectedBlockIndex)}
                    className="p-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-white text-gray-700 flex items-center justify-center gap-1.5 transition font-medium"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>複製する</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteBlock(selectedBlockIndex);
                      setSelectedBlockId(null);
                    }}
                    className="p-2 border border-rose-200 rounded-md bg-rose-50/50 hover:bg-rose-50 text-rose-700 flex items-center justify-center gap-1.5 transition font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>削除する</span>
                  </button>
                </div>
              </div>

              {/* Block Details Info */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-gray-500">
                  <span>ブロックID:</span>
                  <span className="font-mono text-[10px] text-gray-700">{selectedBlock.id.slice(0, 10)}...</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>タイプ:</span>
                  <span className="font-bold text-gray-900">{selectedBlock.type}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>位置:</span>
                  <span className="font-mono text-gray-700">{selectedBlockIndex + 1} / {currentPage.blocks.length}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-gray-600 text-[11px] leading-relaxed">
                キャンバス上のブロックをクリックすると、テキストやスタイルをその場で直接編集できます。
              </div>

              <button
                type="button"
                onClick={() => setSelectedBlockId(null)}
                className="w-full py-1.5 text-center text-xs text-gray-500 hover:text-gray-800 font-medium transition"
              >
                選択を解除
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  ページ情報
                </span>
                <div className="flex justify-between items-center text-gray-600">
                  <span>ページ名:</span>
                  <span className="font-bold text-gray-900">{currentPage.name}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>ファイル名:</span>
                  <span className="font-mono text-gray-700">{currentPage.slug}.html</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>ブロック数:</span>
                  <span className="font-bold text-blue-600">{currentPage.blocks.length} 個</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>背景タイプ:</span>
                  <span className="font-medium text-gray-800">
                    {site.background.type === 'video' ? '動画' : site.background.type === 'image' ? '静止画' : '標準'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  ショートカット
                </span>
                <button
                  type="button"
                  onClick={() => setShowPageManager(true)}
                  className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-white text-gray-700 flex items-center justify-between transition font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>ページ一覧・順序変更</span>
                  </span>
                  <span className="text-gray-400">&gt;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBackgroundSettings(true)}
                  className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-white text-gray-700 flex items-center justify-between transition font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>背景デザイン設定</span>
                  </span>
                  <span className="text-gray-400">&gt;</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowImageManager(true)}
                  className="w-full p-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-white text-gray-700 flex items-center justify-between transition font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>画像ライブラリ</span>
                  </span>
                  <span className="text-gray-400">&gt;</span>
                </button>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-[11px] leading-relaxed">
                キャンバス上のパーツをクリックすると、プロパティや並べ替えの個別操作がここで行えます。
              </div>
            </div>
          )}
        </aside>

      </div>

      {/* 4. BOTTOM STATUS BAR */}
      <footer className="h-6 bg-gray-900 text-white flex items-center justify-between px-4 shrink-0 text-[10px] text-gray-400 font-mono select-none z-30">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ステータス: {saveStatus === 'saving' ? '保存中...' : '準備完了'}</span>
          </span>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="truncate max-w-xs text-gray-300 hidden sm:inline">
            階層: {site.name} &gt; {currentPage.name} &gt; {selectedBlock ? selectedBlock.type : '全体'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline">オートセーブ: 有効</span>
          <span className="text-gray-700 hidden md:inline">|</span>
          <span>HTML Builder v2.4</span>
        </div>
      </footer>

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

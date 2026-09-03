import React from 'react';
import { 
  Heading, 
  Type, 
  Image as ImageIcon, 
  MousePointerClick, 
  LayoutGrid, 
  Mail, 
  MapPin, 
  Minus,
  Plus
} from 'lucide-react';
import { BlockType } from '../../types/builder';

interface BlockSelectorProps {
  onAddBlock: (type: BlockType) => void;
}

export const BlockSelector: React.FC<BlockSelectorProps> = ({ onAddBlock }) => {
  const blockItems: { type: BlockType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      type: 'heading',
      label: '見出し',
      icon: <Heading className="w-5 h-5 text-blue-600" />,
      desc: '大見出し・中見出し・キャッチコピー'
    },
    {
      type: 'text',
      label: 'テキスト本文',
      icon: <Type className="w-5 h-5 text-indigo-600" />,
      desc: '段落・説明文・お知らせ本文'
    },
    {
      type: 'image',
      label: '画像',
      icon: <ImageIcon className="w-5 h-5 text-emerald-600" />,
      desc: '写真・バナー・alt・キャプション'
    },
    {
      type: 'button',
      label: 'ボタン',
      icon: <MousePointerClick className="w-5 h-5 text-amber-600" />,
      desc: '他ページへの移動・リンク'
    },
    {
      type: 'card_grid',
      label: '商品・作品カード',
      icon: <LayoutGrid className="w-5 h-5 text-purple-600" />,
      desc: 'メニュー・商品・実績のグリッド'
    },
    {
      type: 'contact_form',
      label: 'お問い合わせフォーム',
      icon: <Mail className="w-5 h-5 text-sky-600" />,
      desc: 'お名前・メール・連絡フォーム'
    },
    {
      type: 'access_map',
      label: '店舗アクセス地図',
      icon: <MapPin className="w-5 h-5 text-rose-600" />,
      desc: '住所・営業時間・Googleマップ'
    },
    {
      type: 'divider',
      label: '区切り線・余白',
      icon: <Minus className="w-5 h-5 text-slate-500" />,
      desc: 'セクションの境界線・スペース'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          ブロックを追加
        </span>
        <span className="text-[11px] text-slate-400">クリックで下部に追加</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {blockItems.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onAddBlock(item.type)}
            className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition flex items-start gap-2.5 group"
          >
            <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-xs transition shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-blue-600 transition">
                {item.label}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {item.desc}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Heading, 
  Type, 
  Image as ImageIcon, 
  MousePointerClick, 
  LayoutGrid, 
  Mail, 
  MapPin, 
  Minus,
  Search,
  Plus
} from 'lucide-react';
import { BlockType } from '../../types/builder';

interface BlockSelectorProps {
  onAddBlock: (type: BlockType) => void;
}

export const BlockSelector: React.FC<BlockSelectorProps> = ({ onAddBlock }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const blockItems: { type: BlockType; label: string; icon: React.ReactNode; desc: string; category: 'typography' | 'media' | 'layout' | 'interactive' }[] = [
    {
      type: 'heading',
      label: '見出し',
      icon: <Heading className="w-4 h-4 text-blue-600" />,
      desc: '大見出し・キャッチコピー',
      category: 'typography'
    },
    {
      type: 'text',
      label: 'テキスト本文',
      icon: <Type className="w-4 h-4 text-indigo-600" />,
      desc: '段落・説明文・案内文',
      category: 'typography'
    },
    {
      type: 'image',
      label: '画像バナー',
      icon: <ImageIcon className="w-4 h-4 text-emerald-600" />,
      desc: '写真・バナー・alt属性対応',
      category: 'media'
    },
    {
      type: 'button',
      label: 'リンクボタン',
      icon: <MousePointerClick className="w-4 h-4 text-amber-600" />,
      desc: '他ページ遷移・外部リンク',
      category: 'interactive'
    },
    {
      type: 'card_grid',
      label: 'カードグリッド',
      icon: <LayoutGrid className="w-4 h-4 text-purple-600" />,
      desc: 'メニュー・商品・実績一覧',
      category: 'layout'
    },
    {
      type: 'contact_form',
      label: '問い合わせフォーム',
      icon: <Mail className="w-4 h-4 text-sky-600" />,
      desc: 'お名前・メール・相談入力',
      category: 'interactive'
    },
    {
      type: 'access_map',
      label: 'アクセス地図',
      icon: <MapPin className="w-4 h-4 text-rose-600" />,
      desc: '住所・営業時間・マップ表示',
      category: 'media'
    },
    {
      type: 'divider',
      label: '区切り線・余白',
      icon: <Minus className="w-4 h-4 text-gray-500" />,
      desc: 'セクション境界線・スペース',
      category: 'layout'
    }
  ];

  const filteredItems = blockItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="パーツを検索..."
          className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-blue-500 text-gray-800 placeholder-gray-400 transition"
        />
      </div>

      {/* Block List */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            パーツライブラリ
          </h3>
          <span className="text-[10px] text-gray-400 font-mono">
            {filteredItems.length} 個
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {filteredItems.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => onAddBlock(item.type)}
              className="p-2.5 border border-gray-200 rounded-lg bg-gray-50/80 hover:border-blue-400 hover:bg-white cursor-pointer transition shadow-2xs flex items-center justify-between group text-left w-full"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-md bg-white border border-gray-200/80 group-hover:border-blue-200 group-hover:bg-blue-50/50 transition shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-gray-800 block truncate group-hover:text-blue-600 transition">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-500 block truncate">
                    {item.desc}
                  </span>
                </div>
              </div>
              <Plus className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 shrink-0 transition" />
            </button>
          ))}

          {filteredItems.length === 0 && (
            <div className="p-4 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
              一致するパーツが見つかりませんでした
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

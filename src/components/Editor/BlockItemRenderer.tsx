import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Copy, 
  Settings2, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ExternalLink,
  Plus,
  X
} from 'lucide-react';
import { BlockData, HeadingBlock, TextBlock, ImageBlock, ButtonBlock, CardGridBlock, ContactFormBlock, AccessMapBlock, DividerBlock, PageData, UploadedImage } from '../../types/builder';

interface BlockItemRendererProps {
  block: BlockData;
  isSelected: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  allPages: PageData[];
  onSelect: () => void;
  onUpdate: (updatedBlock: BlockData) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onOpenImagePicker: (targetBlockId: string) => void;
}

export const BlockItemRenderer: React.FC<BlockItemRendererProps> = ({
  block,
  isSelected,
  canMoveUp,
  canMoveDown,
  allPages,
  onSelect,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onOpenImagePicker
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative group rounded-2xl transition-all duration-200 p-5 ${
        isSelected
          ? 'ring-2 ring-blue-600 bg-blue-50/20 shadow-md border border-blue-200'
          : 'hover:bg-slate-50/80 border border-transparent hover:border-slate-200'
      }`}
    >
      {/* Top Floating Actions Bar */}
      <div
        className={`absolute -top-3.5 right-4 flex items-center gap-1 bg-white border border-slate-200 rounded-lg shadow-sm px-1.5 py-0.5 z-20 transition-opacity ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <span className="text-[10px] font-bold text-slate-400 px-1.5 border-r border-slate-200">
          {block.type === 'heading' ? '見出し' :
           block.type === 'text' ? 'テキスト' :
           block.type === 'image' ? '画像' :
           block.type === 'button' ? 'ボタン' :
           block.type === 'card_grid' ? 'カード一覧' :
           block.type === 'contact_form' ? 'お問い合わせ' :
           block.type === 'access_map' ? 'アクセス地図' : '区切り'}
        </span>

        <button
          type="button"
          disabled={!canMoveUp}
          onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
          className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-20 rounded"
          title="上へ移動"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          disabled={!canMoveDown}
          onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
          className="p-1 text-slate-500 hover:text-blue-600 disabled:opacity-20 rounded"
          title="下へ移動"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="p-1 text-slate-500 hover:text-blue-600 rounded"
          title="複製"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1 text-slate-500 hover:text-rose-600 rounded"
          title="削除"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Block-specific content & inline controls */}
      {block.type === 'heading' && (
        <HeadingBlockEditor
          block={block}
          isSelected={isSelected}
          onChange={onUpdate}
        />
      )}

      {block.type === 'text' && (
        <TextBlockEditor
          block={block}
          isSelected={isSelected}
          onChange={onUpdate}
        />
      )}

      {block.type === 'image' && (
        <ImageBlockEditor
          block={block}
          isSelected={isSelected}
          onChange={onUpdate}
          onOpenPicker={() => onOpenImagePicker(block.id)}
        />
      )}

      {block.type === 'button' && (
        <ButtonBlockEditor
          block={block}
          isSelected={isSelected}
          allPages={allPages}
          onChange={onUpdate}
        />
      )}

      {block.type === 'card_grid' && (
        <CardGridBlockEditor
          block={block}
          isSelected={isSelected}
          onChange={onUpdate}
          onOpenImagePicker={() => onOpenImagePicker(block.id)}
        />
      )}

      {block.type === 'contact_form' && (
        <ContactFormBlockEditor
          block={block}
          isSelected={isSelected}
          onChange={onUpdate}
        />
      )}

      {block.type === 'access_map' && (
        <AccessMapBlockEditor
          block={block}
          isSelected={isSelected}
          onChange={onUpdate}
        />
      )}

      {block.type === 'divider' && (
        <DividerBlockEditor
          block={block}
          isSelected={isSelected}
          onChange={onUpdate}
        />
      )}
    </div>
  );
};

/* ================= Sub Editors ================= */

const HeadingBlockEditor: React.FC<{
  block: HeadingBlock;
  isSelected: boolean;
  onChange: (b: HeadingBlock) => void;
}> = ({ block, isSelected, onChange }) => {
  return (
    <div className={`space-y-2 text-${block.align || 'center'}`}>
      {isSelected && (
        <div className="flex flex-wrap items-center gap-2 mb-2 p-2 bg-slate-100 rounded-xl text-xs">
          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200">
            {([1, 2, 3] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => onChange({ ...block, level: lvl })}
                className={`px-2 py-0.5 rounded font-bold ${
                  block.level === lvl ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                H{lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200">
            {(['left', 'center', 'right'] as const).map(align => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...block, align })}
                className={`p-1 rounded ${
                  block.align === align ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {align === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> :
                 align === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> :
                 <AlignRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={block.badge || ''}
            onChange={(e) => onChange({ ...block, badge: e.target.value })}
            placeholder="バッジ(任意)"
            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
          />
        </div>
      )}

      {block.badge && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
          {block.badge}
        </span>
      )}

      <input
        type="text"
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="見出しテキストを入力..."
        className={`w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none font-bold text-slate-900 text-${block.align || 'center'} ${
          block.level === 1 ? 'text-2xl sm:text-3xl' : block.level === 2 ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
        }`}
      />

      <input
        type="text"
        value={block.subtext || ''}
        onChange={(e) => onChange({ ...block, subtext: e.target.value })}
        placeholder="補足サブテキスト(任意)..."
        className={`w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-xs sm:text-sm text-slate-500 text-${block.align || 'center'}`}
      />
    </div>
  );
};

const TextBlockEditor: React.FC<{
  block: TextBlock;
  isSelected: boolean;
  onChange: (b: TextBlock) => void;
}> = ({ block, isSelected, onChange }) => {
  return (
    <div className={`space-y-2 text-${block.align || 'left'}`}>
      {isSelected && (
        <div className="flex flex-wrap items-center gap-2 mb-2 p-2 bg-slate-100 rounded-xl text-xs">
          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200">
            {(['sm', 'base', 'lg', 'lead'] as const).map(sz => (
              <button
                key={sz}
                type="button"
                onClick={() => onChange({ ...block, size: sz })}
                className={`px-2 py-0.5 rounded font-bold ${
                  block.size === sz ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sz.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200">
            {(['left', 'center', 'right'] as const).map(align => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...block, align })}
                className={`p-1 rounded ${
                  block.align === align ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {align === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> :
                 align === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> :
                 <AlignRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea
        rows={3}
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder="本文テキストを入力してください..."
        className={`w-full bg-transparent border border-transparent focus:border-blue-400 rounded-xl p-2 focus:outline-none focus:bg-white text-slate-700 leading-relaxed text-${block.align || 'left'} ${
          block.size === 'sm' ? 'text-xs' : block.size === 'lg' ? 'text-lg' : block.size === 'lead' ? 'text-lg font-medium text-slate-900' : 'text-sm'
        }`}
      />
    </div>
  );
};

const ImageBlockEditor: React.FC<{
  block: ImageBlock;
  isSelected: boolean;
  onChange: (b: ImageBlock) => void;
  onOpenPicker: () => void;
}> = ({ block, isSelected, onChange, onOpenPicker }) => {
  return (
    <div className={`space-y-3 flex flex-col ${
      block.align === 'left' ? 'items-start' : block.align === 'right' ? 'items-end' : 'items-center'
    }`}>
      {isSelected && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2 p-2 bg-slate-100 rounded-xl text-xs">
          <button
            type="button"
            onClick={onOpenPicker}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>画像をライブラリから選択 / アップロード</span>
          </button>

          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200">
            {(['small', 'medium', 'large', 'full'] as const).map(w => (
              <button
                key={w}
                type="button"
                onClick={() => onChange({ ...block, maxWidth: w })}
                className={`px-2 py-0.5 rounded font-bold ${
                  block.maxWidth === w ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {w === 'small' ? '小' : w === 'medium' ? '中' : w === 'large' ? '大' : '最大'}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
            <input
              type="checkbox"
              checked={block.rounded}
              onChange={(e) => onChange({ ...block, rounded: e.target.checked })}
              className="rounded"
            />
            <span>角丸</span>
          </label>
        </div>
      )}

      {/* Image Preview */}
      <div 
        onClick={onOpenPicker}
        className={`cursor-pointer overflow-hidden border border-slate-200 relative group/img ${
          block.maxWidth === 'small' ? 'w-60' : block.maxWidth === 'medium' ? 'w-96' : block.maxWidth === 'large' ? 'w-full max-w-2xl' : 'w-full'
        } ${block.rounded ? 'rounded-2xl' : 'rounded-none'}`}
      >
        <img
          src={block.src}
          alt={block.alt}
          className="w-full h-auto object-cover max-h-96"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white text-xs font-bold transition">
          クリックして画像を変更
        </div>
      </div>

      {/* Captions & Alt input */}
      <div className="w-full max-w-md space-y-1 text-center">
        <input
          type="text"
          value={block.caption || ''}
          onChange={(e) => onChange({ ...block, caption: e.target.value })}
          placeholder="キャプション(画面に表示される説明文、任意)"
          className="w-full text-center text-xs text-slate-500 bg-transparent border-b border-transparent focus:border-slate-300 focus:outline-none"
        />
        {isSelected && (
          <input
            type="text"
            value={block.alt}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
            placeholder="代替テキスト(alt属性: 画像の説明)"
            className="w-full text-center text-[11px] text-slate-400 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};

const ButtonBlockEditor: React.FC<{
  block: ButtonBlock;
  isSelected: boolean;
  allPages: PageData[];
  onChange: (b: ButtonBlock) => void;
}> = ({ block, isSelected, allPages, onChange }) => {
  return (
    <div className={`space-y-3 flex flex-col ${
      block.align === 'left' ? 'items-start' : block.align === 'right' ? 'items-end' : 'items-center'
    }`}>
      {isSelected && (
        <div className="w-full max-w-xl flex flex-wrap items-center gap-2 mb-2 p-2 bg-slate-100 rounded-xl text-xs">
          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200">
            {(['primary', 'secondary', 'outline'] as const).map(variant => (
              <button
                key={variant}
                type="button"
                onClick={() => onChange({ ...block, variant })}
                className={`px-2 py-0.5 rounded font-bold ${
                  block.variant === variant ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {variant === 'primary' ? 'メイン色' : variant === 'secondary' ? 'アクセント' : '枠線のみ'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200">
            {(['left', 'center', 'right'] as const).map(align => (
              <button
                key={align}
                type="button"
                onClick={() => onChange({ ...block, align })}
                className={`p-1 rounded ${
                  block.align === align ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {align === 'left' ? <AlignLeft className="w-3.5 h-3.5" /> :
                 align === 'center' ? <AlignCenter className="w-3.5 h-3.5" /> :
                 <AlignRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>

          {/* Quick link to other pages */}
          <select
            value={block.link}
            onChange={(e) => onChange({ ...block, link: e.target.value })}
            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
          >
            <option value="#">-- 移動先ページを選択 --</option>
            {allPages.map(p => (
              <option key={p.id} value={p.slug === 'index' ? 'index.html' : `${p.slug}.html`}>
                {p.name} ページ
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Button Preview & In-place label edit */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={block.label}
          onChange={(e) => onChange({ ...block, label: e.target.value })}
          placeholder="ボタン名を入力..."
          className={`px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer shadow-sm text-center ${
            block.variant === 'primary' ? 'bg-blue-600 text-white' :
            block.variant === 'secondary' ? 'bg-amber-600 text-white' :
            'border-2 border-blue-600 text-blue-600 bg-white'
          }`}
        />
      </div>

      {isSelected && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>リンク先URL:</span>
          <input
            type="text"
            value={block.link}
            onChange={(e) => onChange({ ...block, link: e.target.value })}
            placeholder="menu.html または https://..."
            className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded font-mono text-xs w-56"
          />
        </div>
      )}
    </div>
  );
};

const CardGridBlockEditor: React.FC<{
  block: CardGridBlock;
  isSelected: boolean;
  onChange: (b: CardGridBlock) => void;
  onOpenImagePicker: () => void;
}> = ({ block, isSelected, onChange, onOpenImagePicker }) => {
  const addItem = () => {
    const newItem = {
      id: 'item_' + Math.random().toString(36).substring(2, 7),
      title: '新しいアイテム',
      description: 'アイテムの詳細説明文です。',
      priceOrDate: '¥1,000',
      tag: 'NEW'
    };
    onChange({
      ...block,
      items: [...block.items, newItem]
    });
  };

  const updateItem = (index: number, partial: any) => {
    const updated = [...block.items];
    updated[index] = { ...updated[index], ...partial };
    onChange({ ...block, items: updated });
  };

  const removeItem = (index: number) => {
    if (block.items.length <= 1) return;
    const updated = block.items.filter((_, i) => i !== index);
    onChange({ ...block, items: updated });
  };

  return (
    <div className="space-y-4">
      {isSelected && (
        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">列数:</span>
            {([2, 3, 4] as const).map(cols => (
              <button
                key={cols}
                type="button"
                onClick={() => onChange({ ...block, columns: cols })}
                className={`px-2 py-0.5 rounded font-bold ${
                  block.columns === cols ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border'
                }`}
              >
                {cols}列
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>カードを追加</span>
          </button>
        </div>
      )}

      {/* Grid items */}
      <div className={`grid gap-4 ${
        block.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' :
        block.columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
        'grid-cols-1 sm:grid-cols-3'
      }`}>
        {block.items.map((item, index) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden p-3 space-y-2 shadow-xs relative group/card">
            {isSelected && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="absolute top-2 right-2 p-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md z-10 opacity-0 group-hover/card:opacity-100 transition"
                title="カードを削除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {item.imageUrl && (
              <div className="h-28 bg-slate-100 rounded-lg overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}

            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
              placeholder="カードタイトル"
              className="w-full font-bold text-sm text-slate-900 border-b border-transparent focus:border-blue-400 focus:outline-none"
            />
            <textarea
              rows={2}
              value={item.description}
              onChange={(e) => updateItem(index, { description: e.target.value })}
              placeholder="説明文..."
              className="w-full text-xs text-slate-600 border border-transparent focus:border-slate-200 rounded p-1 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between text-xs">
              <input
                type="text"
                value={item.priceOrDate || ''}
                onChange={(e) => updateItem(index, { priceOrDate: e.target.value })}
                placeholder="価格/日付"
                className="w-24 font-bold text-blue-600 border-b border-transparent focus:border-blue-400 focus:outline-none"
              />
              <input
                type="text"
                value={item.tag || ''}
                onChange={(e) => updateItem(index, { tag: e.target.value })}
                placeholder="タグ(例: おすすめ)"
                className="w-20 text-[10px] text-right text-amber-700 border-b border-transparent focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactFormBlockEditor: React.FC<{
  block: ContactFormBlock;
  isSelected: boolean;
  onChange: (b: ContactFormBlock) => void;
}> = ({ block, isSelected, onChange }) => {
  return (
    <div className="max-w-md mx-auto p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
      <input
        type="text"
        value={block.title}
        onChange={(e) => onChange({ ...block, title: e.target.value })}
        placeholder="フォームタイトル"
        className="w-full text-center font-bold text-base text-slate-900 bg-transparent focus:outline-none border-b border-transparent focus:border-blue-400"
      />
      <input
        type="text"
        value={block.description}
        onChange={(e) => onChange({ ...block, description: e.target.value })}
        placeholder="フォームの説明文..."
        className="w-full text-center text-xs text-slate-500 bg-transparent focus:outline-none border-b border-transparent focus:border-blue-400"
      />

      <div className="space-y-2 pt-2">
        {block.fields.map(f => (
          <div key={f.id} className="text-left">
            <span className="text-xs font-bold text-slate-700 block mb-1">
              {f.label} {f.required && <span className="text-rose-500">*</span>}
            </span>
            <div className="w-full h-8 bg-white border border-slate-300 rounded-lg px-2 flex items-center text-xs text-slate-400">
              入力欄プレビュー
            </div>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={block.buttonLabel}
        onChange={(e) => onChange({ ...block, buttonLabel: e.target.value })}
        placeholder="送信ボタンの文言"
        className="w-full py-2 bg-blue-600 text-white font-bold text-xs text-center rounded-xl focus:outline-none"
      />
    </div>
  );
};

const AccessMapBlockEditor: React.FC<{
  block: AccessMapBlock;
  isSelected: boolean;
  onChange: (b: AccessMapBlock) => void;
}> = ({ block, isSelected, onChange }) => {
  return (
    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 text-left">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block">施設・店舗名</label>
            <input
              type="text"
              value={block.title}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              className="w-full text-sm font-bold text-slate-800 bg-white border border-slate-200 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block">住所</label>
            <input
              type="text"
              value={block.address}
              onChange={(e) => onChange({ ...block, address: e.target.value })}
              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block">アクセス方法</label>
            <input
              type="text"
              value={block.accessInfo}
              onChange={(e) => onChange({ ...block, accessInfo: e.target.value })}
              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block">営業時間 / 定休日</label>
            <input
              type="text"
              value={block.businessHours}
              onChange={(e) => onChange({ ...block, businessHours: e.target.value })}
              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 block">電話番号</label>
            <input
              type="text"
              value={block.phone}
              onChange={(e) => onChange({ ...block, phone: e.target.value })}
              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Map preview */}
        <div className="h-56 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 relative flex items-center justify-center text-xs text-slate-500">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(block.mapEmbedQuery || block.address || 'Tokyo')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full border-0 pointer-events-none"
            title="Map preview"
          />
        </div>
      </div>
    </div>
  );
};

const DividerBlockEditor: React.FC<{
  block: DividerBlock;
  isSelected: boolean;
  onChange: (b: DividerBlock) => void;
}> = ({ block, isSelected, onChange }) => {
  return (
    <div className="py-2">
      {isSelected && (
        <div className="flex items-center justify-center gap-2 mb-2">
          {(['solid', 'dashed', 'dots', 'space'] as const).map(st => (
            <button
              key={st}
              type="button"
              onClick={() => onChange({ ...block, style: st })}
              className={`px-2.5 py-0.5 text-xs rounded font-bold ${
                block.style === st ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {st === 'solid' ? '実線' : st === 'dashed' ? '破線' : st === 'dots' ? '点線' : '余白のみ'}
            </button>
          ))}
        </div>
      )}

      {block.style === 'solid' && <div className="border-t border-slate-200 w-full" />}
      {block.style === 'dashed' && <div className="border-t-2 border-dashed border-slate-300 w-full" />}
      {block.style === 'dots' && <div className="border-t-2 border-dotted border-slate-300 w-full" />}
      {block.style === 'space' && <div className="h-6" />}
    </div>
  );
};

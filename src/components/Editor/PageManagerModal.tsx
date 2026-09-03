import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown,
  Layers,
  AlertCircle
} from 'lucide-react';
import { PageData } from '../../types/builder';

interface PageManagerModalProps {
  pages: PageData[];
  currentPageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: (name: string, slug: string) => void;
  onUpdatePage: (id: string, name: string, slug: string) => void;
  onDeletePage: (id: string) => void;
  onReorderPages: (pages: PageData[]) => void;
  onClose: () => void;
}

export const PageManagerModal: React.FC<PageManagerModalProps> = ({
  pages,
  currentPageId,
  onSelectPage,
  onAddPage,
  onUpdatePage,
  onDeletePage,
  onReorderPages,
  onClose
}) => {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editSlug, setEditSlug] = useState<string>('');

  const [newPageName, setNewPageName] = useState<string>('');
  const [newPageSlug, setNewPageSlug] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const startEdit = (p: PageData) => {
    setEditingPageId(p.id);
    setEditName(p.name);
    setEditSlug(p.slug);
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;
    const cleanSlug = (editSlug.trim() || 'page').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    onUpdatePage(id, editName.trim(), cleanSlug);
    setEditingPageId(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;
    const cleanSlug = (newPageSlug.trim() || newPageName.trim()).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    onAddPage(newPageName.trim(), cleanSlug);
    setNewPageName('');
    setNewPageSlug('');
    setIsAdding(false);
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onReorderPages(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-800">ページ管理 (複数ページサイト)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <p className="text-xs text-slate-500 leading-relaxed">
            ページの追加・並べ替えを行うと、サイト内のヘッダーナビゲーションリンクが自動的に更新されます。
          </p>

          {/* List of pages */}
          <div className="space-y-2.5">
            {pages.map((p, index) => {
              const isCurrent = p.id === currentPageId;
              const isEditing = p.id === editingPageId;

              return (
                <div
                  key={p.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isCurrent ? 'border-blue-500 bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="ページ名"
                        className="px-2.5 py-1 text-xs border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-xs text-slate-400">/</span>
                      <input
                        type="text"
                        value={editSlug}
                        disabled={p.slug === 'index'}
                        onChange={(e) => setEditSlug(e.target.value)}
                        placeholder="slug (例: about)"
                        className="px-2.5 py-1 text-xs border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                      />
                      <button
                        onClick={() => saveEdit(p.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        onSelectPage(p.id);
                        onClose();
                      }}
                      className="flex-1 cursor-pointer flex items-center gap-3"
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-800">{p.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                              編集中
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {p.slug === 'index' ? 'index.html (トップ)' : `${p.slug}.html`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => movePage(index, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                      title="上へ"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === pages.length - 1}
                      onClick={() => movePage(index, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                      title="下へ"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
                      title="編集"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`「${p.name}」ページを削除しますか？`)) {
                            onDeletePage(p.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                        title="削除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add page form */}
          {isAdding ? (
            <form onSubmit={handleCreate} className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
              <h4 className="text-xs font-bold text-blue-900">新しいページを追加</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">ページ名</label>
                  <input
                    type="text"
                    required
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="例: お知らせ"
                    className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">ファイル名(URL)</label>
                  <input
                    type="text"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value)}
                    placeholder="例: news (.htmlは自動付与)"
                    className="w-full px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  追加する
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>新しいページを追加</span>
            </button>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition"
          >
            完了
          </button>
        </div>

      </div>
    </div>
  );
};

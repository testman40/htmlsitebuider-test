import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';

/**
 * ビルダー本体のコピー・ダウンロード・無断複製を防止するプロテクションコンポーネント
 * - 右クリック (contextmenu) の禁止
 * - ショートカットキーによるページ保存 (Ctrl/Cmd+S)、ソース表示 (Ctrl/Cmd+U)、印刷 (Ctrl/Cmd+P)、DevTools (F12) の禁止
 * - 画像のドラッグ＆ドロップによるPC保存の禁止
 * - 制限されたアクションを試行した際の警告トースト表示
 */
export const ContentProtection: React.FC = () => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const showWarning = (msg: string) => {
    setWarningMessage(msg);
    const timer = setTimeout(() => {
      setWarningMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    // 1. 右クリック (コンテキストメニュー) の禁止
    const handleContextMenu = (e: MouseEvent) => {
      // 入力フォーム要素 (input, textarea) 以外、または全体で右クリックを禁止
      e.preventDefault();
      showWarning('コンテンツ保護のため、右クリック操作は禁止されています。');
    };

    // 2. キーボードショートカットによる保存・ソース表示・ダウンロードの禁止
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + S: ページの保存 (ダウンロード)
      if (isCmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        showWarning('ページのダウンロード保存は禁止されています（エディタ内の保存機能をご利用ください）。');
        return;
      }

      // Ctrl/Cmd + U: ソースコードの表示
      if (isCmdOrCtrl && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        showWarning('ソースコードの直接閲覧・コピーは禁止されています。');
        return;
      }

      // Ctrl/Cmd + P: ページの印刷 (PDF保存)
      if (isCmdOrCtrl && (e.key === 'p' || e.key === 'P')) {
        // ガイド閲覧モーダル内の専用印刷ボタン以外での全画面印刷を抑制
        const target = e.target as HTMLElement;
        if (!target.closest('.printable-guide')) {
          e.preventDefault();
          showWarning('ページの印刷・PDFダウンロードは保護されています。');
          return;
        }
      }

      // F12 または Ctrl/Cmd + Shift + I/J/C: 開発者ツールの呼び出し
      if (
        e.key === 'F12' ||
        (isCmdOrCtrl && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))
      ) {
        e.preventDefault();
        showWarning('開発者ツールへのアクセスは制限されています。');
        return;
      }

      // Ctrl/Cmd + C による全体コピーの抑制 (input, textarea 以外)
      if (isCmdOrCtrl && (e.key === 'c' || e.key === 'C')) {
        const activeElement = document.activeElement;
        const isInput =
          activeElement instanceof HTMLInputElement ||
          activeElement instanceof HTMLTextAreaElement ||
          activeElement?.hasAttribute('contenteditable');

        if (!isInput) {
          e.preventDefault();
          showWarning('テキストおよび要素のコピーは禁止されています。');
          return;
        }
      }
    };

    // 3. 画像のネイティブドラッグによるPCデスクトップ保存の抑止
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      // ビルダー内のブロック移動ハンドル等は除外
      if (target.tagName === 'IMG' || target.querySelector('img')) {
        // エディタのDnDハンドルではない場合のみ抑止
        if (!target.closest('[draggable="true"]')) {
          e.preventDefault();
        }
      }
    };

    // イベントリスナーの登録
    window.addEventListener('contextmenu', handleContextMenu, { capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('dragstart', handleDragStart, { capture: true });

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('dragstart', handleDragStart, { capture: true });
    };
  }, []);

  if (!warningMessage) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="bg-gray-900/95 text-white border border-rose-500/50 shadow-2xl px-4 py-2.5 rounded-lg flex items-center gap-2.5 text-xs backdrop-blur-md">
        <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
        <span className="font-medium tracking-tight">{warningMessage}</span>
      </div>
    </div>
  );
};

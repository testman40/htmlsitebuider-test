import React, { useState } from 'react';
import { Shield, FileCheck, X } from 'lucide-react';

interface LegalModalProps {
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-200 font-sans">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-gray-900">利用規約・プライバシーポリシー</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 px-5 bg-white">
          <button
            onClick={() => setTab('terms')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
              tab === 'terms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            サービス利用規約・ライセンス
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition ${
              tab === 'privacy' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            個人情報保護方針 (プライバシーポリシー)
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-gray-600 leading-relaxed">
          {tab === 'terms' ? (
            <div className="space-y-4">
              <section className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-xs">第1条 (本サービスの役割と免責)</h4>
                <p>
                  1. 本サービスは、利用者がWebサイト用のHTMLデータを視覚的に作成・編集・ダウンロードするための制作支援ツールです。<br />
                  2. 本サービスはWebサイトのホスティング（サーバー公開環境の提供）は行っておりません。作成されたサイトの公開・運用はお客様自身のレンタルサーバー等において自己責任にて実施いただきます。
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-xs">第2条 (テンプレートおよび内蔵素材のライセンス)</h4>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-950 font-medium space-y-1">
                  <p>【重要: 素材の二次配布・転売の禁止】</p>
                  <p>
                    本サービス内で提供されるテンプレート、レイアウト構成、写真素材、動画背景プリセット等は、<strong>「本サービス内でサイトを構築・公開する目的」</strong>に限り自由にご利用いただけます。
                  </p>
                  <p>
                    テンプレート・素材そのものを抽出して再配布、販売、テンプレート集等としての第三者への譲渡・転売は固く禁止いたします。
                  </p>
                </div>
              </section>

              <section className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-xs">第3条 (禁止事項)</h4>
                <p>
                  利用者は以下の行為を行ってはなりません。<br />
                  • 法令または公序良俗に違反するWebサイトの作成<br />
                  • 当サービスのサーバー負荷を著しく高める不正なスクレイピングや自動化アクセス<br />
                  • 第三者の著作権、商標権、プライバシーを侵害する素材のアップロード
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              <section className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-xs">第1条 (取得する個人情報)</h4>
                <p>
                  当サービスでは、パスワードレス認証（マジックリンク）およびサイトデータの安全な保存・復元のために、お客様の「メールアドレス」を取得いたします。
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-xs">第2条 (利用目的)</h4>
                <p>
                  お預かりしたメールアドレスは以下の目的でのみ使用します。<br />
                  • ログイン用マジックリンクの送信（有効期限15分）<br />
                  • サイト制作データの保存・復元時の本人確認<br />
                  • サービスに関する重要なお知らせやセキュリティ通知
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-xs">第3条 (第三者提供の禁止)</h4>
                <p>
                  法令に基づく場合を除き、事前の同意なく第三者へお客様の個人情報を提供・販売することは一切ございません。
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition shadow-xs"
          >
            同意して閉じる
          </button>
        </div>

      </div>
    </div>
  );
};

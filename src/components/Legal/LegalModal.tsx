import React, { useState } from 'react';
import { Shield, FileCheck, X } from 'lucide-react';

interface LegalModalProps {
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ onClose }) => {
  const [tab, setTab] = useState<'terms' | 'privacy'>('terms');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-800">利用規約・プライバシーポリシー</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          <button
            onClick={() => setTab('terms')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              tab === 'terms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            サービス利用規約・ライセンス
          </button>
          <button
            onClick={() => setTab('privacy')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              tab === 'privacy' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            個人情報保護方針 (プライバシーポリシー)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {tab === 'terms' ? (
            <div className="space-y-4">
              <section className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">第1条 (本サービスの役割と免責)</h4>
                <p>
                  1. 本サービスは、利用者がWebサイト用のHTMLデータを視覚的に作成・編集・ダウンロードするための制作支援ツールです。<br />
                  2. 本サービスはWebサイトのホスティング（サーバー公開環境の提供）は行っておりません。作成されたサイトの公開・運用はお客様自身のレンタルサーバー等において自己責任にて実施いただきます。
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">第2条 (テンプレートおよび内蔵素材のライセンス)</h4>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-medium space-y-1">
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
                <h4 className="font-bold text-slate-800 text-sm">第3条 (禁止事項)</h4>
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
                <h4 className="font-bold text-slate-800 text-sm">第1条 (取得する個人情報)</h4>
                <p>
                  当サービスでは、パスワードレス認証（マジックリンク）およびサイトデータの安全な保存・復元のために、お客様の「メールアドレス」を取得いたします。
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">第2条 (利用目的)</h4>
                <p>
                  お預かりしたメールアドレスは以下の目的でのみ使用します。<br />
                  • ログイン用マジックリンクの送信（有効期限15分）<br />
                  • サイト制作データの保存・復元時の本人確認<br />
                  • サービスに関する重要なお知らせやセキュリティ通知
                </p>
              </section>

              <section className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">第3条 (第三者提供の禁止)</h4>
                <p>
                  法令に基づく場合を除き、事前の同意なく第三者へお客様の個人情報を提供・販売することは一切ございません。
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition shadow-sm"
          >
            同意して閉じる
          </button>
        </div>

      </div>
    </div>
  );
};

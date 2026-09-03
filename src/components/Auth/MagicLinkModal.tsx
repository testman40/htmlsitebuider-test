import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Clock, X, AlertCircle, Sparkles } from 'lucide-react';
import { UserSession } from '../../types/builder';

interface MagicLinkModalProps {
  currentSession: UserSession | null;
  onLoginSuccess: (session: UserSession) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const MagicLinkModal: React.FC<MagicLinkModalProps> = ({
  currentSession,
  onLoginSuccess,
  onLogout,
  onClose
}) => {
  const [email, setEmail] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [mockMagicToken, setMockMagicToken] = useState<string>('');

  // 1 minute cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('有効なメールアドレスを入力してください。');
      return;
    }

    // Cooldown check (Section 4: 1分に1回)
    if (cooldown > 0) return;

    // Simulate sending email
    const token = 'tok_' + Math.random().toString(36).substring(2, 10);
    setMockMagicToken(token);
    setIsSent(true);
    setCooldown(60); // 1分再送制限
  };

  const handleSimulateClickLink = () => {
    // 15分有効期限 (Section 4: 15分)
    const expiresAt = Date.now() + 15 * 60 * 1000;
    const session: UserSession = {
      email,
      token: mockMagicToken,
      expiresAt
    };
    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-200 font-sans">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xs">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>{currentSession ? 'アカウント情報' : 'メール簡易ログイン (パスワード不要)'}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {currentSession ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800">ログイン中</span>
                  <p className="text-xs font-bold text-gray-900">{currentSession.email}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                プロジェクトの作成データはお使いのブラウザ及びクラウドに自動バックアップされています。
              </p>
              <button
                onClick={onLogout}
                className="w-full py-2 px-4 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition shadow-2xs"
              >
                ログアウト
              </button>
            </div>
          ) : !isSent ? (
            <form onSubmit={handleSendMagicLink} className="space-y-3.5">
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">パスワードを覚える必要はありません。</p>
                <p className="text-gray-500">入力したメール宛に届くログイン用URL（マジックリンク）をクリックするだけで安全に認証できます。</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@yourdomain.com"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-white transition"
                />
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-[11px] text-blue-900 space-y-1">
                <p>• ログインリンクの有効期限は<strong>15分間</strong>です。</p>
                <p>• 同一アドレスへの再送信は<strong>1分に1回</strong>までとなります。</p>
              </div>

              <button
                type="submit"
                disabled={cooldown > 0}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md transition shadow-xs disabled:opacity-50"
              >
                {cooldown > 0 ? `再送信まで ${cooldown} 秒` : 'ログインリンクを送信'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-900">メールを送信しました</h4>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">{email}</span> 宛にマジックリンクを送信しました（有効期限15分）。
                </p>
              </div>

              {/* In-app simulator for seamless review */}
              <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg text-left space-y-2">
                <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>【デモ動作】メール内リンクのシミュレーション</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  受信トレイを開かずにそのまま下のボタンを押すことで、ログイン完了動作をテストできます。
                </p>
                <button
                  onClick={handleSimulateClickLink}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md shadow-2xs transition"
                >
                  メール内リンクを開いてログインを完了する
                </button>
              </div>

              <button
                onClick={() => setIsSent(false)}
                disabled={cooldown > 0}
                className="text-xs text-gray-500 hover:text-gray-800 font-medium disabled:opacity-40"
              >
                {cooldown > 0 ? `再送信は ${cooldown} 秒後に可能です` : 'メールアドレスを再入力する'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

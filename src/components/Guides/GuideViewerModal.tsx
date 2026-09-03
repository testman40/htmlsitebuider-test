import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Globe, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface GuideViewerModalProps {
  initialGuide?: 'upload' | 'domain';
  onClose: () => void;
}

export const GuideViewerModal: React.FC<GuideViewerModalProps> = ({ 
  initialGuide = 'upload', 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'domain'>(initialGuide);
  const [activeServerTab, setActiveServerTab] = useState<'xserver' | 'lolipop' | 'sakura' | 'conoha'>('xserver');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">初心者向けWebサイト公開マニュアル (PDFガイド)</h2>
              <p className="text-xs text-slate-500">HTMLビルダー公式 ・ レンタルサーバー4社対応</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
              title="A4用紙のPDFとして保存または印刷できます"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>PDF保存 / 印刷</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3.5 px-2 text-sm font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
            <span>【必須】サーバーアップロード手順書 (FTP解説)</span>
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`py-3.5 px-2 text-sm font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'domain'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs">2</span>
            <span>【任意】独自ドメイン取得・DNS設定手順書</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 print:p-0 print:overflow-visible">

          {activeTab === 'upload' && (
            <div className="space-y-8">
              {/* Introduction */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 text-base">当サービスで作ったサイトを世界へ公開する3つのステップ</h3>
                  <p className="text-sm text-blue-800/90 mt-1 leading-relaxed">
                    本サービスで「HTML生成」ボタンを押してダウンロードしたZIPファイルを解凍し、中にあるHTMLファイルをレンタルサーバーへアップロードすれば、あなただけのホームページがネット上に公開されます。
                  </p>
                </div>
              </div>

              {/* Step 1: FTP Software */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm">Step 1</span>
                  <h3 className="text-lg font-bold text-slate-800">無料FTPソフト「FileZilla(ファイルジラ)」の準備</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-10">
                  パソコンにあるファイルをレンタルサーバーに転送するための定番ソフト（無料）です。Windows・Mac両対応。
                </p>
                <div className="pl-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-2">
                    <h4 className="font-bold text-slate-800">1. ダウンロード & インストール</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      「FileZilla Client」公式サイトよりお使いのOSに合わせてダウンロードし、インストーラーの指示に従って完了します。
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-2">
                    <h4 className="font-bold text-slate-800">2. 画面の見方</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      左側が「あなたのパソコン」、右側が「サーバーの中身」です。左側の解凍フォルダから右側の公開フォルダへドラッグするだけでアップロード完了します。
                    </p>
                  </div>
                </div>
              </section>

              {/* Step 2: 4 Server Companies */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm">Step 2</span>
                  <h3 className="text-lg font-bold text-slate-800">大手レンタルサーバー4社別の接続設定 & アップロード先</h3>
                </div>

                {/* 4 Company Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  {[
                    { id: 'xserver', name: 'エックスサーバー' },
                    { id: 'lolipop', name: 'ロリポップ!' },
                    { id: 'sakura', name: 'さくらのレンタルサーバ' },
                    { id: 'conoha', name: 'ConoHa WING' },
                  ].map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setActiveServerTab(srv.id as any)}
                      className={`p-3 text-center rounded-xl border font-bold text-sm transition ${
                        activeServerTab === srv.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {srv.name}
                    </button>
                  ))}
                </div>

                {/* Tab details */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm space-y-4">
                  {activeServerTab === 'xserver' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-slate-800">エックスサーバーの設定</h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">国内シェア最大級</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-bold block mb-1">ホスト名 (FTPサーバー):</span>
                          <span className="font-mono text-slate-800 font-bold">sv●●●●.xserver.jp (契約時のメールに記載)</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-bold block mb-1">ユーザー名 & パスワード:</span>
                          <span className="font-mono text-slate-800 font-bold">サーバーパネルのFTPアカウント設定を確認</span>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium">
                        <strong>アップロード先のフォルダ:</strong><br />
                        サーバー側の <code className="bg-amber-100 px-1 py-0.5 rounded font-bold text-amber-950">/(あなたのドメイン名)/public_html/</code> の中に、ZIPを解凍して出てきた「index.html」や画像フォルダをすべてドラッグしてください。
                      </div>
                    </div>
                  )}

                  {activeServerTab === 'lolipop' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-slate-800">ロリポップ! の設定</h4>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold">初心者向け・低コスト</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-bold block mb-1">FTPSサーバー:</span>
                          <span className="font-mono text-slate-800 font-bold">ftp.lolipop.jp</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-bold block mb-1">FTPアカウント / パスワード:</span>
                          <span className="font-mono text-slate-800 font-bold">ユーザー専用ページ「アカウント情報」より取得</span>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium">
                        <strong>アップロード先のフォルダ:</strong><br />
                        ロリポップ管理画面で独自ドメインに設定した「公開アップロードフォルダ（例: <code className="bg-amber-100 px-1 py-0.5 rounded font-bold text-amber-950">/</code> 直下または指定したフォルダ）」の中に配置します。
                      </div>
                    </div>
                  )}

                  {activeServerTab === 'sakura' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-slate-800">さくらのレンタルサーバの設定</h4>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-bold">老舗・高信頼</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-bold block mb-1">初期ドメイン (ホスト):</span>
                          <span className="font-mono text-slate-800 font-bold">●●●.sakura.ne.jp</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-bold block mb-1">接続ポート:</span>
                          <span className="font-mono text-slate-800 font-bold">21 (FTPS接続)</span>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium">
                        <strong>アップロード先のフォルダ:</strong><br />
                        サーバー側の <code className="bg-amber-100 px-1 py-0.5 rounded font-bold text-amber-950">/home/アカウント名/www/</code> 直下、または独自ドメイン用の指定サブフォルダ内に配置します。
                      </div>
                    </div>
                  )}

                  {activeServerTab === 'conoha' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-slate-800">ConoHa WING の設定</h4>
                        <span className="text-xs bg-sky-100 text-sky-700 px-2.5 py-1 rounded-full font-bold">国内最速クラス・人気急上昇</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-bold block mb-1">FTPサーバー (ホスト):</span>
                          <span className="font-mono text-slate-800 font-bold">管理画面「サーバー管理」→「FTP」に記載のホスト</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="text-slate-500 font-bold block mb-1">暗号化:</span>
                          <span className="font-mono text-slate-800 font-bold">明示的なFTP over TLS(FTPS)を使用</span>
                        </div>
                      </div>
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-medium">
                        <strong>アップロード先のフォルダ:</strong><br />
                        サーバー側の <code className="bg-amber-100 px-1 py-0.5 rounded font-bold text-amber-950">/public_html/(ドメイン名)/</code> 直下に「index.html」などを配置します。
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Step 3: Check & Troubleshooting */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm">Step 3</span>
                  <h3 className="text-lg font-bold text-slate-800">アップロード後の表示確認 & トラブル解決Q&A</h3>
                </div>

                <div className="space-y-3 pl-10">
                  <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <HelpCircle className="w-4 h-4 text-rose-500" />
                      <span>Q. 「403 Forbidden」または「404 Not Found」エラーが出る</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      <strong>最も多い原因:</strong> 「index.html」が公開フォルダ直下に入っておらず、フォルダをもう一つ挟んで（例: <code className="bg-slate-100 px-1 rounded">public_html/my_site/index.html</code>）置かれているケースです。ZIP解凍後のフォルダそのものではなく、<strong>フォルダの中身のファイル群を直接public_html直下</strong>に移動してください。
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      <span>Q. サイトは表示されたが、アップロードした写真が表示されない</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      画像ファイル群がサーバー上の所定の場所（または「images」フォルダ内）にアップロードされているか確認してください。また、サーバーは大文字・小文字を厳密に区別するため、ファイル名のつづりをご確認ください。
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                      <span>Q. 内容を修正したのに古い内容が表示される</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      ブラウザのキャッシュ（一時保存データ）が原因です。Windowsは「Ctrl + F5」、Macは「Cmd + Shift + R」を押してスーパーリロードを行ってください。
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'domain' && (
            <div className="space-y-8">
              {/* Domain Intro */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-950 text-base">世界に一つだけのURL「独自ドメイン」を設定しよう</h3>
                  <p className="text-sm text-emerald-900/90 mt-1 leading-relaxed">
                    独自ドメイン（例: <code className="bg-emerald-100 px-1 py-0.5 rounded font-bold text-emerald-950">your-shop.com</code>）を取得すると、店舗やビジネスの信頼性が劇的に高まり、名刺やSNSにもすっきりと記載できます。
                  </p>
                </div>
              </div>

              {/* Step 1: Domain Registrars */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">Step 1</span>
                  <h3 className="text-lg font-bold text-slate-800">おすすめドメイン取得サービス</h3>
                </div>
                <div className="pl-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 text-sm">お名前.com (GMO)</h4>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-semibold">国内最大手</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      取り扱いドメイン数が非常に多く、キャンペーン時は「.com」や「.jp」をお得に取得できます。
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 text-sm">ムームードメイン</h4>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">ロリポップと親和性</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      管理画面が初心者にも直感的で分かりやすく、ロリポップ!への紐付け設定がワンクリックで行えます。
                    </p>
                  </div>
                </div>
              </section>

              {/* Step 2: DNS Nameservers */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">Step 2</span>
                  <h3 className="text-lg font-bold text-slate-800">レンタルサーバー別のネームサーバー (DNS) 設定値</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-10">
                  ドメインを購入したサービス側の「ネームサーバー変更画面」で、契約したサーバーのネームサーバーを入力します。
                </p>

                <div className="pl-10 overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">レンタルサーバー</th>
                        <th className="p-3">プライマリ (ネームサーバー1)</th>
                        <th className="p-3">セカンダリ (ネームサーバー2)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700 font-mono">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-bold text-slate-900">エックスサーバー</td>
                        <td className="p-3 text-blue-700 font-bold">ns1.xserver.jp</td>
                        <td className="p-3 text-blue-700 font-bold">ns2.xserver.jp</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-bold text-slate-900">ロリポップ!</td>
                        <td className="p-3 text-emerald-700 font-bold">uns01.lolipop.jp</td>
                        <td className="p-3 text-emerald-700 font-bold">uns02.lolipop.jp</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-bold text-slate-900">さくらのレンタルサーバ</td>
                        <td className="p-3 text-purple-700 font-bold">ns1.dns.ne.jp</td>
                        <td className="p-3 text-purple-700 font-bold">ns2.dns.ne.jp</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-sans font-bold text-slate-900">ConoHa WING</td>
                        <td className="p-3 text-sky-700 font-bold">ns-a1.conoha.io</td>
                        <td className="p-3 text-sky-700 font-bold">ns-a2.conoha.io</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Step 3: Propagation */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">Step 3</span>
                  <h3 className="text-lg font-bold text-slate-800">DNS反映待ち時間とトラブルQ&A</h3>
                </div>

                <div className="space-y-3 pl-10">
                  <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Q. 設定後、何時間くらいでアクセスできるようになりますか？</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      ネームサーバーを変更してから世界中のネットワークに行き渡る（プロパゲーション）まで、通常<strong>数十分〜最大24時間程度</strong>かかります。設定直後に「このサイトにアクセスできません」と出ても焦らず、数時間お待ちください。
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Q. 無料独自SSL (https化) の設定はどうすればいい？</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      4社ともサーバー管理画面から「無料独自SSL」のボタンを押すだけで自動発行されます。URLが <code className="bg-slate-100 px-1 rounded">https://〜</code> となり、ブラウザに安全な鍵マークがつくようになります。
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Copyright notice according to Section 7 */}
          <div className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            <p>© 初心者向けHTMLビルダーサービス ガイド編集部 / 本手順書の無断転載・複製を禁じます。</p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            ※ 上部の「PDF保存 / 印刷」ボタンからA4書類として保存可能です
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition shadow"
          >
            ガイドを閉じる
          </button>
        </div>

      </div>
    </div>
  );
};

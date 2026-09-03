import JSZip from 'jszip';
import { SiteData } from '../types/builder';
import { generatePageHtml } from './htmlGenerator';

export async function exportSiteAsZip(site: SiteData): Promise<Blob> {
  const zip = new JSZip();

  // 1. Generate HTML for every page
  site.pages.forEach(page => {
    const htmlContent = generatePageHtml(site, page);
    const fileName = page.slug === 'index' ? 'index.html' : `${page.slug}.html`;
    zip.file(fileName, htmlContent);
  });

  // 2. Add uploaded images if any
  if (site.images && site.images.length > 0) {
    const imgFolder = zip.folder('images');
    if (imgFolder) {
      site.images.forEach((img, index) => {
        // Remove data:image/...;base64, prefix
        const base64Data = img.dataUrl.split(',')[1];
        if (base64Data) {
          const ext = img.dataUrl.includes('image/webp') ? 'webp' : img.dataUrl.includes('image/png') ? 'png' : 'jpg';
          const imgFileName = `upload_${index + 1}_${img.name.replace(/[^a-zA-Z0-9_-]/g, '') || 'image'}.${ext}`;
          imgFolder.file(imgFileName, base64Data, { base64: true });
        }
      });
    }
  }

  // 3. Add beginner friendly README file
  const readmeContent = `# ${site.name} - 公開用Webサイトファイル一式
作成日時: ${new Date().toLocaleString('ja-JP')}
作成ツール: 初心者向けHTMLビルダー

--------------------------------------------------
【重要: サーバーへのアップロード手順】
--------------------------------------------------
解凍して出てきたファイル（index.html など）を、ご契約中のレンタルサーバー
（エックスサーバー、ロリポップ!、さくらインターネット、ConoHa WINGなど）の
「公開ディレクトリ(public_html または ドメイン名フォルダ)」にアップロードしてください。

■ ファイル一覧:
${site.pages.map(p => `- ${p.slug === 'index' ? 'index.html' : p.slug + '.html'} : ${p.name}ページ`).join('\n')}

■ アップロードの注意点:
1. 必ず「index.html」が公開フォルダ直下に配置されていることを確認してください。
2. FTPソフト（FileZilla等）を使用すると簡単にドラッグ＆ドロップでアップロードできます。
3. 詳細な画像付き解説は、サービス内の「PDFガイド①: アップロード手順書」をご参照ください。

--------------------------------------------------
【利用規約とライセンスについて】
本ファイル内のテンプレートおよび内蔵素材は、本サービスで作成されたサイトでのみご利用いただけます。
素材・テンプレート単体の再配布・転売は禁止されております。
`;

  zip.file('README_サーバー公開手順.txt', readmeContent);

  // Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import { BlockData, PageData, SiteData } from '../types/builder';
import { VIDEO_PRESETS } from '../data/templates';

/**
 * Escapes HTML characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates a complete standalone HTML document for a specific page of the site.
 */
export function generatePageHtml(site: SiteData, currentPage: PageData): string {
  const fontClass =
    site.theme.fontFamily === 'serif'
      ? "'Noto Serif JP', 'Yu Mincho', serif"
      : site.theme.fontFamily === 'rounded'
      ? "'M PLUS Rounded 1c', 'Hiragino Maru Gothic ProN', sans-serif"
      : "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif";

  const primaryColor = site.theme.primaryColor || '#2563eb';
  const accentColor = site.theme.accentColor || '#f97316';
  const borderRadius =
    site.theme.radius === 'none'
      ? '0px'
      : site.theme.radius === 'sm'
      ? '4px'
      : site.theme.radius === 'lg'
      ? '16px'
      : site.theme.radius === 'full'
      ? '9999px'
      : '8px';

  // Find video preset if configured
  const videoPreset = site.background.type === 'video' && site.background.preset_id
    ? VIDEO_PRESETS.find(p => p.id === site.background.preset_id)
    : null;

  // Render navigation links
  const navLinksHtml = site.pages
    .map(p => {
      const isCurrent = p.id === currentPage.id;
      const fileName = p.slug === 'index' ? 'index.html' : `${p.slug}.html`;
      return `
        <a href="${fileName}" class="nav-link ${isCurrent ? 'active' : ''}">
          ${escapeHtml(p.name)}
        </a>
      `;
    })
    .join('');

  // Render blocks
  const blocksHtml = currentPage.blocks
    .map(block => renderBlockHtml(block, site))
    .join('\n');

  // Background CSS / HTML
  let backgroundHtml = '';
  let backgroundBodyStyle = '';

  if (site.background.type === 'image' && site.background.src) {
    backgroundBodyStyle = `background: url('${site.background.src}') center/cover no-repeat fixed;`;
    backgroundHtml = `<div class="bg-overlay" style="background-color: rgba(255, 255, 255, ${(site.background.overlayOpacity ?? 20) / 100});"></div>`;
  } else if (site.background.type === 'video' && videoPreset) {
    if (videoPreset.videoUrl) {
      backgroundHtml = `
        <div class="video-bg-container">
          <video class="video-bg" autoplay muted loop playsinline poster="${videoPreset.fallbackImageUrl}">
            <source src="${videoPreset.videoUrl}" type="video/mp4">
          </video>
          <div class="bg-overlay" style="background-color: rgba(255, 255, 255, ${(site.background.overlayOpacity ?? 25) / 100});"></div>
        </div>
      `;
    } else {
      // CSS gradient animation
      backgroundHtml = `
        <div class="animated-gradient-bg"></div>
        <div class="bg-overlay" style="background-color: rgba(255, 255, 255, ${(site.background.overlayOpacity ?? 25) / 100});"></div>
      `;
    }
  } else {
    // Template default subtle background
    backgroundBodyStyle = `background-color: #f8fafc;`;
  }

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(currentPage.name)} | ${escapeHtml(site.name)}</title>
  <meta name="description" content="${escapeHtml(currentPage.description || site.name)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;600;700&family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-color: ${primaryColor};
      --accent-color: ${accentColor};
      --radius: ${borderRadius};
      --font-family: ${fontClass};
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      color: #1e293b;
      line-height: 1.7;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      ${backgroundBodyStyle}
    }

    /* Background video & overlays */
    .video-bg-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      z-index: -2;
    }

    .video-bg {
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      object-fit: cover;
    }

    @media (prefers-reduced-motion: reduce) {
      .video-bg {
        display: none;
      }
      .video-bg-container {
        background: url('${videoPreset?.fallbackImageUrl || ''}') center/cover no-repeat;
      }
    }

    .animated-gradient-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -2;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradientBG 15s ease infinite;
    }

    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .bg-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      pointer-events: none;
    }

    /* Container */
    .container {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* Header & Navigation */
    header.site-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 50;
      transition: all 0.3s ease;
    }

    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      flex-wrap: wrap;
      gap: 16px;
    }

    .site-brand {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--primary-color);
      text-decoration: none;
      letter-spacing: -0.01em;
    }

    nav.site-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .nav-link {
      font-size: 0.95rem;
      font-weight: 500;
      color: #475569;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: var(--radius);
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      color: var(--primary-color);
      background: rgba(0, 0, 0, 0.04);
    }

    .nav-link.active {
      color: var(--primary-color);
      background: rgba(37, 99, 235, 0.08);
      font-weight: 700;
    }

    /* Main Content Area */
    main.site-content {
      flex: 1;
      padding: 48px 0 80px 0;
    }

    .page-card-wrapper {
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(8px);
      border-radius: calc(var(--radius) * 1.5);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
      padding: 48px;
      border: 1px solid rgba(226, 232, 240, 0.8);
    }

    @media (max-width: 640px) {
      .page-card-wrapper {
        padding: 24px 16px;
      }
    }

    /* Blocks */
    .block-item {
      margin-bottom: 40px;
    }

    .block-item:last-child {
      margin-bottom: 0;
    }

    /* Heading */
    .heading-block {
      margin-bottom: 32px;
    }
    .heading-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--accent-color);
      background: rgba(249, 115, 22, 0.1);
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .heading-h1 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 12px;
    }
    .heading-h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
      margin-bottom: 10px;
    }
    .heading-h3 {
      font-size: 1.35rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .heading-subtext {
      font-size: 1.05rem;
      color: #64748b;
      max-width: 650px;
      margin-top: 8px;
    }
    .text-center .heading-subtext {
      margin-left: auto;
      margin-right: auto;
    }
    .text-right .heading-subtext {
      margin-left: auto;
    }

    /* Text */
    .text-block {
      color: #334155;
      line-height: 1.8;
      white-space: pre-line;
    }
    .text-sm { font-size: 0.875rem; }
    .text-base { font-size: 1rem; }
    .text-lg { font-size: 1.125rem; }
    .text-lead { font-size: 1.25rem; font-weight: 500; color: #1e293b; }

    /* Image */
    .image-block {
      display: flex;
      flex-direction: column;
    }
    .image-block.align-center { align-items: center; }
    .image-block.align-left { align-items: flex-start; }
    .image-block.align-right { align-items: flex-end; }

    .image-block img {
      height: auto;
      max-width: 100%;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease;
    }
    .image-small img { width: 320px; }
    .image-medium img { width: 560px; }
    .image-large img { width: 840px; }
    .image-full img { width: 100%; }
    .image-rounded img { border-radius: var(--radius); }
    .image-caption {
      margin-top: 8px;
      font-size: 0.875rem;
      color: #64748b;
    }

    /* Button */
    .btn-block {
      display: flex;
    }
    .btn-block.align-center { justify-content: center; }
    .btn-block.align-left { justify-content: flex-start; }
    .btn-block.align-right { justify-content: flex-end; }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 28px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: var(--radius);
      transition: all 0.2s ease;
      cursor: pointer;
      border: 2px solid transparent;
    }
    .btn-primary {
      background-color: var(--primary-color);
      color: #ffffff;
    }
    .btn-primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .btn-secondary {
      background-color: var(--accent-color);
      color: #ffffff;
    }
    .btn-secondary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
    .btn-outline {
      border-color: var(--primary-color);
      color: var(--primary-color);
      background: transparent;
    }
    .btn-outline:hover {
      background: var(--primary-color);
      color: #ffffff;
    }

    /* Card Grid */
    .card-grid {
      display: grid;
      gap: 24px;
      margin-top: 16px;
    }
    .grid-col-2 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .grid-col-3 { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .grid-col-4 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }

    .card-item {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
    }
    .card-img-wrapper {
      width: 100%;
      height: 180px;
      background: #f1f5f9;
      overflow: hidden;
    }
    .card-img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-body {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .card-tag {
      align-self: flex-start;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-color);
      background: rgba(249, 115, 22, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .card-desc {
      font-size: 0.9rem;
      color: #64748b;
      margin-bottom: 12px;
      flex: 1;
    }
    .card-meta {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-top: auto;
    }

    /* Contact Form */
    .form-block {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius);
      padding: 32px;
      max-width: 680px;
      margin: 0 auto;
    }
    .form-header {
      margin-bottom: 24px;
      text-align: center;
    }
    .form-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .form-desc {
      font-size: 0.9rem;
      color: #64748b;
    }
    .form-group {
      margin-bottom: 18px;
      text-align: left;
    }
    .form-label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 6px;
    }
    .required-badge {
      color: #ef4444;
      font-size: 0.8rem;
      margin-left: 4px;
    }
    .form-input, .form-textarea {
      width: 100%;
      padding: 10px 14px;
      font-size: 0.95rem;
      border: 1px solid #cbd5e1;
      border-radius: var(--radius);
      background: #ffffff;
      transition: border-color 0.2s ease;
      font-family: inherit;
    }
    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }
    .form-textarea {
      min-height: 120px;
      resize: vertical;
    }
    .form-submit-btn {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      background-color: var(--primary-color);
      border: none;
      border-radius: var(--radius);
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    .form-submit-btn:hover {
      opacity: 0.92;
    }

    /* Access Map */
    .access-block {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius);
      padding: 32px;
    }
    .access-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: center;
    }
    @media (max-width: 768px) {
      .access-grid {
        grid-template-columns: 1fr;
      }
    }
    .access-info h3 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
    }
    .access-item {
      margin-bottom: 14px;
    }
    .access-item-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .access-item-val {
      font-size: 0.95rem;
      color: #1e293b;
      font-weight: 500;
      margin-top: 2px;
    }
    .map-embed-container {
      width: 100%;
      height: 280px;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }
    .map-embed-container iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }

    /* Divider */
    .divider-block {
      margin: 40px 0;
    }
    .divider-solid { border-top: 1px solid #e2e8f0; }
    .divider-dashed { border-top: 2px dashed #cbd5e1; }
    .divider-dots { border-top: 2px dotted #cbd5e1; }
    .divider-space { height: 32px; }

    /* Footer */
    footer.site-footer {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(10px);
      border-top: 1px solid #e2e8f0;
      padding: 32px 0;
      margin-top: auto;
      text-align: center;
      color: #64748b;
      font-size: 0.875rem;
    }
    .footer-nav {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .footer-nav a {
      color: #475569;
      text-decoration: none;
    }
    .footer-nav a:hover {
      color: var(--primary-color);
    }
  </style>
</head>
<body>
  ${backgroundHtml}

  <!-- Header -->
  <header class="site-header">
    <div class="container">
      <div class="header-inner">
        <a href="index.html" class="site-brand">${escapeHtml(site.name)}</a>
        <nav class="site-nav">
          ${navLinksHtml}
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="site-content">
    <div class="container">
      <div class="page-card-wrapper">
        ${blocksHtml}
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-nav">
        ${site.pages.map(p => `<a href="${p.slug === 'index' ? 'index.html' : p.slug + '.html'}">${escapeHtml(p.name)}</a>`).join('')}
      </div>
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(site.name)}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
}

function renderBlockHtml(block: BlockData, site: SiteData): string {
  switch (block.type) {
    case 'heading': {
      const alignClass = `text-${block.align || 'left'}`;
      const badgeHtml = block.badge ? `<span class="heading-badge">${escapeHtml(block.badge)}</span><br>` : '';
      const subtextHtml = block.subtext ? `<p class="heading-subtext">${escapeHtml(block.subtext)}</p>` : '';
      const Tag = `h${block.level || 1}`;
      return `
        <div class="block-item heading-block ${alignClass}">
          ${badgeHtml}
          <${Tag} class="heading-h${block.level || 1}">${escapeHtml(block.text)}</${Tag}>
          ${subtextHtml}
        </div>
      `;
    }

    case 'text': {
      const alignClass = `text-${block.align || 'left'}`;
      const sizeClass = `text-${block.size || 'base'}`;
      return `
        <div class="block-item text-block ${alignClass} ${sizeClass}">
          ${escapeHtml(block.text)}
        </div>
      `;
    }

    case 'image': {
      const alignClass = `align-${block.align || 'center'}`;
      const sizeClass = `image-${block.maxWidth || 'medium'}`;
      const roundClass = block.rounded ? 'image-rounded' : '';
      const captionHtml = block.caption ? `<div class="image-caption">${escapeHtml(block.caption)}</div>` : '';
      return `
        <div class="block-item image-block ${alignClass} ${sizeClass} ${roundClass}">
          <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt || '')}" loading="lazy" />
          ${captionHtml}
        </div>
      `;
    }

    case 'button': {
      const alignClass = `align-${block.align || 'center'}`;
      const variantClass = `btn-${block.variant || 'primary'}`;
      const targetAttr = block.newTab ? 'target="_blank" rel="noopener noreferrer"' : '';
      return `
        <div class="block-item btn-block ${alignClass}">
          <a href="${escapeHtml(block.link)}" class="btn ${variantClass}" ${targetAttr}>
            ${escapeHtml(block.label)}
          </a>
        </div>
      `;
    }

    case 'card_grid': {
      const colClass = `grid-col-${block.columns || 3}`;
      const itemsHtml = block.items
        .map(item => `
          <div class="card-item">
            ${item.imageUrl ? `<div class="card-img-wrapper"><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" loading="lazy" /></div>` : ''}
            <div class="card-body">
              ${item.tag ? `<div class="card-tag">${escapeHtml(item.tag)}</div>` : ''}
              <h4 class="card-title">${escapeHtml(item.title)}</h4>
              <p class="card-desc">${escapeHtml(item.description)}</p>
              ${item.priceOrDate ? `<div class="card-meta">${escapeHtml(item.priceOrDate)}</div>` : ''}
            </div>
          </div>
        `)
        .join('');
      return `
        <div class="block-item">
          <div class="card-grid ${colClass}">
            ${itemsHtml}
          </div>
        </div>
      `;
    }

    case 'contact_form': {
      const fieldsHtml = block.fields
        .map(f => `
          <div class="form-group">
            <label class="form-label">
              ${escapeHtml(f.label)}
              ${f.required ? '<span class="required-badge">※必須</span>' : ''}
            </label>
            ${
              f.type === 'textarea'
                ? `<textarea class="form-textarea" placeholder="${escapeHtml(f.label)}を入力してください" ${f.required ? 'required' : ''}></textarea>`
                : `<input type="${f.type}" class="form-input" placeholder="${escapeHtml(f.label)}を入力してください" ${f.required ? 'required' : ''} />`
            }
          </div>
        `)
        .join('');

      return `
        <div class="block-item">
          <div class="form-block">
            <div class="form-header">
              <h3 class="form-title">${escapeHtml(block.title)}</h3>
              <p class="form-desc">${escapeHtml(block.description)}</p>
            </div>
            <form onsubmit="event.preventDefault(); alert('送信が完了しました（デモ）。');">
              ${fieldsHtml}
              <button type="submit" class="form-submit-btn">${escapeHtml(block.buttonLabel)}</button>
            </form>
          </div>
        </div>
      `;
    }

    case 'access_map': {
      const encodedQuery = encodeURIComponent(block.mapEmbedQuery || block.address || 'Tokyo');
      const iframeSrc = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      return `
        <div class="block-item">
          <div class="access-block">
            <div class="access-grid">
              <div class="access-info">
                <h3>${escapeHtml(block.title)}</h3>
                <div class="access-item">
                  <div class="access-item-label">住所</div>
                  <div class="access-item-val">${escapeHtml(block.address)}</div>
                </div>
                <div class="access-item">
                  <div class="access-item-label">アクセス案内</div>
                  <div class="access-item-val">${escapeHtml(block.accessInfo)}</div>
                </div>
                <div class="access-item">
                  <div class="access-item-label">営業時間 / 定休日</div>
                  <div class="access-item-val">${escapeHtml(block.businessHours)}</div>
                </div>
                <div class="access-item">
                  <div class="access-item-label">お電話番号</div>
                  <div class="access-item-val">${escapeHtml(block.phone)}</div>
                </div>
              </div>
              <div class="map-embed-container">
                <iframe src="${iframeSrc}" loading="lazy" allowfullscreen referrerpolicy="no-referrer"></iframe>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    case 'divider': {
      return `<div class="block-item divider-block divider-${block.style}"></div>`;
    }

    default:
      return '';
  }
}

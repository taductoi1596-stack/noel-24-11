const fs = require('fs');
const path = require('path');
const QRCode = require('./qrcode.js');

function generateChristmasQRCard(targetUrl) {
    // Generate QR matrix with error correction level M or Q
    const qr = new QRCode(0, 0); // 0 = auto-detect version, 0 = EC level M
    qr.addData(targetUrl);
    qr.make();
    
    const moduleCount = qr.getModuleCount();
    const qrRenderSize = 340; // QR width/height in px inside card
    const cellSize = qrRenderSize / moduleCount;
    const qrOffsetX = (800 - qrRenderSize) / 2; // Center horizontally in 800px canvas (230)
    const qrOffsetY = 390; // QR Y position
    
    let pathD = '';
    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (qr.isDark(r, c)) {
                const x = (qrOffsetX + c * cellSize).toFixed(2);
                const y = (qrOffsetY + r * cellSize).toFixed(2);
                const w = (cellSize + 0.1).toFixed(2);
                const h = (cellSize + 0.1).toFixed(2);
                pathD += `M${x},${y}h${w}v${h}h-${w}z `;
            }
        }
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1060" width="800" height="1060">
  <defs>
    <!-- Background Gradient: Deep Christmas Wine Red to Midnight Pine -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#140206" />
      <stop offset="35%" stop-color="#5a0815" />
      <stop offset="70%" stop-color="#801021" />
      <stop offset="100%" stop-color="#0a2618" />
    </linearGradient>

    <!-- Gold Metallic Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff2b2" />
      <stop offset="30%" stop-color="#e5b842" />
      <stop offset="65%" stop-color="#b8861b" />
      <stop offset="100%" stop-color="#ffd97d" />
    </linearGradient>

    <!-- Christmas Pine Gradient -->
    <linearGradient id="pineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1b5e3a" />
      <stop offset="100%" stop-color="#0d3520" />
    </linearGradient>

    <!-- Card Glow Filter -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.55" />
    </filter>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <style>
    .sub-title { font-family: 'Cinzel', 'Playfair Display', Georgia, serif; font-size: 15px; letter-spacing: 5px; fill: #ffd97d; text-anchor: middle; font-weight: 600; }
    .main-title { font-family: 'Playfair Display', Georgia, serif; font-size: 42px; fill: url(#goldGrad); font-weight: 800; text-anchor: middle; letter-spacing: 2px; }
    .date-badge { font-family: 'Cinzel', 'Playfair Display', serif; font-size: 54px; fill: #ffffff; font-weight: 900; text-anchor: middle; letter-spacing: 6px; }
    .wish-text { font-family: 'Times New Roman', Georgia, serif; font-style: italic; font-size: 18px; fill: #ffdfba; text-anchor: middle; }
    .scan-cta { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 17px; font-weight: 700; fill: #7a1020; text-anchor: middle; letter-spacing: 1px; }
    .scan-sub { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; font-size: 14px; fill: #555555; text-anchor: middle; }
    .url-tag { font-family: 'Courier New', monospace; font-size: 13.5px; fill: #ffd97d; text-anchor: middle; opacity: 0.95; }
    .footer-note { font-family: 'Times New Roman', serif; font-size: 15px; font-style: italic; fill: #ffffff; text-anchor: middle; opacity: 0.88; }
  </style>

  <!-- Background Canvas -->
  <rect width="800" height="1060" fill="url(#bgGrad)" rx="28" />

  <!-- Soft Starfield / Snowflakes Pattern -->
  <g fill="#ffffff" opacity="0.35">
    <circle cx="95" cy="85" r="2.5" />
    <circle cx="160" cy="140" r="1.8" />
    <circle cx="710" cy="120" r="3" />
    <circle cx="650" cy="200" r="2" />
    <circle cx="80" cy="310" r="2.2" />
    <circle cx="730" cy="340" r="2.8" />
    <circle cx="110" cy="520" r="1.8" />
    <circle cx="700" cy="560" r="2.2" />
    <circle cx="90" cy="740" r="3" />
    <circle cx="720" cy="780" r="1.9" />
    <circle cx="130" cy="920" r="2.5" />
    <circle cx="680" cy="940" r="2.2" />
    <!-- Snow Stars -->
    <path d="M220,90 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2 l6,-2 z" opacity="0.6" />
    <path d="M580,80 l2,6 l6,2 l-6,2 l-2,6 l-2,-6 l-6,-2 l6,-2 z" opacity="0.6" />
    <path d="M120,440 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 l4,-1.5 z" opacity="0.4" />
    <path d="M690,460 l1.5,4 l4,1.5 l-4,1.5 l-1.5,4 l-1.5,-4 l-4,-1.5 l4,-1.5 z" opacity="0.4" />
  </g>

  <!-- Outer Double Luxury Border -->
  <rect x="26" y="26" width="748" height="1008" rx="20" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" opacity="0.75" />
  <rect x="36" y="36" width="728" height="988" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="8,5" opacity="0.45" />

  <!-- Corner Holly & Berry Ornaments -->
  <g fill="url(#goldGrad)">
    <!-- Top Left -->
    <circle cx="56" cy="56" r="4.5" />
    <circle cx="48" cy="66" r="3.5" fill="#e53935" />
    <circle cx="66" cy="48" r="3.5" fill="#e53935" />
    <path d="M46,86 Q46,46 86,46" stroke="url(#goldGrad)" stroke-width="2" fill="none" />

    <!-- Top Right -->
    <circle cx="744" cy="56" r="4.5" />
    <circle cx="752" cy="66" r="3.5" fill="#e53935" />
    <circle cx="734" cy="48" r="3.5" fill="#e53935" />
    <path d="M754,86 Q754,46 714,46" stroke="url(#goldGrad)" stroke-width="2" fill="none" />

    <!-- Bottom Left -->
    <circle cx="56" cy="1004" r="4.5" />
    <circle cx="48" cy="994" r="3.5" fill="#e53935" />
    <circle cx="66" cy="1012" r="3.5" fill="#e53935" />
    <path d="M46,974 Q46,1014 86,1014" stroke="url(#goldGrad)" stroke-width="2" fill="none" />

    <!-- Bottom Right -->
    <circle cx="744" cy="1004" r="4.5" />
    <circle cx="752" cy="994" r="3.5" fill="#e53935" />
    <circle cx="734" cy="1012" r="3.5" fill="#e53935" />
    <path d="M754,974 Q754,1014 714,1014" stroke="url(#goldGrad)" stroke-width="2" fill="none" />
  </g>

  <!-- Header Section -->
  <g>
    <!-- Pine Sprig Motif Above Title -->
    <path d="M380,82 Q400,68 420,82 M390,75 L400,66 L410,75" stroke="url(#goldGrad)" stroke-width="1.8" fill="none" />
    <circle cx="400" cy="72" r="3" fill="#e53935" />
    
    <text x="400" y="105" class="sub-title">✦ MERRY CHRISTMAS &amp; HAPPY HOLIDAYS ✦</text>

    <!-- Ribbon Line -->
    <line x1="260" y1="120" x2="540" y2="120" stroke="url(#goldGrad)" stroke-width="1.5" />
    <polygon points="400,115 407,120 400,125 393,120" fill="url(#goldGrad)" />

    <text x="400" y="170" class="main-title">MÓN QUÀ GIÁNG SINH</text>
    <text x="400" y="232" class="date-badge">24 · 11</text>
    <text x="400" y="272" class="wish-text">“Nguyện chúc bạn một mùa Noel an lành, ngập tràn ấm áp &amp; kỳ diệu”</text>
  </g>

  <!-- Central Card with QR Code -->
  <g filter="url(#cardShadow)">
    <!-- White Card Background -->
    <rect x="180" y="320" width="440" height="495" rx="24" fill="#ffffff" />
    <!-- Inner Card Border -->
    <rect x="192" y="332" width="416" height="471" rx="18" fill="none" stroke="url(#goldGrad)" stroke-width="1.8" opacity="0.8" />
  </g>

  <!-- Card Top Banner -->
  <g>
    <rect x="250" y="338" width="300" height="34" rx="17" fill="#7a1020" />
    <text x="400" y="361" font-family="'Segoe UI', system-ui, sans-serif" font-size="13.5" font-weight="700" fill="#ffd97d" text-anchor="middle" letter-spacing="1.5">
      🎁 QUÉT ĐỂ NHẬN QUÀ BẤT NGỜ
    </text>
  </g>

  <!-- QR Matrix (Vector Precision) -->
  <path d="${pathD}" fill="#1a0408" shape-rendering="crispEdges" />

  <!-- Center Decorative Emblem on QR -->
  <g transform="translate(400, 560)">
    <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="3" />
    <!-- Miniature Christmas Tree Icon -->
    <path d="M0,-14 L11,-3 L5,-3 L14,7 L-14,7 L-5,-3 L-11,-3 Z" fill="#1b5e3a" />
    <rect x="-2" y="7" width="4" height="4" fill="#6d4c41" />
    <polygon points="0,-16 2,-13 5,-13 2,-11 3,-8 0,-10 -3,-8 -2,-11 -5,-13 -2,-13" fill="url(#goldGrad)" />
  </g>

  <!-- Card Instruction Section Below QR -->
  <g>
    <text x="400" y="762" class="scan-cta">DÙNG CAMERA HOẶC ZALO QUÉT MÃ</text>
    <text x="400" y="788" class="scan-sub">Mở hộp quà 3D, thiệp chúc mừng &amp; nhạc Giáng Sinh du dương</text>
  </g>

  <!-- Live URL Box Below Card -->
  <g>
    <rect x="140" y="845" width="520" height="42" rx="21" fill="#000000" fill-opacity="0.45" stroke="url(#goldGrad)" stroke-width="1.2" />
    <!-- Link Icon -->
    <text x="175" y="871" font-size="16" fill="#ffd97d">🔗</text>
    <text x="410" y="871" class="url-tag">${targetUrl}</text>
  </g>

  <!-- Festive Bottom Greetings -->
  <g>
    <text x="400" y="930" class="footer-note">✦ Ấm áp bên người thân yêu • May your days be merry &amp; bright ✦</text>
    <text x="400" y="955" font-family="'Segoe UI', sans-serif" font-size="12.5" fill="#e0e0e0" opacity="0.75" text-anchor="middle">
      Thiệp điện tử tương tác đa nền tảng • Quét là xem ngay trên mọi thiết bị
    </text>

    <!-- Bottom Decorative Bow / Bells -->
    <path d="M375,990 C390,978 410,978 425,990 M390,985 L390,996 M410,985 L410,996" stroke="url(#goldGrad)" stroke-width="1.5" fill="none" />
    <circle cx="400" cy="986" r="3.5" fill="#e53935" />
  </g>
</svg>`;

    return svg;
}

// Default target URL on GitHub Pages
const DEFAULT_URL = 'https://taductoi1596-stack.github.io/noel-24-11/';

// Allow passing URL as command line argument
const targetUrl = process.argv[2] || DEFAULT_URL;

console.log(`Generating Christmas Noel 24/11 QR Card for: ${targetUrl}`);
const svgContent = generateChristmasQRCard(targetUrl);

// Write SVG file
const svgPath = path.join(__dirname, 'qr-noel-24-11.svg');
fs.writeFileSync(svgPath, svgContent, 'utf8');
console.log(`Successfully generated SVG QR Card: ${svgPath}`);

// Generate HTML preview for easy browser viewing & instant printing
const htmlPreview = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã QR Quà Tặng Noel 24/11 • Xem & In Ấn</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      background: radial-gradient(circle at center, #1b2838 0%, #0a0e17 100%);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      padding: 24px;
      box-sizing: border-box;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    h1 {
      margin: 0 0 8px;
      color: #ffd97d;
      font-size: 28px;
    }
    p {
      margin: 0;
      color: #c9d1d9;
      font-size: 15px;
    }
    .card-wrap {
      max-width: 520px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      border-radius: 20px;
      overflow: hidden;
      background: #000;
    }
    .card-wrap svg {
      display: block;
      width: 100%;
      height: auto;
    }
    .actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn {
      padding: 12px 24px;
      border-radius: 30px;
      border: none;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-gold {
      background: linear-gradient(135deg, #ffd97d, #d4af37);
      color: #1a0808;
    }
    .btn-gold:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
    }
    .btn-outline {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
    }
    .btn-outline:hover {
      background: rgba(255,255,255,0.18);
    }
    @media print {
      body { background: #fff; color: #000; padding: 0; }
      .header, .actions { display: none; }
      .card-wrap { box-shadow: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎄 Mã QR Quà Tặng Giáng Sinh Noel 24/11</h1>
    <p>Quét mã bằng Camera điện thoại hoặc Zalo để mở thiệp Giáng Sinh tương tác</p>
  </div>

  <div class="card-wrap">
    ${svgContent}
  </div>

  <div class="actions">
    <a href="qr-noel-24-11.svg" download="ma-qr-noel-24-11.svg" class="btn btn-gold">
      📥 Tải File SVG Chất Lượng Cao
    </a>
    <button onclick="window.print()" class="btn btn-outline">
      🖨️ In Thiệp / Xuất PDF
    </button>
    <a href="index.html" class="btn btn-outline">
      🎁 Mở Trực Tiếp Trang Thiệp
    </a>
  </div>
</body>
</html>`;

const previewPath = path.join(__dirname, 'qr-preview.html');
fs.writeFileSync(previewPath, htmlPreview, 'utf8');
console.log(`Successfully generated QR Preview: ${previewPath}`);

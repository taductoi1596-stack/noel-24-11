const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const QRCode = require('./qrcode.js');

// CRC32 helper for PNG
function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    table[i] = c >>> 0;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, getPixelRgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);

  const raw = Buffer.alloc(height * (1 + width * 4));
  let p = 0;
  for (let y = 0; y < height; y++) {
    raw[p++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRgba(x, y);
      raw[p++] = r;
      raw[p++] = g;
      raw[p++] = b;
      raw[p++] = a;
    }
  }
  const idatChunk = makeChunk('IDAT', zlib.deflateSync(raw));
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function generateChristmasQRCardSVG(targetUrl) {
    const qr = new QRCode(0, 0);
    qr.addData(targetUrl);
    qr.make();
    
    const moduleCount = qr.getModuleCount();
    const qrRenderSize = 340;
    const cellSize = qrRenderSize / moduleCount;
    const qrOffsetX = (800 - qrRenderSize) / 2;
    const qrOffsetY = 390;
    
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
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#140206" />
      <stop offset="35%" stop-color="#5a0815" />
      <stop offset="70%" stop-color="#801021" />
      <stop offset="100%" stop-color="#0a2618" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff2b2" />
      <stop offset="30%" stop-color="#e5b842" />
      <stop offset="65%" stop-color="#b8861b" />
      <stop offset="100%" stop-color="#ffd97d" />
    </linearGradient>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.55" />
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

  <rect width="800" height="1060" fill="url(#bgGrad)" rx="28" />

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
  </g>

  <rect x="26" y="26" width="748" height="1008" rx="20" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" opacity="0.75" />
  <rect x="36" y="36" width="728" height="988" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="8,5" opacity="0.45" />

  <g>
    <text x="400" y="105" class="sub-title">✦ MERRY CHRISTMAS &amp; HAPPY HOLIDAYS ✦</text>
    <line x1="260" y1="120" x2="540" y2="120" stroke="url(#goldGrad)" stroke-width="1.5" />
    <text x="400" y="170" class="main-title">MÓN QUÀ GIÁNG SINH</text>
    <text x="400" y="232" class="date-badge">24 · 11</text>
    <text x="400" y="272" class="wish-text">“Nguyện chúc bạn một mùa Noel an lành, ngập tràn ấm áp &amp; kỳ diệu”</text>
  </g>

  <g filter="url(#cardShadow)">
    <rect x="180" y="320" width="440" height="495" rx="24" fill="#ffffff" />
    <rect x="192" y="332" width="416" height="471" rx="18" fill="none" stroke="url(#goldGrad)" stroke-width="1.8" opacity="0.8" />
  </g>

  <g>
    <rect x="250" y="338" width="300" height="34" rx="17" fill="#7a1020" />
    <text x="400" y="361" font-family="'Segoe UI', system-ui, sans-serif" font-size="13.5" font-weight="700" fill="#ffd97d" text-anchor="middle" letter-spacing="1.5">
      🎁 QUÉT ĐỂ NHẬN QUÀ BẤT NGỜ
    </text>
  </g>

  <path d="${pathD}" fill="#1a0408" shape-rendering="crispEdges" />

  <g transform="translate(400, 560)">
    <circle cx="0" cy="0" r="26" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="3" />
    <path d="M0,-14 L11,-3 L5,-3 L14,7 L-14,7 L-5,-3 L-11,-3 Z" fill="#1b5e3a" />
    <rect x="-2" y="7" width="4" height="4" fill="#6d4c41" />
  </g>

  <g>
    <text x="400" y="762" class="scan-cta">DÙNG CAMERA HOẶC ZALO QUÉT MÃ</text>
    <text x="400" y="788" class="scan-sub">Mở hộp quà 3D, thiệp chúc mừng &amp; nhạc Giáng Sinh du dương</text>
  </g>

  <g>
    <rect x="140" y="845" width="520" height="42" rx="21" fill="#000000" fill-opacity="0.45" stroke="url(#goldGrad)" stroke-width="1.2" />
    <text x="175" y="871" font-size="16" fill="#ffd97d">🔗</text>
    <text x="410" y="871" class="url-tag">${targetUrl}</text>
  </g>

  <g>
    <text x="400" y="930" class="footer-note">✦ Ấm áp bên người thân yêu • May your days be merry &amp; bright ✦</text>
  </g>
</svg>`;

    return svg;
}

function generatePNGFiles(targetUrl) {
    const qr = new QRCode(0, 0);
    qr.addData(targetUrl);
    qr.make();
    const count = qr.getModuleCount();

    const quietZone = 4;
    const totalModules = count + quietZone * 2;
    const scale = 14;
    const imgSize = totalModules * scale;

    // 1. Festive Wine Red PNG
    const festivePng = createPng(imgSize, imgSize, (x, y) => {
        const modX = Math.floor(x / scale) - quietZone;
        const modY = Math.floor(y / scale) - quietZone;
        if (modX >= 0 && modX < count && modY >= 0 && modY < count) {
            if (qr.isDark(modY, modX)) {
                return [128, 16, 33, 255]; // Wine Red
            }
        }
        return [255, 255, 255, 255];
    });
    fs.writeFileSync(path.join(__dirname, 'qr-noel-24-11.png'), festivePng);

    // 2. Standard Pure Black & White PNG
    const standardPng = createPng(imgSize, imgSize, (x, y) => {
        const modX = Math.floor(x / scale) - quietZone;
        const modY = Math.floor(y / scale) - quietZone;
        if (modX >= 0 && modX < count && modY >= 0 && modY < count) {
            if (qr.isDark(modY, modX)) {
                return [0, 0, 0, 255]; // Pure Black
            }
        }
        return [255, 255, 255, 255];
    });
    fs.writeFileSync(path.join(__dirname, 'qr-code-standard.png'), standardPng);
}

const DEFAULT_URL = 'https://taductoi1596-stack.github.io/noel-24-11/';
const targetUrl = process.argv[2] || DEFAULT_URL;

console.log(`Generating Christmas Noel 24/11 QR Card for: ${targetUrl}`);

// SVG
const svgContent = generateChristmasQRCardSVG(targetUrl);
fs.writeFileSync(path.join(__dirname, 'qr-noel-24-11.svg'), svgContent, 'utf8');

// PNGs
generatePNGFiles(targetUrl);
console.log(`Successfully generated PNG files: qr-noel-24-11.png, qr-code-standard.png`);

// HTML Preview
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
    .card-wrap svg, .card-wrap img {
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
    .btn-outline {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎄 Mã QR Quà Tặng Giáng Sinh Noel 24/11</h1>
    <p>Dùng điện thoại quét trực tiếp mã bên dưới để mở thiệp Giáng Sinh</p>
  </div>

  <div class="card-wrap">
    ${svgContent}
  </div>

  <div class="actions">
    <a href="qr-noel-24-11.png" download="qr-noel-24-11.png" class="btn btn-gold">
      🖼️ Tải Ảnh PNG (574x574)
    </a>
    <a href="qr-noel-24-11.svg" download="ma-qr-noel-24-11.svg" class="btn btn-outline">
      🎨 Tải File SVG Khung Vàng
    </a>
    <button onclick="window.print()" class="btn btn-outline">
      🖨️ In Thiệp / PDF
    </button>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'qr-preview.html'), htmlPreview, 'utf8');
console.log('Successfully generated all QR assets!');

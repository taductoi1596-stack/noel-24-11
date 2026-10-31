/**
 * CHRISTMAS NOEL 24/11 - INTERACTIVE LOGIC & WEB AUDIO SYNTHESIZER
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const snowCanvas = document.getElementById('snowCanvas');
  const giftBox = document.getElementById('giftBox');
  const giftBoxStage = document.getElementById('giftBoxStage');
  const cardStage = document.getElementById('cardStage');
  
  // Music Controls
  const btnMusic = document.getElementById('btnMusic');
  const btnReplayMusic = document.getElementById('btnReplayMusic');
  const musicIcon = document.getElementById('musicIcon');
  const musicLabel = document.getElementById('musicLabel');

  // Modals
  const wishModal = document.getElementById('wishModal');
  const customizeModal = document.getElementById('customizeModal');
  const qrModal = document.getElementById('qrModal');

  // Modal triggers
  const btnWishTrigger = document.getElementById('btnWishTrigger');
  const btnCloseWish = document.getElementById('btnCloseWish');
  const btnSendWish = document.getElementById('btnSendWish');
  const customWishInput = document.getElementById('customWishInput');
  const quickWishChips = document.querySelectorAll('.quick-wish-chip');

  const btnOpenCustomize = document.getElementById('btnOpenCustomize');
  const btnCloseCustomize = document.getElementById('btnCloseCustomize');
  const btnSaveCustomize = document.getElementById('btnSaveCustomize');

  const btnShowQr = document.getElementById('btnShowQr');
  const btnShowQrInside = document.getElementById('btnShowQrInside');
  const btnCloseQr = document.getElementById('btnCloseQr');
  const btnCopyLink = document.getElementById('btnCopyLink');
  const btnDownloadQrPng = document.getElementById('btnDownloadQrPng');
  const qrTargetUrl = document.getElementById('qrTargetUrl');
  const qrCanvas = document.getElementById('qrCodeCanvas');

  // Mini gifts
  const miniGifts = [document.getElementById('gift1'), document.getElementById('gift2'), document.getElementById('gift3')];

  // Customizable fields
  const displayRecipient = document.getElementById('displayRecipient');
  const displaySender = document.getElementById('displaySender');
  const cardDateText = document.getElementById('cardDateText');
  const displayIntroDate = document.getElementById('displayIntroDate');
  const navTitle = document.getElementById('navTitle');
  const inputRecipient = document.getElementById('inputRecipient');
  const inputSender = document.getElementById('inputSender');
  const selectDate = document.getElementById('selectDate');

  /* ===================================================
     1. REALISTIC SNOWFALL & SHOOTING STARS CANVAS
     =================================================== */
  const ctx = snowCanvas.getContext('2d');
  let width = (snowCanvas.width = window.innerWidth);
  let height = (snowCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = snowCanvas.width = window.innerWidth;
    height = snowCanvas.height = window.innerHeight;
  });

  const snowflakes = [];
  const maxFlakes = 85;
  for (let i = 0; i < maxFlakes; i++) {
    snowflakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.8 + 0.8,
      density: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      angle: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.01
    });
  }

  // Shooting stars array
  const shootingStars = [];

  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * (width * 0.7),
      y: Math.random() * (height * 0.35),
      length: Math.random() * 80 + 70,
      speed: Math.random() * 10 + 12,
      opacity: 1,
      angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1)
    });
  }

  function renderSnow() {
    ctx.clearRect(0, 0, width, height);

    // Draw & update snowflakes
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < maxFlakes; i++) {
      const f = snowflakes[i];
      f.angle += f.swingSpeed;
      f.y += f.density;
      f.x += Math.sin(f.angle) * 0.8;

      if (f.y > height) {
        f.y = -5;
        f.x = Math.random() * width;
      }
      if (f.x > width) f.x = 0;
      if (f.x < 0) f.x = width;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
      ctx.fill();
    }

    // Draw & update shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      const tailX = s.x - Math.cos(s.angle) * s.length;
      const tailY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 235, 150, ${s.opacity})`);
      grad.addColorStop(1, 'rgba(255, 235, 150, 0)');

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.02;

      if (s.opacity <= 0 || s.x > width || s.y > height) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(renderSnow);
  }
  renderSnow();

  // Periodic random shooting star
  setInterval(() => {
    if (Math.random() > 0.4) spawnShootingStar();
  }, 4500);

  /* ===================================================
     2. WEB AUDIO API SYNTHESIZER (CHRISTMAS CAROLS)
     =================================================== */
  let audioCtx = null;
  let isPlaying = false;
  let musicTimeout = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Musical note frequency helper
  const noteFreqs = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99,
    'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C6': 1046.50,
    'REST': 0
  };

  // "We Wish You a Merry Christmas" Melody Notes & Durations
  const carolMelody = [
    { note: 'D4', dur: 0.4 },
    { note: 'G4', dur: 0.4 }, { note: 'G4', dur: 0.2 }, { note: 'A4', dur: 0.2 }, { note: 'G4', dur: 0.2 }, { note: 'F#4', dur: 0.2 },
    { note: 'E4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'E4', dur: 0.4 },
    { note: 'A4', dur: 0.4 }, { note: 'A4', dur: 0.2 }, { note: 'B4', dur: 0.2 }, { note: 'A4', dur: 0.2 }, { note: 'G4', dur: 0.2 },
    { note: 'F#4', dur: 0.4 }, { note: 'D4', dur: 0.4 }, { note: 'D4', dur: 0.4 },
    { note: 'B4', dur: 0.4 }, { note: 'B4', dur: 0.2 }, { note: 'C5', dur: 0.2 }, { note: 'B4', dur: 0.2 }, { note: 'A4', dur: 0.2 },
    { note: 'G4', dur: 0.4 }, { note: 'E4', dur: 0.4 }, { note: 'D4', dur: 0.2 }, { note: 'D4', dur: 0.2 },
    { note: 'E4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'F#4', dur: 0.4 },
    { note: 'G4', dur: 0.8 }, { note: 'REST', dur: 0.3 }
  ];

  // Sweet Celesta / Music Box chime tone generator
  function playTone(freq, duration, timeOffset = 0) {
    if (!audioCtx || freq <= 0) return;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, audioCtx.currentTime + timeOffset);

    // Overtones for bell sparkle
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, audioCtx.currentTime + timeOffset);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + timeOffset);
    gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + timeOffset + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + timeOffset + duration * 1.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(audioCtx.currentTime + timeOffset);
    osc2.start(audioCtx.currentTime + timeOffset);
    osc1.stop(audioCtx.currentTime + timeOffset + duration * 1.6);
    osc2.stop(audioCtx.currentTime + timeOffset + duration * 1.6);
  }

  // Play opening bell chime sound
  function playOpenChime() {
    initAudio();
    const chimeNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chimeNotes.forEach((freq, idx) => {
      playTone(freq, 0.6, idx * 0.12);
    });
  }

  // Play loop of Christmas carol
  let currentNoteIndex = 0;
  function scheduleNextNote() {
    if (!isPlaying) return;

    const item = carolMelody[currentNoteIndex];
    if (item.note !== 'REST' && noteFreqs[item.note]) {
      playTone(noteFreqs[item.note], item.dur);
    }

    currentNoteIndex = (currentNoteIndex + 1) % carolMelody.length;
    musicTimeout = setTimeout(scheduleNextNote, item.dur * 1000);
  }

  function startMusic() {
    initAudio();
    isPlaying = true;
    currentNoteIndex = 0;
    musicIcon.textContent = '🎶';
    musicLabel.textContent = 'Tắt Nhạc';
    btnMusic.classList.add('highlight');
    scheduleNextNote();
  }

  function stopMusic() {
    isPlaying = false;
    clearTimeout(musicTimeout);
    musicIcon.textContent = '🔔';
    musicLabel.textContent = 'Bật Nhạc';
    btnMusic.classList.remove('highlight');
  }

  function toggleMusic() {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }

  btnMusic.addEventListener('click', toggleMusic);
  btnReplayMusic.addEventListener('click', () => {
    stopMusic();
    setTimeout(startMusic, 200);
  });

  /* ===================================================
     3. 3D GIFT BOX INTERACTION
     =================================================== */
  giftBox.addEventListener('click', () => {
    giftBox.classList.add('opening');
    playOpenChime();

    // Trigger burst of stars
    for (let k = 0; k < 4; k++) {
      setTimeout(spawnShootingStar, k * 120);
    }

    setTimeout(() => {
      giftBoxStage.classList.add('hidden');
      cardStage.classList.remove('hidden');
      startMusic();
    }, 700);
  });

  /* ===================================================
     4. INTERACTIVE 3 MINI GIFTS
     =================================================== */
  miniGifts.forEach((gift, index) => {
    gift.addEventListener('click', () => {
      initAudio();
      // Tone chime
      playTone(659.25 + index * 130, 0.5);

      const icon = gift.querySelector('.mini-box-icon');
      const label = gift.querySelector('.mini-box-label');
      const reveal = gift.querySelector('.mini-box-reveal');

      icon.classList.add('hidden');
      label.classList.add('hidden');
      reveal.classList.remove('hidden');
      gift.style.borderColor = 'var(--gold-primary)';
      gift.style.background = 'rgba(229, 184, 66, 0.18)';
    });
  });

  /* ===================================================
     5. MAKE A WISH MODAL
     =================================================== */
  btnWishTrigger.addEventListener('click', () => {
    wishModal.classList.remove('hidden');
  });

  btnCloseWish.addEventListener('click', () => {
    wishModal.classList.add('hidden');
  });

  quickWishChips.forEach(chip => {
    chip.addEventListener('click', () => {
      customWishInput.value = chip.getAttribute('data-wish');
    });
  });

  btnSendWish.addEventListener('click', () => {
    const wish = customWishInput.value.trim() || 'Chúc một mùa Giáng Sinh ấm áp & an lành!';
    wishModal.classList.add('hidden');

    // Chime & shoot star
    initAudio();
    playTone(880, 0.6);
    playTone(1046.5, 0.7, 0.15);
    spawnShootingStar();
    spawnShootingStar();

    alert(`🌟 Điều ước đã gửi thành công!\n"${wish}"\n\nNgôi sao Giáng Sinh sẽ biến ước mơ của bạn thành hiện thực! ✨`);
  });

  /* ===================================================
     6. CARD CUSTOMIZE MODAL
     =================================================== */
  btnOpenCustomize.addEventListener('click', () => {
    customizeModal.classList.remove('hidden');
  });

  btnCloseCustomize.addEventListener('click', () => {
    customizeModal.classList.add('hidden');
  });

  btnSaveCustomize.addEventListener('click', () => {
    const newRecipient = inputRecipient.value.trim() || 'Bạn và Những Người Thân Yêu';
    const newSender = inputSender.value.trim() || 'Người Gửi Tặng';
    const dateVal = selectDate.value;

    displayRecipient.textContent = newRecipient;
    displaySender.textContent = `✦ ${newSender} ✦`;

    if (dateVal === '24/11') {
      cardDateText.textContent = 'ĐÊM NOEL 24 · 11';
      displayIntroDate.textContent = '24 · 11';
      navTitle.textContent = 'Noel 24 · 11';
    } else if (dateVal === '24/12') {
      cardDateText.textContent = 'ĐÊM GIÁNG SINH 24 · 12';
      displayIntroDate.textContent = '24 · 12';
      navTitle.textContent = 'Noel 24 · 12';
    } else {
      cardDateText.textContent = 'NGÀY GIÁNG SINH 25 · 12';
      displayIntroDate.textContent = '25 · 12';
      navTitle.textContent = 'Noel 25 · 12';
    }

    customizeModal.classList.add('hidden');
    initAudio();
    playTone(880, 0.4);
  });

  /* ===================================================
     7. QR CODE DISPLAY & DOWNLOAD
     =================================================== */
  function openQrModal() {
    renderQrCode();
    qrModal.classList.remove('hidden');
  }

  btnShowQr.addEventListener('click', openQrModal);
  btnShowQrInside.addEventListener('click', openQrModal);

  btnCloseQr.addEventListener('click', () => {
    qrModal.classList.add('hidden');
  });

  // Render QR Code onto Canvas using QRCode library
  function renderQrCode() {
    const url = qrTargetUrl.value.trim();
    if (!url || typeof QRCode === 'undefined') return;

    try {
      const qr = new QRCode(0, 0); // auto-detect, EC level M
      qr.addData(url);
      qr.make();

      const moduleCount = qr.getModuleCount();
      const canvasSize = 280;
      qrCanvas.width = canvasSize;
      qrCanvas.height = canvasSize;

      const qCtx = qrCanvas.getContext('2d');
      qCtx.fillStyle = '#ffffff';
      qCtx.fillRect(0, 0, canvasSize, canvasSize);

      const cellSize = canvasSize / moduleCount;
      qCtx.fillStyle = '#7a1020'; // festive deep burgundy

      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (qr.isDark(r, c)) {
            qCtx.fillRect(c * cellSize, r * cellSize, cellSize + 0.3, cellSize + 0.3);
          }
        }
      }
    } catch (e) {
      console.error('QR Render Error:', e);
    }
  }

  btnCopyLink.addEventListener('click', () => {
    qrTargetUrl.select();
    navigator.clipboard.writeText(qrTargetUrl.value).then(() => {
      btnCopyLink.textContent = '✓ Đã Chép';
      setTimeout(() => (btnCopyLink.textContent = 'Sao Chép'), 2000);
    });
  });

  btnDownloadQrPng.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'ma-qr-noel-24-11.png';
    link.href = qrCanvas.toDataURL('image/png');
    link.click();
  });

  // Close modals clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === wishModal) wishModal.classList.add('hidden');
    if (e.target === customizeModal) customizeModal.classList.add('hidden');
    if (e.target === qrModal) qrModal.classList.add('hidden');
  });
});


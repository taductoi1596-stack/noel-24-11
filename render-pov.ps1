
Add-Type -AssemblyName System.Drawing

$fontTitle = New-Object System.Drawing.Font("Arial", 36, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", 26, [System.Drawing.FontStyle]::Regular)
$fontSmall = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
$fontBold = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
$fontSerif = New-Object System.Drawing.Font("Georgia", 48, [System.Drawing.FontStyle]::Bold)
$fontItalic = New-Object System.Drawing.Font("Georgia", 28, [System.Drawing.FontStyle]::Italic)

$brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 217, 125))
$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$brushYellowPill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 254, 215, 0))
$brushDarkPillText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 20, 20, 20))
$brushDarkBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 18, 28))
$penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 184, 66), 4)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

# Helper to draw cozy Christmas room background
function DrawRoomBg($g) {
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(1080, 1920)),
        ([System.Drawing.Color]::FromArgb(255, 20, 12, 22)),
        ([System.Drawing.Color]::FromArgb(255, 8, 12, 20))
    )
    $g.FillRectangle($bgBrush, 0, 0, 1080, 1920)

    # Soft glowing fairy lights in background
    $lightBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(60, 255, 220, 130))
    $g.FillEllipse($lightBrush, 120, 150, 180, 180)
    $g.FillEllipse($lightBrush, 780, 240, 220, 220)
    $g.FillEllipse($lightBrush, 40, 800, 150, 150)
    $g.FillEllipse($lightBrush, 900, 1100, 160, 160)
}

# Helper to draw phone body
function DrawPhoneBody($g) {
    # Phone outer frame
    $frameBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 32, 34, 40))
    $g.FillRectangle($frameBrush, 110, 120, 860, 1720)
    $penPhoneEdge = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 140, 150, 165), 8)
    $g.DrawRectangle($penPhoneEdge, 110, 120, 860, 1720)

    # Phone screen inner
    $screenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 0, 0))
    $g.FillRectangle($screenBrush, 130, 140, 820, 1680)

    # Dynamic Island / Notch
    $notchBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 18, 18))
    $g.FillRectangle($notchBrush, 430, 160, 220, 50)
    $penNotch = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 45, 45, 50), 2)
    $g.DrawRectangle($penNotch, 430, 160, 220, 50)

    # iOS Status Bar
    $fontStatus = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
    $sfLeft = New-Object System.Drawing.StringFormat
    $sfLeft.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("9:41", $fontStatus, $brushWhite, (New-Object System.Drawing.RectangleF(180, 160, 150, 50)), $sfLeft)
    $g.DrawString("5G  100%", $fontStatus, $brushWhite, (New-Object System.Drawing.RectangleF(720, 160, 180, 50)), $sf)
}

# ========================================================
# 1. FRAME 1: Phone Camera Aiming at the QR Card
# ========================================================
$bmp1 = New-Object System.Drawing.Bitmap(1080, 1920)
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
DrawRoomBg($g1)
DrawPhoneBody($g1)

# Camera Viewport
$cameraBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 20, 30))
$g1.FillRectangle($cameraBg, 130, 230, 820, 1350)

# Draw QR card inside camera viewport
$qrPath = "C:\Users\taduc\.gemini\antigravity\scratch\noel-24-11\qr-noel-24-11.png"
if (Test-Path $qrPath) {
    $qrImg = [System.Drawing.Image]::FromFile($qrPath)
    $g1.DrawImage($qrImg, 270, 550, 540, 540)
    $qrImg.Dispose()
}

# Camera grid lines (subtle)
$penGrid = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(40, 255, 255, 255), 1)
$g1.DrawLine($penGrid, 400, 230, 400, 1580)
$g1.DrawLine($penGrid, 680, 230, 680, 1580)
$g1.DrawLine($penGrid, 130, 680, 950, 680)
$g1.DrawLine($penGrid, 130, 1130, 950, 1130)

# Bottom Camera Controls (Shutter, etc.)
$shutterOuter = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 6)
$g1.DrawEllipse($shutterOuter, 490, 1620, 100, 100)
$shutterInner = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$g1.FillEllipse($shutterInner, 502, 1632, 76, 76)
$g1.DrawString("PHOTO", $fontBold, $brushGold, (New-Object System.Drawing.RectangleF(440, 1540, 200, 40)), $sf)

$bmp1.Save("C:\Users\taduc\.gemini\antigravity\scratch\noel-24-11\pov1.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g1.Dispose()
$bmp1.Dispose()
Write-Host "Created pov1.png (Camera Aiming)"

# ========================================================
# 2. FRAME 2: QR Detected with Yellow iOS Scanner Pill
# ========================================================
$bmp2 = New-Object System.Drawing.Bitmap(1080, 1920)
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
DrawRoomBg($g2)
DrawPhoneBody($g2)

# Camera Viewport with QR
$g2.FillRectangle($cameraBg, 130, 230, 820, 1350)
if (Test-Path $qrPath) {
    $qrImg = [System.Drawing.Image]::FromFile($qrPath)
    $g2.DrawImage($qrImg, 270, 550, 540, 540)
    $qrImg.Dispose()
}

# Yellow iPhone QR Focus Brackets
$penYellow = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 254, 215, 0), 6)
# Top-Left
$g2.DrawLine($penYellow, 250, 530, 330, 530)
$g2.DrawLine($penYellow, 250, 530, 250, 610)
# Top-Right
$g2.DrawLine($penYellow, 830, 530, 750, 530)
$g2.DrawLine($penYellow, 830, 530, 830, 610)
# Bottom-Left
$g2.DrawLine($penYellow, 250, 1110, 330, 1110)
$g2.DrawLine($penYellow, 250, 1110, 250, 1030)
# Bottom-Right
$g2.DrawLine($penYellow, 830, 1110, 750, 1110)
$g2.DrawLine($penYellow, 830, 1110, 830, 1030)

# Yellow iOS QR Code Link Pill (Tapped Link)
$g2.FillRectangle($brushYellowPill, 240, 1150, 600, 70)
$fontPill = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Bold)
$g2.DrawString("Mo taductoi1596-stack.github.io", $fontPill, $brushDarkPillText, (New-Object System.Drawing.RectangleF(240, 1150, 600, 70)), $sf)

# Shutter
$g2.DrawEllipse($shutterOuter, 490, 1620, 100, 100)
$g2.FillEllipse($shutterInner, 502, 1632, 76, 76)

$bmp2.Save("C:\Users\taduc\.gemini\antigravity\scratch\noel-24-11\pov2.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose()
$bmp2.Dispose()
Write-Host "Created pov2.png (QR Detected)"

# ========================================================
# 3. FRAME 3: Finger Taps Link Pill
# ========================================================
$bmp3 = New-Object System.Drawing.Bitmap(1080, 1920)
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
DrawRoomBg($g3)
DrawPhoneBody($g3)
$g3.FillRectangle($cameraBg, 130, 230, 820, 1350)
if (Test-Path $qrPath) {
    $qrImg = [System.Drawing.Image]::FromFile($qrPath)
    $g3.DrawImage($qrImg, 270, 550, 540, 540)
    $qrImg.Dispose()
}

# Brackets
$g3.DrawLine($penYellow, 250, 530, 330, 530)
$g3.DrawLine($penYellow, 250, 530, 250, 610)
$g3.DrawLine($penYellow, 830, 530, 750, 530)
$g3.DrawLine($penYellow, 830, 530, 830, 610)
$g3.DrawLine($penYellow, 250, 1110, 330, 1110)
$g3.DrawLine($penYellow, 250, 1110, 250, 1030)
$g3.DrawLine($penYellow, 830, 1110, 750, 1110)
$g3.DrawLine($penYellow, 830, 1110, 830, 1030)

# Tapped Pill with glow ripple
$rippleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(120, 255, 255, 255))
$g3.FillEllipse($rippleBrush, 480, 1130, 120, 120)
$g3.FillRectangle($brushYellowPill, 240, 1150, 600, 70)
$g3.DrawString("Mo taductoi1596-stack.github.io", $fontPill, $brushDarkPillText, (New-Object System.Drawing.RectangleF(240, 1150, 600, 70)), $sf)

# Tap icon
$fontTapIcon = New-Object System.Drawing.Font("Arial", 48, [System.Drawing.FontStyle]::Regular)
$g3.DrawString("👆", $fontTapIcon, $brushWhite, (New-Object System.Drawing.RectangleF(500, 1170, 100, 100)), $sf)

$g3.DrawEllipse($shutterOuter, 490, 1620, 100, 100)
$g3.FillEllipse($shutterInner, 502, 1632, 76, 76)

$bmp3.Save("C:\Users\taduc\.gemini\antigravity\scratch\noel-24-11\pov3.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g3.Dispose()
$bmp3.Dispose()
Write-Host "Created pov3.png (Tapped Link)"

# ========================================================
# 4. FRAME 4: Mobile Safari Browser with 3D Gift Box
# ========================================================
$bmp4 = New-Object System.Drawing.Bitmap(1080, 1920)
$g4 = [System.Drawing.Graphics]::FromImage($bmp4)
$g4.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
DrawRoomBg($g4)
DrawPhoneBody($g4)

# Web Page Canvas inside phone (y: 220 - 1650)
$webBgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 220)),
    (New-Object System.Drawing.Point(0, 1650)),
    ([System.Drawing.Color]::FromArgb(255, 25, 10, 16)),
    ([System.Drawing.Color]::FromArgb(255, 10, 16, 26))
)
$g4.FillRectangle($webBgBrush, 130, 220, 820, 1430)

# Falling snowflakes on web page
$snowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 255, 255, 255))
$g4.FillEllipse($snowBrush, 220, 300, 12, 12)
$g4.FillEllipse($snowBrush, 450, 260, 8, 8)
$g4.FillEllipse($snowBrush, 750, 320, 14, 14)
$g4.FillEllipse($snowBrush, 320, 520, 10, 10)
$g4.FillEllipse($snowBrush, 820, 600, 12, 12)
$g4.FillEllipse($snowBrush, 200, 920, 10, 10)
$g4.FillEllipse($snowBrush, 780, 1050, 14, 14)

# Web Title
$g4.DrawString("MERRY CHRISTMAS", $fontSmall, $brushGold, (New-Object System.Drawing.RectangleF(130, 280, 820, 40)), $sf)
$g4.DrawString("Mon Qua Giang Sinh Noel", $fontTitle, $brushWhite, (New-Object System.Drawing.RectangleF(130, 330, 820, 50)), $sf)
$fontDateBig = New-Object System.Drawing.Font("Georgia", 56, [System.Drawing.FontStyle]::Bold)
$g4.DrawString("24 . 11", $fontDateBig, $brushGold, (New-Object System.Drawing.RectangleF(130, 390, 820, 80)), $sf)

# 3D Christmas Box on Screen
$boxRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 165, 18, 40))
$g4.FillRectangle($boxRed, 310, 680, 460, 460)
$g4.DrawRectangle($penGold, 310, 680, 460, 460)

# Lid
$lidRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 195, 25, 50))
$g4.FillRectangle($lidRed, 280, 590, 520, 110)
$g4.DrawRectangle($penGold, 280, 590, 520, 110)

# Gold Ribbons
$ribbonGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 217, 125))
$g4.FillRectangle($ribbonGold, 500, 590, 80, 550) # Vert
$g4.FillRectangle($ribbonGold, 310, 870, 460, 80) # Horiz
$g4.FillEllipse($ribbonGold, 400, 510, 130, 110) # Bow left
$g4.FillEllipse($ribbonGold, 550, 510, 130, 110) # Bow right

# Gift Tag
$tagBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 248, 230))
$g4.FillRectangle($tagBg, 620, 720, 180, 90)
$g4.DrawRectangle($penGold, 620, 720, 180, 90)
$fontTagMini = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Bold)
$brushTagRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 140, 15, 30))
$g4.DrawString("To: Nguoi Thuong", $fontTagMini, $brushTagRed, (New-Object System.Drawing.RectangleF(620, 730, 180, 30)), $sf)
$g4.DrawString("Noel 24/11", $fontTagMini, $brushTagRed, (New-Object System.Drawing.RectangleF(620, 765, 180, 30)), $sf)

# Tap Box Hint
$tapBoxBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 20, 14, 20))
$g4.FillRectangle($tapBoxBrush, 230, 1220, 620, 80)
$g4.DrawRectangle($penGold, 230, 1220, 620, 80)
$g4.DrawString("Cham vao hop qua de mo dieu ky dieu! 👆", $fontSub, $brushGold, (New-Object System.Drawing.RectangleF(230, 1220, 620, 80)), $sf)

# Safari Bottom Floating Address Bar
$safariBarBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 35, 38, 48))
$g4.FillRectangle($safariBarBrush, 180, 1540, 720, 70)
$penSafari = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, 255, 255, 255), 1)
$g4.DrawRectangle($penSafari, 180, 1540, 720, 70)
$fontUrlBar = New-Object System.Drawing.Font("Arial", 20, [System.Drawing.FontStyle]::Regular)
$g4.DrawString("aA   taductoi1596-stack.github.io   ↻", $fontUrlBar, $brushWhite, (New-Object System.Drawing.RectangleF(180, 1540, 720, 70)), $sf)

$bmp4.Save("C:\Users\taduc\.gemini\antigravity\scratch\noel-24-11\pov4.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g4.Dispose()
$bmp4.Dispose()
Write-Host "Created pov4.png (Web Page Loaded with 3D Box)"

# ========================================================
# 5. FRAME 5: Box Opens with Sparkles & Firework Glow
# ========================================================
$bmp5 = New-Object System.Drawing.Bitmap(1080, 1920)
$g5 = [System.Drawing.Graphics]::FromImage($bmp5)
$g5.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
DrawRoomBg($g5)
DrawPhoneBody($g5)
$g5.FillRectangle($webBgBrush, 130, 220, 820, 1430)

# Golden Magic Burst from inside box
$burstBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(80, 255, 220, 100))
$g5.FillEllipse($burstBrush, 200, 450, 680, 680)

# Exploding Stars / Sparkles
$sparkleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 240, 180))
$g5.FillEllipse($sparkleBrush, 280, 480, 24, 24)
$g5.FillEllipse($sparkleBrush, 750, 440, 28, 28)
$g5.FillEllipse($sparkleBrush, 360, 380, 18, 18)
$g5.FillEllipse($sparkleBrush, 680, 360, 22, 22)
$g5.FillEllipse($sparkleBrush, 500, 320, 32, 32)
$g5.FillEllipse($sparkleBrush, 220, 620, 16, 16)
$g5.FillEllipse($sparkleBrush, 820, 640, 20, 20)

# Box Body
$g5.FillRectangle($boxRed, 310, 780, 460, 420)
$g5.DrawRectangle($penGold, 310, 780, 460, 420)
$g5.FillRectangle($ribbonGold, 500, 780, 80, 420)

# Lid Flying upward tilted
$g5.FillRectangle($lidRed, 250, 440, 520, 100)
$g5.DrawRectangle($penGold, 250, 440, 520, 100)
$g5.FillEllipse($ribbonGold, 460, 380, 100, 80)

# Festive announcement
$g5.DrawString("BOOM! HOP QUA DA MO!", $fontTitle, $brushGold, (New-Object System.Drawing.RectangleF(130, 1260, 820, 50)), $sf)
$g5.DrawString("Giai dieu Giang Sinh & loi chuc xuat hien...", $fontSub, $brushWhite, (New-Object System.Drawing.RectangleF(130, 1320, 820, 50)), $sf)

# Safari bar
$g5.FillRectangle($safariBarBrush, 180, 1540, 720, 70)
$g5.DrawRectangle($penSafari, 180, 1540, 720, 70)
$g5.DrawString("aA   taductoi1596-stack.github.io   ↻", $fontUrlBar, $brushWhite, (New-Object System.Drawing.RectangleF(180, 1540, 720, 70)), $sf)

$bmp5.Save("C:\Users\taduc\.gemini\antigravity\scratch\noel-24-11\pov5.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g5.Dispose()
$bmp5.Dispose()
Write-Host "Created pov5.png (Box Opens)"

# ========================================================
# 6. FRAME 6: Full Noel Greeting Card & Wishes
# ========================================================
$bmp6 = New-Object System.Drawing.Bitmap(1080, 1920)
$g6 = [System.Drawing.Graphics]::FromImage($bmp6)
$g6.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
DrawRoomBg($g6)
DrawPhoneBody($g6)
$g6.FillRectangle($webBgBrush, 130, 220, 820, 1430)

# Card Container
$cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 24, 15, 24))
$g6.FillRectangle($cardBg, 160, 250, 760, 1260)
$g6.DrawRectangle($penGold, 160, 250, 760, 1260)

# Card Titles
$g6.DrawString("GIANG SINH AN LANH", $fontSmall, $brushGold, (New-Object System.Drawing.RectangleF(160, 280, 760, 35)), $sf)
$g6.DrawString("Merry Christmas", $fontSerif, $brushGold, (New-Object System.Drawing.RectangleF(160, 320, 760, 70)), $sf)
$g6.DrawString("DEM NOEL 24 . 11", $fontBold, $brushWhite, (New-Object System.Drawing.RectangleF(160, 400, 760, 45)), $sf)

# Recipient
$g6.DrawString("Gui tang: Nguoi Thuong cua Ban", $fontSub, $brushGold, (New-Object System.Drawing.RectangleF(160, 470, 760, 40)), $sf)

# Warm Wishes
$g6.DrawString("Nguyen chuc ban mot mua Giang Sinh am ap,", $fontItalic, $brushWhite, (New-Object System.Drawing.RectangleF(180, 540, 720, 45)), $sf)
$g6.DrawString("an lanh va ngap tran niem vui, hanh phuc!", $fontItalic, $brushGold, (New-Object System.Drawing.RectangleF(180, 590, 720, 45)), $sf)
$g6.DrawString("Mong rang hoi am tu nhung tinh cam chan thanh", $fontSub, $brushWhite, (New-Object System.Drawing.RectangleF(180, 660, 720, 40)), $sf)
$g6.DrawString("se luon suoi am trai tim ban trong mua dong nay.", $fontSub, $brushWhite, (New-Object System.Drawing.RectangleF(180, 705, 720, 40)), $sf)

# 3 Lucky Gift Boxes
$giftCardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 45, 18, 30))
$penMiniGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 184, 66), 2)

# Box 1
$g6.FillRectangle($giftCardBrush, 190, 780, 700, 110)
$g6.DrawRectangle($penMiniGold, 190, 780, 700, 110)
$g6.DrawString("HOP QUA 1: BINH AN & SUC KHOE", $fontBold, $brushGold, (New-Object System.Drawing.RectangleF(200, 790, 680, 35)), $sf)
$g6.DrawString("365 ngay luon manh khoe, tuoi vui va an yen!", $fontSmall, $brushWhite, (New-Object System.Drawing.RectangleF(200, 835, 680, 35)), $sf)

# Box 2
$g6.FillRectangle($giftCardBrush, 190, 910, 700, 110)
$g6.DrawRectangle($penMiniGold, 190, 910, 700, 110)
$g6.DrawString("HOP QUA 2: TINH YEU & AM AP", $fontBold, $brushGold, (New-Object System.Drawing.RectangleF(200, 920, 680, 35)), $sf)
$g6.DrawString("Luon duoc yeu thuong va dong day tieng cuoi!", $fontSmall, $brushWhite, (New-Object System.Drawing.RectangleF(200, 965, 680, 35)), $sf)

# Box 3
$g6.FillRectangle($giftCardBrush, 190, 1040, 700, 110)
$g6.DrawRectangle($penMiniGold, 190, 1040, 700, 110)
$g6.DrawString("HOP QUA 3: THANH CONG & TAI LOC", $fontBold, $brushGold, (New-Object System.Drawing.RectangleF(200, 1050, 680, 35)), $sf)
$g6.DrawString("Van su hanh thong, moi uoc mo deu thanh hien thuc!", $fontSmall, $brushWhite, (New-Object System.Drawing.RectangleF(200, 1095, 680, 35)), $sf)

# AI Santa thumbnail
$santaPath = "C:\Users\taduc\.gemini\antigravity\scratch\noel-24-11\ai-santa.jpg"
if (Test-Path $santaPath) {
    $santaImg = [System.Drawing.Image]::FromFile($santaPath)
    $g6.DrawImage($santaImg, 430, 1180, 220, 220)
    $santaImg.Dispose()
}
$g6.DrawRectangle($penGold, 430, 1180, 220, 220)
$g6.DrawString("May your holidays be merry & bright!", $fontItalic, $brushGold, (New-Object System.Drawing.RectangleF(160, 1420, 760, 45)), $sf)

# Safari bar
$g6.FillRectangle($safariBarBrush, 180, 1540, 720, 70)
$g6.DrawRectangle($penSafari, 180, 1540, 720, 70)
$g6.DrawString("aA   taductoi1596-stack.github.io   ↻", $fontUrlBar, $brushWhite, (New-Object System.Drawing.RectangleF(180, 1540, 720, 70)), $sf)

$bmp6.Save("C:\Users\taduc\.gemini\antigravity\scratch\noel-24-11\pov6.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g6.Dispose()
$bmp6.Dispose()
Write-Host "Created pov6.png (Full Greeting Card & Wishes)"

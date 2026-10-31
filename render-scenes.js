const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const psScript = `
Add-Type -AssemblyName System.Drawing

function CreateScene1() {
    $bmp = New-Object System.Drawing.Bitmap(1080, 1920)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background: Midnight Christmas gradient
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(1080, 1920)),
        ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)),
        ([System.Drawing.Color]::FromArgb(255, 60, 6, 18))
    )
    $g.FillRectangle($bgBrush, 0, 0, 1080, 1920)

    # Top Header Title
    $fontHead = New-Object System.Drawing.Font("Arial", 42, [System.Drawing.FontStyle]::Bold)
    $fontSub = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Regular)
    $brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 217, 125))
    $brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 20, 28, 40))
    $penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 184, 66), 4)

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Header Box
    $g.FillRectangle($brushDark, 80, 60, 920, 150)
    $g.DrawRectangle($penGold, 80, 60, 920, 150)
    $g.DrawString("BUOC 1: QUET MA QR NOEL 24/11", $fontHead, $brushGold, (New-Object System.Drawing.RectangleF(80, 75, 920, 60)), $sf)
    $g.DrawString("Dung Camera dien thoai hoac Zalo quet ma ben duoi", $fontSub, $brushWhite, (New-Object System.Drawing.RectangleF(80, 140, 920, 50)), $sf)

    # Phone Mockup (x: 160, y: 260, w: 760, h: 1460, rx: 60)
    $phoneBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 10, 14, 20))
    $g.FillRectangle($phoneBrush, 140, 260, 800, 1480)
    $penPhone = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 180, 190, 205), 8)
    $g.DrawRectangle($penPhone, 140, 260, 800, 1480)

    # Phone Screen Inner (Camera View)
    $screenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 24, 30, 42))
    $g.FillRectangle($screenBrush, 160, 340, 760, 1340)

    # Phone Notch / Speaker
    $penSpeaker = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 80, 90, 100), 8)
    $g.DrawLine($penSpeaker, 480, 300, 600, 300)

    # Draw QR Code inside Camera View
    $qrPath = "C:\\Users\\taduc\\.gemini\\antigravity\\scratch\\noel-24-11\\qr-noel-24-11.png"
    if (Test-Path $qrPath) {
        $qrImg = [System.Drawing.Image]::FromFile($qrPath)
        $g.DrawImage($qrImg, 260, 620, 560, 560)
        $qrImg.Dispose()
    }

    # Camera Viewfinder Reticle Corners
    $penReticle = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 217, 125), 6)
    # Top-Left
    $g.DrawLine($penReticle, 240, 600, 320, 600)
    $g.DrawLine($penReticle, 240, 600, 240, 680)
    # Top-Right
    $g.DrawLine($penReticle, 840, 600, 760, 600)
    $g.DrawLine($penReticle, 840, 600, 840, 680)
    # Bottom-Left
    $g.DrawLine($penReticle, 240, 1200, 320, 1200)
    $g.DrawLine($penReticle, 240, 1200, 240, 1120)
    # Bottom-Right
    $g.DrawLine($penReticle, 840, 1200, 760, 1200)
    $g.DrawLine($penReticle, 840, 1200, 840, 1120)

    # Green Laser Scan Line across QR
    $penLaser = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 46, 213, 115), 5)
    $g.DrawLine($penLaser, 250, 900, 830, 900)

    # Notification Pop-up on phone: "Da nhan dien ma QR"
    $notifBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
    $g.FillRectangle($notifBrush, 200, 400, 680, 130)
    $penNotif = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 46, 213, 115), 3)
    $g.DrawRectangle($penNotif, 200, 400, 680, 130)

    $fontNotifHead = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
    $fontNotifUrl = New-Object System.Drawing.Font("Arial", 18, [System.Drawing.FontStyle]::Regular)
    $brushDarkText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 20, 30, 40))
    $brushUrl = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 12, 110, 220))

    $g.DrawString("DA NHAN DIEN LIEN KET GIANG SINH", $fontNotifHead, $brushDarkText, (New-Object System.Drawing.RectangleF(210, 415, 660, 40)), $sf)
    $g.DrawString("taductoi1596-stack.github.io/noel-24-11/", $fontNotifUrl, $brushUrl, (New-Object System.Drawing.RectangleF(210, 465, 660, 40)), $sf)

    # Bottom Prompt
    $fontBottom = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
    $g.FillRectangle($brushDark, 140, 1780, 800, 90)
    $g.DrawRectangle($penGold, 140, 1780, 800, 90)
    $g.DrawString("Cham de mo hop qua Giang Sinh tuong tac!", $fontBottom, $brushGold, (New-Object System.Drawing.RectangleF(140, 1780, 800, 90)), $sf)

    $bmp.Save("C:\\Users\\taduc\\.gemini\\antigravity\\scratch\\noel-24-11\\scene1.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created scene1.png"
}

function CreateScene2() {
    $bmp = New-Object System.Drawing.Bitmap(1080, 1920)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(1080, 1920)),
        ([System.Drawing.Color]::FromArgb(255, 20, 8, 14)),
        ([System.Drawing.Color]::FromArgb(255, 80, 10, 25))
    )
    $g.FillRectangle($bgBrush, 0, 0, 1080, 1920)

    $brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 217, 125))
    $brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 184, 66), 4)
    $brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 25, 12, 18))

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Header Box
    $fontHead = New-Object System.Drawing.Font("Arial", 40, [System.Drawing.FontStyle]::Bold)
    $fontSub = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Regular)
    $g.FillRectangle($brushDark, 80, 60, 920, 160)
    $g.DrawRectangle($penGold, 80, 60, 920, 160)
    $g.DrawString("BUOC 2: TRUY CAP TRANG WEB", $fontHead, $brushGold, (New-Object System.Drawing.RectangleF(80, 75, 920, 60)), $sf)
    $g.DrawString("Giao dien hop qua Giang Sinh 3D Noel 24/11 xuat hien", $fontSub, $brushWhite, (New-Object System.Drawing.RectangleF(80, 145, 920, 50)), $sf)

    # Large 3D Gift Box Center Graphics (y: 350 - 1450)
    $boxRedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 165, 18, 40))
    $g.FillRectangle($boxRedBrush, 240, 650, 600, 600)
    $g.DrawRectangle($penGold, 240, 650, 600, 600)

    # Box Lid
    $lidBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 195, 25, 50))
    $g.FillRectangle($lidBrush, 210, 550, 660, 140)
    $g.DrawRectangle($penGold, 210, 550, 660, 140)

    # Gold Ribbons
    $ribbonBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 217, 125))
    $g.FillRectangle($ribbonBrush, 490, 550, 100, 700) # Vertical
    $g.FillRectangle($ribbonBrush, 240, 900, 600, 100) # Horizontal

    # Big Bow on Lid
    $g.FillEllipse($ribbonBrush, 360, 440, 160, 140)
    $g.FillEllipse($ribbonBrush, 560, 440, 160, 140)
    $g.FillEllipse($ribbonBrush, 480, 480, 120, 100)

    # Tag on box
    $tagBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 248, 230))
    $g.FillRectangle($tagBrush, 650, 700, 220, 120)
    $g.DrawRectangle($penGold, 650, 700, 220, 120)
    $fontTag = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Bold)
    $fontTagDate = New-Object System.Drawing.Font("Arial", 26, [System.Drawing.FontStyle]::Bold)
    $brushTagText = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 130, 15, 30))
    $g.DrawString("To: Nguoi Thuong", $fontTag, $brushTagText, (New-Object System.Drawing.RectangleF(650, 715, 220, 40)), $sf)
    $g.DrawString("Noel 24/11", $fontTagDate, $brushTagText, (New-Object System.Drawing.RectangleF(650, 760, 220, 40)), $sf)

    # Tap Finger Indicator
    $fontTap = New-Object System.Drawing.Font("Arial", 36, [System.Drawing.FontStyle]::Bold)
    $g.FillRectangle($brushDark, 140, 1400, 800, 120)
    $g.DrawRectangle($penGold, 140, 1400, 800, 120)
    $g.DrawString("Cham vao hop qua de mo dieu ky dieu!", $fontTap, $brushGold, (New-Object System.Drawing.RectangleF(140, 1400, 800, 120)), $sf)

    # Bottom URL
    $fontUrl = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("Trang web: https://taductoi1596-stack.github.io/noel-24-11/", $fontUrl, $brushWhite, (New-Object System.Drawing.RectangleF(80, 1780, 920, 60)), $sf)

    $bmp.Save("C:\\Users\\taduc\\.gemini\\antigravity\\scratch\\noel-24-11\\scene2.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created scene2.png"
}

function CreateScene3() {
    $bmp = New-Object System.Drawing.Bitmap(1080, 1920)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(1080, 1920)),
        ([System.Drawing.Color]::FromArgb(255, 10, 25, 18)),
        ([System.Drawing.Color]::FromArgb(255, 50, 8, 16))
    )
    $g.FillRectangle($bgBrush, 0, 0, 1080, 1920)

    $brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 217, 125))
    $brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 184, 66), 4)
    $brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 20, 14, 22))

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Header Box
    $fontHead = New-Object System.Drawing.Font("Arial", 40, [System.Drawing.FontStyle]::Bold)
    $fontSub = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Regular)
    $g.FillRectangle($brushDark, 80, 60, 920, 160)
    $g.DrawRectangle($penGold, 80, 60, 920, 160)
    $g.DrawString("BUOC 3: MO THIEP & LOI CHUC", $fontHead, $brushGold, (New-Object System.Drawing.RectangleF(80, 75, 920, 60)), $sf)
    $g.DrawString("Hop qua bung mo, am nhac reo vang & loi chuc xuat hien", $fontSub, $brushWhite, (New-Object System.Drawing.RectangleF(80, 145, 920, 50)), $sf)

    # Greeting Card Box in Center (x: 100, y: 260, w: 880, h: 1480)
    $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 24, 15, 24))
    $g.FillRectangle($cardBrush, 100, 260, 880, 1480)
    $penCard = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 184, 66), 5)
    $g.DrawRectangle($penCard, 100, 260, 880, 1480)

    # Card Title
    $fontCardTitle = New-Object System.Drawing.Font("Georgia", 60, [System.Drawing.FontStyle]::Bold)
    $fontCardSub = New-Object System.Drawing.Font("Arial", 32, [System.Drawing.FontStyle]::Bold)
    $fontDate = New-Object System.Drawing.Font("Arial", 46, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Merry Christmas", $fontCardTitle, $brushGold, (New-Object System.Drawing.RectangleF(100, 320, 880, 90)), $sf)
    $g.DrawString("GIANG SINH AN LANH", $fontCardSub, $brushWhite, (New-Object System.Drawing.RectangleF(100, 420, 880, 50)), $sf)
    $g.DrawString("NOEL 24 . 11", $fontDate, $brushGold, (New-Object System.Drawing.RectangleF(100, 480, 880, 60)), $sf)

    # Heartfelt Wishes Paragraph
    $fontWish1 = New-Object System.Drawing.Font("Georgia", 32, [System.Drawing.FontStyle]::Italic)
    $fontWish2 = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("Nguyen chuc ban mot mua Giang Sinh am ap,", $fontWish1, $brushWhite, (New-Object System.Drawing.RectangleF(120, 580, 840, 50)), $sf)
    $g.DrawString("an lanh va ngap tran niem vui, hanh phuc!", $fontWish1, $brushGold, (New-Object System.Drawing.RectangleF(120, 640, 840, 50)), $sf)
    $g.DrawString("Dau ngoai troi dong lanh gia, hy vong hoi am tu", $fontWish2, $brushWhite, (New-Object System.Drawing.RectangleF(120, 720, 840, 45)), $sf)
    $g.DrawString("nhung tinh cam chan thanh se luon suoi am trai tim ban.", $fontWish2, $brushWhite, (New-Object System.Drawing.RectangleF(120, 770, 840, 45)), $sf)

    # 3 Lucky Gifts Displayed
    $giftBgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 45, 18, 30))
    $fontGiftBadge = New-Object System.Drawing.Font("Arial", 26, [System.Drawing.FontStyle]::Bold)
    $fontGiftDesc = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Regular)

    # Gift 1: Binh An
    $g.FillRectangle($giftBgBrush, 140, 880, 800, 140)
    $g.DrawRectangle($penGold, 140, 880, 800, 140)
    $g.DrawString("HOP QUA 1: BINH AN & SUC KHOE", $fontGiftBadge, $brushGold, (New-Object System.Drawing.RectangleF(150, 900, 780, 40)), $sf)
    $g.DrawString("365 ngay luon manh khoe, vui tuoi va binh an moi neo duong!", $fontGiftDesc, $brushWhite, (New-Object System.Drawing.RectangleF(150, 950, 780, 50)), $sf)

    # Gift 2: Yeu Thuong
    $g.FillRectangle($giftBgBrush, 140, 1060, 800, 140)
    $g.DrawRectangle($penGold, 140, 1060, 800, 140)
    $g.DrawString("HOP QUA 2: TINH YEU & AM AP", $fontGiftBadge, $brushGold, (New-Object System.Drawing.RectangleF(150, 1080, 780, 40)), $sf)
    $g.DrawString("Luon duoc yeu thuong, tran trong va dong day hanh phuc!", $fontGiftDesc, $brushWhite, (New-Object System.Drawing.RectangleF(150, 1130, 780, 50)), $sf)

    # Gift 3: Thanh Cong
    $g.FillRectangle($giftBgBrush, 140, 1240, 800, 140)
    $g.DrawRectangle($penGold, 140, 1240, 800, 140)
    $g.DrawString("HOP QUA 3: THANH CONG & TAI LOC", $fontGiftBadge, $brushGold, (New-Object System.Drawing.RectangleF(150, 1260, 780, 40)), $sf)
    $g.DrawString("Van su hanh thong, moi du dinh deu dat thanh tuu ruc ro!", $fontGiftDesc, $brushWhite, (New-Object System.Drawing.RectangleF(150, 1310, 780, 50)), $sf)

    # Card Signature
    $fontSign = New-Object System.Drawing.Font("Georgia", 28, [System.Drawing.FontStyle]::Italic)
    $g.DrawString("May your days be merry and bright!", $fontSign, $brushGold, (New-Object System.Drawing.RectangleF(100, 1440, 880, 50)), $sf)
    $g.DrawString("Gui tang: Nguoi Than Yeu cua Ban", $fontSub, $brushWhite, (New-Object System.Drawing.RectangleF(100, 1500, 880, 50)), $sf)

    # Bottom CTA
    $g.FillRectangle($brushDark, 100, 1780, 880, 80)
    $g.DrawRectangle($penGold, 100, 1780, 880, 80)
    $fontCta = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Quet ma de tu minh trai nghiem hop qua 3D nhe!", $fontCta, $brushGold, (New-Object System.Drawing.RectangleF(100, 1780, 880, 80)), $sf)

    $bmp.Save("C:\\Users\\taduc\\.gemini\\antigravity\\scratch\\noel-24-11\\scene3.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created scene3.png"
}

function CreateScene4() {
    $bmp = New-Object System.Drawing.Bitmap(1080, 1920)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0, 0)),
        (New-Object System.Drawing.Point(1080, 1920)),
        ([System.Drawing.Color]::FromArgb(255, 10, 15, 30)),
        ([System.Drawing.Color]::FromArgb(255, 60, 5, 20))
    )
    $g.FillRectangle($bgBrush, 0, 0, 1080, 1920)

    # Draw AI Santa in Center
    $santaPath = "C:\\Users\\taduc\\.gemini\\antigravity\\scratch\\noel-24-11\\ai-santa.jpg"
    if (Test-Path $santaPath) {
        $santaImg = [System.Drawing.Image]::FromFile($santaPath)
        $g.DrawImage($santaImg, 90, 280, 900, 900)
        $santaImg.Dispose()
    }

    $brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 217, 125))
    $brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 184, 66), 5)
    $brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 20, 14, 25))

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Top Header
    $fontHead = New-Object System.Drawing.Font("Arial", 42, [System.Drawing.FontStyle]::Bold)
    $fontDate = New-Object System.Drawing.Font("Arial", 30, [System.Drawing.FontStyle]::Bold)
    $g.FillRectangle($brushDark, 80, 60, 920, 170)
    $g.DrawRectangle($penGold, 80, 60, 920, 170)
    $g.DrawString("ONG GIA NOEL AI PHAT LOI CHUC", $fontHead, $brushGold, (New-Object System.Drawing.RectangleF(80, 80, 920, 60)), $sf)
    $g.DrawString("Dem Giang Sinh Noel 24 . 11", $fontDate, $brushWhite, (New-Object System.Drawing.RectangleF(80, 150, 920, 50)), $sf)

    # Frame around Santa
    $g.DrawRectangle($penGold, 90, 280, 900, 900)

    # Speech Bubble / Lower Message
    $speechBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
    $g.FillRectangle($speechBrush, 90, 1230, 900, 320)
    $g.DrawRectangle($penGold, 90, 1230, 900, 320)

    $fontSpeaker = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
    $fontSpeechText = New-Object System.Drawing.Font("Georgia", 30, [System.Drawing.FontStyle]::Italic)
    $fontSubText = New-Object System.Drawing.Font("Arial", 24, [System.Drawing.FontStyle]::Regular)
    $brushDarkRed = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 140, 15, 30))
    $brushDarkBody = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 35, 45))

    $g.DrawString("HO HO HO! MERRY CHRISTMAS!", $fontSpeaker, $brushDarkRed, (New-Object System.Drawing.RectangleF(100, 1260, 880, 50)), $sf)
    $g.DrawString("Chuc ban mot mua Giang Sinh Noel 24/11", $fontSpeechText, $brushDarkBody, (New-Object System.Drawing.RectangleF(100, 1320, 880, 50)), $sf)
    $g.DrawString("that am ap, an lanh va tran ngap phep mau!", $fontSpeechText, $brushDarkRed, (New-Object System.Drawing.RectangleF(100, 1380, 880, 50)), $sf)
    $g.DrawString("Quet ma QR de mo toan bo hop qua 3D va loi chuc bat ngo!", $fontSubText, $brushDarkBody, (New-Object System.Drawing.RectangleF(100, 1460, 880, 45)), $sf)

    # Small QR Code at bottom center
    $qrPath = "C:\\Users\\taduc\\.gemini\\antigravity\\scratch\\noel-24-11\\qr-noel-24-11.png"
    if (Test-Path $qrPath) {
        $qrImg = [System.Drawing.Image]::FromFile($qrPath)
        $g.DrawImage($qrImg, 430, 1580, 220, 220)
        $qrImg.Dispose()
    }
    $penSmall = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 229, 184, 66), 3)
    $g.DrawRectangle($penSmall, 430, 1580, 220, 220)

    $fontLink = New-Object System.Drawing.Font("Arial", 22, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("taductoi1596-stack.github.io/noel-24-11/", $fontLink, $brushGold, (New-Object System.Drawing.RectangleF(80, 1830, 920, 40)), $sf)

    $bmp.Save("C:\\Users\\taduc\\.gemini\\antigravity\\scratch\\noel-24-11\\scene4.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created scene4.png"
}

CreateScene1
CreateScene2
CreateScene3
CreateScene4
`;

const psPath = path.join(__dirname, 'generate-scenes.ps1');
fs.writeFileSync(psPath, psScript, 'utf8');

console.log('Running PowerShell script to generate video scenes...');
execSync(`powershell -ExecutionPolicy Bypass -File "${psPath}"`, { stdio: 'inherit' });
console.log('Finished generating scenes!');

@echo off
chcp 65001 >nul
echo ========================================================
echo   ĐANG ĐẨY MÃ NGUỒN LÊN GITHUB (noel-24-11)...
echo ========================================================
git push -u origin main
if %errorlevel% equ 0 (
    echo.
    echo [THÀNH CÔNG] Đã đẩy mã nguồn lên GitHub thành công!
    echo Hãy bật GitHub Pages trong Repository Settings ^> Pages để kích hoạt link quét mã QR nhé!
) else (
    echo.
    echo [CHÚ Ý] Nếu báo "Repository not found", bạn chỉ cần tạo repo "noel-24-11" trên GitHub trước:
    echo 1. Mở trình duyệt vào: https://github.com/new
    echo 2. Đặt tên Repository là: noel-24-11
    echo 3. Chọn chế độ Public và bấm "Create repository"
    echo 4. Chạy lại file này (hoặc gõ git push -u origin main) để hoàn tất!
)
pause


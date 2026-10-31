# 🎄 Món Quà Giáng Sinh Noel 24/11 • Interactive Gift & QR Card

Trang web thiệp chúc mừng Giáng Sinh Noel 24/11 tương tác độc đáo, kết hợp hộp quà 3D, hiệu ứng tuyết rơi lấp lánh, âm nhạc Giáng Sinh du dương và mã QR tiện lợi để quét trực tiếp từ điện thoại.

---

## ✨ Tính Năng Nổi Bật

1. **Hộp Quà Giáng Sinh 3D**:
   - Chạm vào hộp quà để mở nơ, bung nắp hộp và kích hoạt lời chúc kỳ diệu.
2. **Âm Nhạc Giáng Sinh Du Dương**:
   - Sử dụng **Web Audio API** tích hợp sẵn (không phụ thuộc vào file nhạc ngoài, không lo lỗi bản quyền hay link hỏng), tự động ngân vang giai điệu *We Wish You a Merry Christmas* như tiếng chuông ngân.
3. **Hiệu Ứng Bầu Trời Sao & Tuyết Rơi**:
   - Canvas mô phỏng bông tuyết lơ lửng trong gió kèm sao băng bay ngang bầu trời.
4. **Cây Thông Noel & Đèn Nhấp Nháy**:
   - Cây thông được trang trí quả châu và chuỗi đèn phát sáng rực rỡ.
5. **3 Hộp Quà May Mắn Tương Tác**:
   - Chạm để khám phá 3 món quà tinh thần: *Bình An*, *Yêu Thương*, và *Thành Công*.
6. **Thả Điều Ước Noel**:
   - Gửi gắm tâm nguyện lên bầu trời sao với hiệu ứng sao băng chớp sáng.
7. **Tùy Biến Lời Chúc Trực Tiếp**:
   - Dễ dàng thay đổi tên người nhận, người gửi hoặc ngày kỷ niệm (24/11, 24/12, 25/12).
8. **Mã QR Đẹp & Tiện Dụng**:
   - Tích hợp công cụ tạo mã QR sắc nét dạng vector SVG và ảnh PNG để in thiệp, dán hộp quà thật hoặc gửi qua tin nhắn Zalo/Facebook.

---

## 🚀 Hướng Dẫn Kích Hoạt GitHub Pages Để Quét Mã QR

Để mã QR có thể quét và mở trang thiệp trực tiếp từ điện thoại ở bất kỳ đâu:

1. **Tạo repository mới trên GitHub**:
   - Truy cập [github.com/new](https://github.com/new).
   - Đặt tên repository là: `noel-24-11`.
   - Chọn chế độ **Public**.
   - Bấm **Create repository**.

2. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Món quà Giáng Sinh Noel 24/11 với mã QR tương tác"
   git branch -M main
   git remote add origin https://github.com/taductoi1596-stack/noel-24-11.git
   git push -u origin main
   ```

3. **Bật GitHub Pages**:
   - Trên GitHub, vào repository `noel-24-11` -> chọn tab **Settings** -> chọn mục **Pages** (ở cột bên trái).
   - Tại mục **Build and deployment** > **Branch**:
     - Chọn nhánh **main** (thư mục `/root`).
     - Bấm **Save**.
   - Chờ khoảng 1-2 phút, GitHub sẽ cung cấp link công khai:
     👉 `https://taductoi1596-stack.github.io/noel-24-11/`

---

## 🛠️ Cách Tạo Lại Mã QR Với Tên Miền / Link Tùy Chỉnh

Nếu bạn sử dụng tên miền riêng hoặc địa chỉ khác, chạy lệnh:

```bash
node generate-qr.js "https://duong-dan-cua-ban.com"
```

Lệnh trên sẽ tự động xuất ra:
- `qr-noel-24-11.svg`: File thiệp QR vector độ phân giải cao cực đẹp để in ấn.
- `qr-preview.html`: Trang xem trước và in thiệp trực tiếp trên trình duyệt.

---

Chúc bạn một mùa Giáng Sinh an lành, ấm áp và hạnh phúc! 🎄⭐✨


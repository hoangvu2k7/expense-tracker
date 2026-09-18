# 💰 FinSmart - Ứng Dụng Quản Lý Chi Tiêu Cá Nhân Thông Minh

Ứng dụng web quản lý tài chính cá nhân toàn diện, hiện đại, hỗ trợ đa ví, ngân sách thông minh, hũ tiết kiệm và báo cáo trực quan.

## ✨ Tính Năng Nổi Bật

- **Ghi chép nhanh**: Thu/Chi/Chuyển khoản chỉ trong vài giây, gợi ý phím tắt số tiền thông minh.
- **Quản lý đa ví & tài khoản**: Ví tiền mặt, MB Bank, Vietcombank, MoMo, VNPay...
- **Chuyển tiền nội bộ**: Chuyển đổi qua lại giữa các ví tự động cập nhật số dư.
- **Cảnh báo thông minh (Smart Insights)**: Phát hiện vượt tốc độ chi tiêu, tính toán số tiền tối đa được tiêu mỗi ngày còn lại trong tháng.
- **Hạn mức ngân sách (Budgets)**: Thanh tiến trình đổi màu trực quan khi chạm 80% hoặc 100%.
- **Hũ tiết kiệm (Savings Goals)**: Theo dõi tiến độ tích lũy, nạp thêm tiền một chạm kèm hiệu ứng pháo hoa ăn mừng khi đạt mục tiêu.
- **Hóa đơn định kỳ (Recurring)**: Quản lý tiền nhà, điện nước, internet, netflix với nút "Thanh toán ngay".
- **Báo cáo biểu đồ (Charts)**: Biểu đồ tròn danh mục, biểu đồ cột so sánh 6 tháng, biểu đồ biến động dòng tiền từng ngày.
- **Xuất dữ liệu**: Xuất báo cáo ra file Excel (.xlsx) hoặc file CSV chuẩn tiếng Việt.

---

## 🛠️ Cài Đặt & Chạy Trên Máy (Local)

```bash
# Cài đặt thư viện
npm install

# Chạy môi trường phát triển
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:5173/`

---

## 🚀 Hướng Dẫn Đưa Lên GitHub & Chạy Online Miễn Phí (GitHub Pages)

Dự án đã được cấu hình sẵn GitHub Actions (`.github/workflows/deploy.yml`). Khi bạn đẩy code lên GitHub, web sẽ tự động được build và host miễn phí:

1. Tạo một repository mới trên GitHub (ví dụ đặt tên là `expense-tracker`).
2. Tải toàn bộ mã nguồn lên repository đó.
3. Vào repository trên GitHub -> Chọn tab **Settings** -> Mục **Pages** (bên trái).
4. Tại phần **Build and deployment -> Source**, chọn **GitHub Actions**.
5. Sau 1-2 phút, GitHub sẽ cung cấp cho bạn một đường link web công khai:
   `https://<tên-tài-khoản-github>.github.io/<tên-repo>/`
6. Bạn có thể mở link này trên điện thoại hoặc máy tính để sử dụng mọi lúc mọi nơi!

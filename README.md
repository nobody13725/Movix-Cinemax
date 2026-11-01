# Movix - Cinemax

Frontend đặt vé xem phim được xây dựng bằng React và Vite.

## Chạy ứng dụng

Cần cài Node.js và npm, sau đó chạy:

```bash
npm install
npm run dev
```

Vite sẽ in URL truy cập trong terminal. Nếu cổng 3000 đang bận, Vite tự chọn cổng khác.

## Build

```bash
npm run build
npm run preview
```

Build được tạo trong `dist/`; đây là thư mục sinh tự động và không cần commit.

## Dữ liệu

Dữ liệu khởi tạo nằm trong `src/data/initialDbData.js`. Bản demo lưu trạng thái cục bộ trong trình duyệt; không cần cấu hình biến môi trường để chạy.

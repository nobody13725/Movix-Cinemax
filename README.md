<<<<<<< HEAD
# Movix — Front-end đặt vé xem phim

Front-end React cho hệ thống đặt vé xem phim Movix, dựng theo đặc tả
usecase và Figma mockup trong tài liệu "Đồ án 01" (Phần 2 & 3).

## Cách xem nhanh (không cần cài đặt)

Mở trực tiếp file `dist/index.html` trong trình duyệt (không cần
server, không cần internet — toàn bộ đã được bundle sẵn).

## Cấu trúc mã nguồn (thư mục `src/`)

```
src/
  main.jsx              # entry point
  App.jsx                # router đơn giản dựa trên state (không dùng react-router)
  styles.css              # toàn bộ design token & style (màu, spacing, component)
  data/mockData.js        # dữ liệu mẫu: phim, rạp, suất chiếu, ghế, combo bắp nước
  components/
    Navbar.jsx
    Footer.jsx
    MovieCard.jsx
    Stepper.jsx
  pages/
    Home.jsx              # trang chủ: hero search, phim đang chiếu, lịch chiếu hôm nay
    Movies.jsx             # danh sách / tìm kiếm phim theo thể loại, từ khoá
    MovieDetail.jsx         # chi tiết phim + đánh giá
    Showtimes.jsx           # lịch chiếu theo ngày / rạp
    Cinemas.jsx             # danh sách rạp
    BookingFlow.jsx         # đặt vé: chọn ghế -> bắp nước -> thanh toán
    BookingSuccess.jsx      # xác nhận đặt vé thành công
    Login.jsx
    Register.jsx            # đăng ký kèm bước xác thực OTP (theo UC01 trong đồ án)
    ForgotPassword.jsx       # quên mật khẩu 3 bước (xác thực -> OTP -> mật khẩu mới)
    Profile.jsx              # thông tin cá nhân + lịch sử đặt vé
```

## Build lại từ mã nguồn

Yêu cầu: Node.js, và `react` + `react-dom` (v19) cài trong `node_modules`.

```bash
esbuild src/main.jsx --bundle --outfile=dist/bundle.js \
  --loader:.js=jsx --jsx=automatic \
  --define:process.env.NODE_ENV='"production"'
```

Lệnh trên xuất luôn `dist/bundle.css` (esbuild tự gom CSS import trong
`main.jsx`) — không cần Tailwind hay bước build riêng cho CSS.

## Kết nối với backend thật

Hiện tại toàn bộ dữ liệu là mock (`src/data/mockData.js`), phù hợp để
demo giao diện độc lập. Để nối với API thật (ví dụ
`POST /api/v1/auth/register` như trong `4.2. Source code` của đồ án):

1. Thay các hàm xử lý form trong `Login.jsx`, `Register.jsx`,
   `ForgotPassword.jsx`, `BookingFlow.jsx` bằng `fetch(...)` gọi tới
   base URL backend (repo `server-movix`).
2. Thay `mockData.js` bằng các lệnh gọi API tương ứng (danh sách phim,
   rạp, suất chiếu, ghế trống theo suất chiếu...).
3. Lưu token đăng nhập (JWT) vào state `App.jsx` (biến `user`) hoặc
   localStorage tuỳ nhu cầu.

## Ghi chú thiết kế

- Bảng màu, bo góc, gradient tím-chàm được lấy theo đúng mockup Figma
  trong tài liệu (thương hiệu "Movix").
- Điều hướng dùng state nội bộ (`route` trong `App.jsx`) thay vì
  react-router, vì môi trường build không có kết nối mạng để cài thêm
  package — khi tách ra dự án Vite/CRA thật, có thể thay bằng
  react-router-dom nếu muốn URL đổi theo từng trang.
=======
# Movix-Cinemax
>>>>>>> 6f170f67eaa2ecb59ea7d0125cf6b0b156e4e04b

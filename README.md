# Cloud Photo Gallery

Ứng dụng web quản lý và xem ảnh từ **Google Drive**, **OneDrive** và **Dropbox** trong một giao diện duy nhất.

## Tính năng

- **Đăng nhập OAuth** — Kết nối tài khoản Google Drive, OneDrive hoặc Dropbox với quyền chỉ đọc
- **Masonry Grid** — Hiển thị ảnh dạng lưới tự động xếp, tối ưu không gian
- **Timeline** — Lọc ảnh theo ngày chụp, nhanh chóng tìm ảnh theo thời gian
- **Lightbox** — Click vào ảnh để xem kích thước đầy đủ, dùng phím ← → để chuyển ảnh, Escape để đóng
- **Phân trang** — Nút "Tải thêm ảnh" để load thêm khi có nhiều ảnh
- **Giao diện tối** — Theme tối hiện đại, tối ưu cho xem ảnh

## Công nghệ

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/) — Xác thực OAuth
- [Zustand](https://zustand-demo.pmnd.rs/) — Quản lý state
- [exifr](https://github.com/MikeKovarik/exifr) — Đọc metadata EXIF

## Cài đặt chạy local

### 1. Cài đặt Node.js

Yêu cầu Node.js >= 18. Tải tại https://nodejs.org

### 2. Clone và cài dependencies

```bash
git clone https://github.com/huyzpka-commits/pka.git
cd pka
npm install
```

### 3. Cấu hình biến môi trường

```bash
copy .env.example .env
```

Điền các giá trị vào file `.env`:

| Biến | Mô tả |
|---|---|
| `NEXTAUTH_URL` | URL ứng dụng, local: `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Chuỗi bí mật ngẫu nhiên (dùng `npx auth secret` để tạo) |
| `GOOGLE_CLIENT_ID` | Client ID từ Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Client Secret từ Google Cloud Console |
| `AZURE_AD_CLIENT_ID` | Client ID từ Azure Portal (OneDrive) |
| `AZURE_AD_CLIENT_SECRET` | Client Secret từ Azure Portal |
| `DROPBOX_CLIENT_ID` | App key từ Dropbox App Console |
| `DROPBOX_CLIENT_SECRET` | App secret từ Dropbox App Console |

### 4. Cấu hình Google OAuth

1. Vào [Google Cloud Console](https://console.cloud.google.com/) → tạo project
2. **APIs & Services** → **Library** → bật **Google Drive API**
3. **APIs & Services** → **Credentials** → **Create OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID và Client Secret vào file `.env`
5. **OAuth consent screen** → thêm test user (nếu ở chế độ Testing)

### 5. Chạy ứng dụng

```bash
npm run dev
```

Mở http://localhost:3000

## Hướng dẫn sử dụng

1. **Trang chủ** — Nhấn "Kết nối cloud" hoặc "Xem demo gallery"
2. **Đăng nhập** — Chọn nhà cung cấp cloud (Google Drive / OneDrive / Dropbox) → đăng nhập bằng tài khoản
3. **Gallery** — Sau khi đăng nhập, ảnh từ cloud sẽ tự động tải và hiển thị
4. **Xem ảnh lớn** — Click vào ảnh nhỏ để mở lightbox xem kích thước đầy đủ
5. **Timeline** — Dùng thanh Timeline bên phải để lọc ảnh theo ngày
6. **Tải thêm** — Nhấn "Tải thêm ảnh" để xem thêm ảnh tiếp theo

## Deploy lên Vercel

1. Push code lên GitHub
2. Vào [Vercel](https://vercel.com) → import repo
3. Thêm Environment Variables (như bảng trên, `NEXTAUTH_URL` = domain Vercel cấp)
4. Nhấn Deploy
5. Thêm redirect URI production vào Google Console: `https://your-domain.vercel.app/api/auth/callback/google`

## Cấu trúc thư mục

```
app/
  api/auth/[...nextauth]/  — NextAuth route handler
  api/photos/               — API lấy ảnh từ cloud
  gallery/                  — Trang gallery chính
  login/                    — Trang đăng nhập
components/
  auth/                     — Nút đăng nhập
  gallery/                  — MasonryGrid, PhotoCard, Lightbox, Timeline
lib/
  auth.ts                   — NextAuth configuration
  cloud-fetch.ts            — Gọi API Google Drive, OneDrive, Dropbox
  exif.ts                   — Đọc EXIF metadata
  image-classifier.ts       — Placeholder AI gán nhãn ảnh
stores/
  photo-store.ts            — Zustand state management
types/
  next-auth.d.ts            — Mở rộng type NextAuth
  photo.ts                  — Type PhotoItem, CloudProvider
```

## License

Private

-- =========================================================
-- MOVIX CINEMAX - SUPABASE DATABASE SCHEMA (POSTGRESQL)
-- Theo đặc tả Đồ án 01 (Trang 88 - 92)
-- =========================================================

-- Bật extension pgcrypto để sinh UUID nếu cần
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BẢNG USERS
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'member', -- 'admin' | 'member'
    token TEXT,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. BẢNG CATEGORIES (Thể loại phim)
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL UNIQUE
);

-- 3. BẢNG CITIES (Thành phố)
CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL UNIQUE
);

-- 4. BẢNG CINEMAS (Rạp chiếu phim)
CREATE TABLE IF NOT EXISTS cinemas (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    avatar TEXT,
    description TEXT,
    city_id TEXT REFERENCES cities(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BẢNG ROOMS (Phòng chiếu)
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    cinema_id TEXT REFERENCES cinemas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    seat_layout JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BẢNG FILMS (Phim)
CREATE TABLE IF NOT EXISTS films (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    other_titles JSONB DEFAULT '[]'::jsonb,
    category_ids JSONB DEFAULT '[]'::jsonb,
    actors JSONB DEFAULT '[]'::jsonb,
    directors JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC DEFAULT 8.0,
    release_date TEXT,
    duration INTEGER NOT NULL,
    age_rating TEXT DEFAULT 'P',
    trailer TEXT,
    thumbnail TEXT,
    language TEXT DEFAULT 'Tiếng Anh - Phụ đề Tiếng Việt',
    subtitles TEXT DEFAULT 'Phụ đề Tiếng Việt',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Đang chiếu', -- 'Đang chiếu' | 'Sắp chiếu'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. BẢNG SHOWTIMES (Suất chiếu)
CREATE TABLE IF NOT EXISTS showtimes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    film_id TEXT REFERENCES films(id) ON DELETE CASCADE,
    cinema_id TEXT REFERENCES cinemas(id) ON DELETE CASCADE,
    room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    base_price NUMERIC NOT NULL DEFAULT 75000,
    seat_types JSONB DEFAULT '{"vip_extra": 20000}'::jsonb,
    seats JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BẢNG COMMENTS (Bình luận & đánh giá)
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    film_id TEXT REFERENCES films(id) ON DELETE CASCADE,
    rate INTEGER NOT NULL CHECK (rate >= 1 AND rate <= 5),
    content TEXT,
    report BOOLEAN NOT NULL DEFAULT FALSE,
    reported_by TEXT,
    report_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. BẢNG PROMOTIONS (Khuyến mãi)
CREATE TABLE IF NOT EXISTS promotions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_percent NUMERIC DEFAULT 0,
    max_discount NUMERIC DEFAULT 0,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    conditions JSONB DEFAULT '{}'::jsonb,
    usage_limit INTEGER DEFAULT 100,
    used_count INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Đang hoạt động', -- 'Đang hoạt động' | 'Hết hạn' | 'Tạm dừng'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. BẢNG COMBOFOODS (Đồ ăn & Combo bắp nước)
CREATE TABLE IF NOT EXISTS combofoods (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    image TEXT,
    price NUMERIC NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'active' -- 'active' | 'inactive'
);

-- 11. BẢNG ORDERS (Đơn đặt vé)
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    showtime_id TEXT REFERENCES showtimes(id) ON DELETE SET NULL,
    seats JSONB NOT NULL DEFAULT '[]'::jsonb,
    combo_foods JSONB DEFAULT '[]'::jsonb,
    seat_subtotal NUMERIC NOT NULL DEFAULT 0,
    combo_subtotal NUMERIC NOT NULL DEFAULT 0,
    promotion_code TEXT,
    discount_amount NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    ticket_code TEXT NOT NULL UNIQUE,
    ticket_qr_url TEXT,
    payment_method TEXT NOT NULL DEFAULT 'PayOS', -- 'PayOS' | 'VietQR' | 'Tiền mặt'
    payment_status TEXT NOT NULL DEFAULT 'paid',  -- 'pending' | 'paid' | 'failed'
    transaction_id TEXT,
    pay_redirect_url TEXT,
    order_status TEXT NOT NULL DEFAULT 'confirmed', -- 'pending' | 'confirmed' | 'cancelled' | 'used' | 'expired'
    redeemed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tắt RLS để truy cập nhanh từ frontend công khai hoặc cấu hình Policy phù hợp
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE cinemas DISABLE ROW LEVEL SECURITY;
ALTER TABLE rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE films DISABLE ROW LEVEL SECURITY;
ALTER TABLE showtimes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE combofoods DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

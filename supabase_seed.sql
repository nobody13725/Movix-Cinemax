-- =========================================================
-- MOVIX CINEMAX - SUPABASE SEED DATA (DỮ LIỆU KHỞI TẠO)
-- Dữ liệu đầy đủ cho 11 bảng chuẩn theo tài liệu Đồ án 01
-- =========================================================

-- 1. CITIES
INSERT INTO cities (id, name) VALUES
('city-1', 'TP. Hồ Chí Minh'),
('city-2', 'Hà Nội'),
('city-3', 'Đà Nẵng'),
('city-4', 'Cần Thơ')
ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIES
INSERT INTO categories (id, title) VALUES
('cat-1', 'Hành động'),
('cat-2', 'Khoa học viễn tưởng'),
('cat-3', 'Kinh dị'),
('cat-4', 'Chính kịch'),
('cat-5', 'Hoạt hình'),
('cat-6', 'Hài')
ON CONFLICT (id) DO NOTHING;

-- 3. CINEMAS
INSERT INTO cinemas (id, name, address, avatar, description, city_id) VALUES
('cin-1', 'CGV Vincom Center Bà Triệu', 'Tầng 6, Vincom Center, 191 Bà Triệu, Q. Hai Bà Trưng', '🏢', 'Cụm rạp hiện đại với phòng chiếu Gold Class và âm thanh Dolby 7.1 sống động.', 'city-2'),
('cin-2', 'Lotte Cinema Landmark', 'Tầng 5 Keangnam Landmark 72, Phạm Hùng, Q. Nam Từ Liêm', '🏢', 'Rạp chiếu phim tiêu chuẩn Hàn Quốc, phòng chiếu Prestige sang trọng.', 'city-2'),
('cin-3', 'Beta Cinema Quang Trung', '645 Quang Trung, Phường 11, Q. Gò Vấp', '🏢', 'Rạp chiếu trẻ trung, giá vé sinh viên, không gian check-in tuyệt đẹp.', 'city-1'),
('cin-4', 'Galaxy Cinema Nguyễn Du', '116 Nguyễn Du, Phường Bến Thành, Quận 1', '🏢', 'Một trong những cụm rạp trung tâm sôi động nhất Sài Gòn.', 'city-1'),
('cin-5', 'BHD Star Vincom Mega Mall Thảo Điền', 'Tầng 5 Vincom Thảo Điền, TP. Thủ Đức', '🏢', 'Trải nghiệm xem phim gia đình ấm cúng và chất lượng cao.', 'city-1')
ON CONFLICT (id) DO NOTHING;

-- 4. ROOMS
INSERT INTO rooms (id, cinema_id, name, seat_layout) VALUES
('room-1', 'cin-1', 'Phòng 1 (Standard 2D)', '[{"row": "A", "count": 12}, {"row": "B", "count": 12}, {"row": "C", "count": 12}, {"row": "D", "count": 12}, {"row": "E", "count": 12}, {"row": "F", "count": 12}, {"row": "G", "count": 12}, {"row": "H", "count": 12, "vip": true}, {"row": "I", "count": 12, "vip": true}]'::jsonb),
('room-2', 'cin-1', 'Phòng 2 (IMAX Laser)', '[{"row": "A", "count": 14}, {"row": "B", "count": 14}, {"row": "C", "count": 14}, {"row": "D", "count": 14}, {"row": "E", "count": 14}, {"row": "F", "count": 14}, {"row": "G", "count": 14, "vip": true}, {"row": "H", "count": 14, "vip": true}]'::jsonb),
('room-3', 'cin-2', 'Phòng 1 (Gold Class)', '[{"row": "A", "count": 10}, {"row": "B", "count": 10}, {"row": "C", "count": 10}, {"row": "D", "count": 10}, {"row": "E", "count": 10, "vip": true}]'::jsonb),
('room-4', 'cin-3', 'Phòng 1 (Standard)', '[{"row": "A", "count": 12}, {"row": "B", "count": 12}, {"row": "C", "count": 12}, {"row": "D", "count": 12}, {"row": "E", "count": 12}, {"row": "F", "count": 12}, {"row": "G", "count": 12}, {"row": "H", "count": 12, "vip": true}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 5. FILMS
INSERT INTO films (id, title, other_titles, category_ids, actors, directors, rating, release_date, duration, age_rating, trailer, thumbnail, language, subtitles, description, status) VALUES
('film-1', 'Avatar: The Way of Water', '["Avatar 2", "Dòng Chảy Của Nước"]'::jsonb, '["cat-2", "cat-1"]'::jsonb, '["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"]'::jsonb, '["James Cameron"]'::jsonb, 8.6, '2026-08-20', 192, 'T13', 'https://www.youtube.com/embed/d9MyW72ELq0', '🌊', 'Tiếng Anh', 'Phụ đề Tiếng Việt', 'Jake Sully và Neytiri đã lập gia đình và làm mọi cách để gắn kết bên nhau. Tuy nhiên, họ phải rời khỏi ngôi nhà của mình và khám phá các vùng đất khác nhau trên hành tinh Pandora khi một mối đe dọa cổ xưa xuất hiện.', 'Đang chiếu'),
('film-2', 'Black Panther: Wakanda Forever', '["Chiến Binh Báo Đen 2"]'::jsonb, '["cat-1", "cat-2"]'::jsonb, '["Letitia Wright", "Lupita Nyong''o", "Danai Gurira"]'::jsonb, '["Ryan Coogler"]'::jsonb, 9.1, '2026-08-25', 161, 'T13', 'https://www.youtube.com/embed/_Z3QKfv30tU', '🐆', 'Tiếng Anh', 'Phụ đề Tiếng Việt', 'Nữ hoàng Ramonda, Shuri, M''Baku, Okoye và Dora Milaje chiến đấu để bảo vệ quốc gia của họ khỏi sự can thiệp của các cường quốc thế giới sau cái chết của Vua T''Challa.', 'Đang chiếu'),
('film-3', 'Top Gun: Maverick', '["Phi Công Siêu Đẳng"]'::jsonb, '["cat-1", "cat-4"]'::jsonb, '["Tom Cruise", "Miles Teller", "Jennifer Connelly"]'::jsonb, '["Joseph Kosinski"]'::jsonb, 8.8, '2026-08-15', 130, 'T13', 'https://www.youtube.com/embed/giXco2nxYKg', '✈️', 'Tiếng Anh', 'Phụ đề Tiếng Việt', 'Sau hơn ba mươi năm phục vụ với tư cách là một trong những phi công hàng đầu của Hải quân, Pete "Maverick" Mitchell đang ở nơi anh thuộc về, thúc đẩy bản thân với tư cách là một phi công dũng cảm.', 'Đang chiếu'),
('film-4', 'The Menu', '["Thực Đơn Bí Ẩn"]'::jsonb, '["cat-3", "cat-6"]'::jsonb, '["Ralph Fiennes", "Anya Taylor-Joy", "Nicholas Hoult"]'::jsonb, '["Mark Mylod"]'::jsonb, 7.9, '2026-09-01', 107, 'T18', 'https://www.youtube.com/embed/C_uTkUGcHv4', '🍽️', 'Tiếng Anh', 'Phụ đề Tiếng Việt', 'Một cặp đôi trẻ du hành đến một hòn đảo xa xôi để dùng bữa tại một nhà hàng độc quyền, nơi đầu bếp đã chuẩn bị một thực đơn xa hoa kèm theo một số bất ngờ gây sốc.', 'Đang chiếu'),
('film-5', 'Spider-Man: No Way Home', '["Người Nhện Không Còn Nhà"]'::jsonb, '["cat-1", "cat-2"]'::jsonb, '["Tom Holland", "Zendaya", "Benedict Cumberbatch"]'::jsonb, '["Jon Watts"]'::jsonb, 9.0, '2026-09-15', 148, 'T13', 'https://www.youtube.com/embed/JfVOs4VSpmA', '🕷️', 'Tiếng Anh', 'Phụ đề Tiếng Việt', 'Với danh tính của Người Nhện bị tiết lộ, Peter nhờ Doctor Strange giúp đỡ. Khi một câu thần chú bị sai lầm, những kẻ thù nguy hiểm từ các thế giới khác bắt đầu xuất hiện.', 'Sắp chiếu'),
('film-6', 'Puss in Boots: The Last Wish', '["Mèo Đi Hia: Điều Ước Cuối Cùng"]'::jsonb, '["cat-5", "cat-6"]'::jsonb, '["Antonio Banderas", "Salma Hayek", "Harvey Guillén"]'::jsonb, '["Joel Crawford"]'::jsonb, 8.7, '2026-09-10', 102, 'P', 'https://www.youtube.com/embed/RqrXhwS33yc', '🐱', 'Tiếng Anh', 'Lồng tiếng & Phụ đề', 'Puss in Boots phát hiện ra rằng niềm đam mê phiêu lưu của mình đã cướp đi 8 trong số 9 mạng sống của anh. Anh bắt đầu một hành trình hoành tráng để tìm Điều ước Cuối cùng.', 'Đang chiếu')
ON CONFLICT (id) DO NOTHING;

-- 6. USERS
INSERT INTO users (id, username, full_name, email, password, phone, address, avatar, role) VALUES
('usr-admin', 'admin', 'Quản Trị Viên Movix', 'admin@movix.vn', 'admin123', '0912345678', 'Hà Nội', '👨‍💼', 'admin'),
('usr-1', 'thangnguyen', 'Nguyễn Toàn Thắng', 'thangnguyen13725@gmail.com', '123456', '0987654321', 'TP. Hồ Chí Minh', '🧑‍💻', 'member'),
('usr-2', 'mahiru', 'Mahiru Shiina', 'mahiru@movix.vn', '123456', '0901112233', 'TP. Hồ Chí Minh', '🌸', 'member'),
('usr-3', 'minhanh', 'Trần Minh Anh', 'minhanh@gmail.com', '123456', '0933445566', 'Đà Nẵng', '👩', 'member')
ON CONFLICT (id) DO NOTHING;

-- 7. COMBOFOODS
INSERT INTO combofoods (id, name, image, price, description, status) VALUES
('cb-1', 'Combo Bắp Rang Bơ (L) + 2 Coca (L)', '🍿', 89000, '1 bắp lớn vị ngọt/mặn truyền thống kèm 2 nước ngọt 32oz', 'active'),
('cb-2', 'Combo Đôi Tiết Kiệm (Couple Box)', '🥤', 109000, '1 bắp khổng lồ mix 2 vị, 2 nước lớn + snack khoai tây', 'active'),
('cb-3', 'Bắp Phô Mai Đặc Biệt (M)', '🧀', 55000, 'Bắp rang bơ lắc bột phô mai béo ngậy thơm lừng', 'active'),
('cb-4', 'Snack Nachos Giòn Tan', '🌽', 62000, 'Bánh ngô nướng Nachos kèm chén sốt phô mai sốt salsa cay', 'active')
ON CONFLICT (id) DO NOTHING;

-- 8. PROMOTIONS
INSERT INTO promotions (id, code, description, discount_percent, max_discount, start_date, end_date, conditions, usage_limit, used_count, status) VALUES
('pr-1', 'MOVIX50', 'Giảm 50% cho thành viên mới (tối đa 50k)', 50, 50000, '2026-08-01', '2026-12-31', '{"min_amount": 100000}'::jsonb, 500, 142, 'Đang hoạt động'),
('pr-2', 'CHAOMOI', 'Giảm 25.000đ cho đơn từ 120.000đ', 20, 25000, '2026-08-15', '2026-11-30', '{"min_amount": 120000}'::jsonb, 1000, 680, 'Đang hoạt động'),
('pr-3', 'VIPMEMBER', 'Ưu đãi hạng thẻ VIP giảm 15% tổng hóa đơn', 15, 60000, '2026-01-01', '2026-12-31', '{}'::jsonb, 2000, 1250, 'Đang hoạt động'),
('pr-4', 'SUMMER2026', 'Khuyến mãi mùa hè rực rỡ', 30, 40000, '2026-05-01', '2026-07-31', '{}'::jsonb, 300, 300, 'Hết hạn')
ON CONFLICT (id) DO NOTHING;

-- 9. SHOWTIMES
INSERT INTO showtimes (id, film_id, cinema_id, room_id, start_time, end_time, base_price, seat_types, seats) VALUES
('st-1', 'film-1', 'cin-1', 'room-1', NOW() + INTERVAL '2 hours', NOW() + INTERVAL '5 hours 12 minutes', 85000, '{"vip": 20000}'::jsonb, '["B3", "B4", "B9", "E4", "E5", "E6"]'::jsonb),
('st-2', 'film-1', 'cin-1', 'room-2', NOW() + INTERVAL '6 hours', NOW() + INTERVAL '9 hours 12 minutes', 110000, '{"vip": 30000}'::jsonb, '["C5", "C6", "H7"]'::jsonb),
('st-3', 'film-2', 'cin-1', 'room-1', NOW() + INTERVAL '1 day 3 hours', NOW() + INTERVAL '1 day 5 hours 40 minutes', 85000, '{"vip": 20000}'::jsonb, '["D4", "D5"]'::jsonb),
('st-4', 'film-3', 'cin-2', 'room-3', NOW() + INTERVAL '4 hours', NOW() + INTERVAL '6 hours 10 minutes', 90000, '{"vip": 25000}'::jsonb, '["A1", "A2"]'::jsonb),
('st-5', 'film-6', 'cin-3', 'room-4', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '4 hours 42 minutes', 75000, '{"vip": 20000}'::jsonb, '["F5", "F6", "G7"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 10. COMMENTS
INSERT INTO comments (id, user_id, film_id, rate, content, report, reported_by, report_reason) VALUES
('cm-1', 'usr-1', 'film-1', 5, 'Kỹ xảo 3D trên màn hình IMAX đỉnh chóp luôn! Âm thanh đại dương bao la sống động.', FALSE, NULL, NULL),
('cm-2', 'usr-3', 'film-2', 5, 'Đoạn tưởng nhớ T''Challa đầy xúc động, nhạc phim quá xuất sắc.', FALSE, NULL, NULL),
('cm-3', 'usr-2', 'film-4', 4, 'Cốt truyện châm biếm sâu cay và bất ngờ đến phút chót. Rất đáng xem!', FALSE, NULL, NULL),
('cm-4', 'usr-3', 'film-1', 1, 'Phim này dở tệ, diễn viên diễn đơ như cây gỗ, phí tiền xem!', TRUE, 'usr-1', 'Ngôn từ công kích thô tục và spam đánh giá tiêu cực vô căn cứ.')
ON CONFLICT (id) DO NOTHING;

-- 11. ORDERS
INSERT INTO orders (id, user_id, showtime_id, seats, combo_foods, seat_subtotal, combo_subtotal, promotion_code, discount_amount, total_amount, ticket_code, ticket_qr_url, payment_method, payment_status, order_status) VALUES
('ord-1', 'usr-1', 'st-1', '[{"seatKey": "H5", "type": "vip", "unitPrice": 105000}, {"seatKey": "H6", "type": "vip", "unitPrice": 105000}]'::jsonb, '[{"comboId": "cb-1", "name": "Combo Bắp Rang Bơ (L) + 2 Coca (L)", "quantity": 1, "price": 89000}]'::jsonb, 210000, 89000, 'CHAOMOI', 25000, 274000, 'MVX-92813', 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MVX-92813', 'PayOS', 'paid', 'confirmed'),
('ord-2', 'usr-2', 'st-4', '[{"seatKey": "D4", "type": "standard", "unitPrice": 90000}, {"seatKey": "D5", "type": "standard", "unitPrice": 90000}]'::jsonb, '[]'::jsonb, 180000, 0, NULL, 0, 180000, 'MVX-64019', 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MVX-64019', 'VietQR', 'paid', 'used'),
('ord-3', 'usr-3', 'st-5', '[{"seatKey": "B3", "type": "standard", "unitPrice": 75000}]'::jsonb, '[{"comboId": "cb-3", "name": "Bắp Phô Mai (M)", "quantity": 1, "price": 55000}]'::jsonb, 75000, 55000, NULL, 0, 130000, 'MVX-11204', 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MVX-11204', 'Tiền mặt', 'paid', 'cancelled')
ON CONFLICT (id) DO NOTHING;

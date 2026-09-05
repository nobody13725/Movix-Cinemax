// Dữ liệu khởi tạo cho 11 bảng chuẩn theo đặc tả Đồ án 01 - Đa dạng thể loại & Hình ảnh sắc nét thực tế
export const INITIAL_CITIES = [
  { id: "city-1", name: "TP. Hồ Chí Minh" },
  { id: "city-2", name: "Hà Nội" },
  { id: "city-3", name: "Đà Nẵng" },
  { id: "city-4", name: "Cần Thơ" },
  { id: "city-5", name: "Hải Phòng" }
];

export const INITIAL_CATEGORIES = [
  { id: "cat-1", title: "Hành động" },
  { id: "cat-2", title: "Khoa học viễn tưởng" },
  { id: "cat-3", title: "Kinh dị & Bí ẩn" },
  { id: "cat-4", title: "Chính kịch & Tâm lý" },
  { id: "cat-5", title: "Hoạt hình & Anime" },
  { id: "cat-6", title: "Hài hước" },
  { id: "cat-7", title: "Gia đình & Tình cảm" }
];

export const INITIAL_CINEMAS = [
  {
    id: "cin-1",
    name: "CGV Vincom Center Bà Triệu",
    address: "191 Bà Triệu, Q. Hai Bà Trưng, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    cityId: "city-2",
    description: "Cụm rạp hiện đại với phòng chiếu Gold Class sang trọng và âm thanh vòm Dolby Atmos 7.1 đỉnh cao."
  },
  {
    id: "cin-2",
    name: "Lotte Cinema Landmark 72",
    address: "Tầng 5 Keangnam Landmark 72, Nam Từ Liêm, Hà Nội",
    avatar: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    cityId: "city-2",
    description: "Rạp chiếu chuẩn quốc tế với phòng chiếu Prestige, ghế da ngả 180 độ và quầy lounge phục vụ tận nơi."
  },
  {
    id: "cin-3",
    name: "Beta Cinema Quang Trung",
    address: "645 Quang Trung, P.11, Q. Gò Vấp, TP. Hồ Chí Minh",
    avatar: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    cityId: "city-1",
    description: "Rạp chiếu phong cách trẻ trung năng động, thiết kế nghệ thuật rực rỡ, giá vé cực kỳ ưu đãi cho HSSV."
  },
  {
    id: "cin-4",
    name: "Galaxy Cinema Nguyễn Du",
    address: "116 Nguyễn Du, P. Bến Thành, Quận 1, TP. Hồ Chí Minh",
    avatar: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    cityId: "city-1",
    description: "Địa điểm quen thuộc tại trung tâm Sài Gòn, nhiều suất chiếu muộn và màn chiếu siêu sáng Starium."
  },
  {
    id: "cin-5",
    name: "BHD Star Vincom Thảo Điền",
    address: "Tầng 5 Vincom Mega Mall Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh",
    avatar: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    cityId: "city-1",
    description: "Không gian sang trọng chuẩn First Class, ghế bọc nhung êm ái và sảnh chờ tách biệt đẳng cấp."
  },
  {
    id: "cin-6",
    name: "CGV Vincom Plaza Đà Nẵng",
    address: "Tầng 4 Vincom Plaza, 910A Ngô Quyền, Sơn Trà, Đà Nẵng",
    avatar: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    cityId: "city-3",
    description: "Cụm rạp lớn nhất miền Trung với phòng chiếu Sweetbox lãng mạn và màn chiếu cong hiện đại bậc nhất."
  },
  {
    id: "cin-7",
    name: "Lotte Cinema Ninh Kiều Cần Thơ",
    address: "Tầng 3 Lotte Mart Cần Thơ, 84 Mậu Thân, An Hòa, Cần Thơ",
    avatar: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    cityId: "city-4",
    description: "Rạp chiếu quốc tế lớn nhất Tây Đô với không gian rộng rãi, trang thiết bị nhập khẩu từ Hàn Quốc."
  }
];

export const INITIAL_ROOMS = [
  {
    id: "room-1",
    cinemaId: "cin-1",
    name: "Phòng 1 (Standard 2D)",
    seatLayout: [
      { row: "A", count: 12 },
      { row: "B", count: 12 },
      { row: "C", count: 12 },
      { row: "D", count: 12 },
      { row: "E", count: 12 },
      { row: "F", count: 12 },
      { row: "G", count: 12 },
      { row: "H", count: 12, vip: true },
      { row: "I", count: 12, vip: true }
    ]
  },
  {
    id: "room-2",
    cinemaId: "cin-1",
    name: "Phòng 2 (IMAX Laser)",
    seatLayout: [
      { row: "A", count: 14 },
      { row: "B", count: 14 },
      { row: "C", count: 14 },
      { row: "D", count: 14 },
      { row: "E", count: 14 },
      { row: "F", count: 14 },
      { row: "G", count: 14, vip: true },
      { row: "H", count: 14, vip: true }
    ]
  },
  {
    id: "room-3",
    cinemaId: "cin-2",
    name: "Phòng 1 (Gold Class VIP)",
    seatLayout: [
      { row: "A", count: 10 },
      { row: "B", count: 10 },
      { row: "C", count: 10 },
      { row: "D", count: 10 },
      { row: "E", count: 10, vip: true }
    ]
  },
  {
    id: "room-4",
    cinemaId: "cin-3",
    name: "Phòng 1 (Standard)",
    seatLayout: [
      { row: "A", count: 12 },
      { row: "B", count: 12 },
      { row: "C", count: 12 },
      { row: "D", count: 12 },
      { row: "E", count: 12 },
      { row: "F", count: 12 },
      { row: "G", count: 12 },
      { row: "H", count: 12, vip: true }
    ]
  },
  {
    id: "room-5",
    cinemaId: "cin-4",
    name: "Phòng 1 (Dolby Atmos)",
    seatLayout: [
      { row: "A", count: 12 },
      { row: "B", count: 12 },
      { row: "C", count: 12 },
      { row: "D", count: 12 },
      { row: "E", count: 12 },
      { row: "F", count: 12 },
      { row: "G", count: 12, vip: true },
      { row: "H", count: 12, vip: true }
    ]
  },
  {
    id: "room-6",
    cinemaId: "cin-6",
    name: "Phòng 1 (ScreenX 270°)",
    seatLayout: [
      { row: "A", count: 12 },
      { row: "B", count: 12 },
      { row: "C", count: 12 },
      { row: "D", count: 12 },
      { row: "E", count: 12 },
      { row: "F", count: 12, vip: true },
      { row: "G", count: 12, vip: true }
    ]
  },
  {
    id: "room-5a",
    cinemaId: "cin-5",
    name: "Phòng 1 (First Class VIP)",
    seatLayout: [
      { row: "A", count: 10 },
      { row: "B", count: 10 },
      { row: "C", count: 10 },
      { row: "D", count: 10, vip: true },
      { row: "E", count: 10, vip: true }
    ]
  },
  {
    id: "room-7",
    cinemaId: "cin-7",
    name: "Phòng 1 (Standard 2D Laser)",
    seatLayout: [
      { row: "A", count: 12 },
      { row: "B", count: 12 },
      { row: "C", count: 12 },
      { row: "D", count: 12 },
      { row: "E", count: 12 },
      { row: "F", count: 12, vip: true },
      { row: "G", count: 12, vip: true }
    ]
  }
];

export const INITIAL_FILMS = [
  {
    id: "film-1",
    title: "Avatar: The Way of Water",
    otherTitles: ["Avatar 2", "Dòng Chảy Của Nước"],
    categoryIds: ["cat-2", "cat-1"],
    actors: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
    directors: ["James Cameron"],
    rating: 8.8,
    releaseDate: "2026-08-20",
    duration: 192,
    ageRating: "T13",
    trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    format: "3D, IMAX Laser, 2D",
    language: "Tiếng Anh",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Jake Sully và Neytiri cùng các con khám phá các rạn san hô kỳ vĩ trên Pandora và chiến đấu quả cảm để bảo vệ gia đình trước cuộc xâm lăng của loài người.",
    status: "Đang chiếu"
  },
  {
    id: "film-2",
    title: "Dune: Part Two",
    otherTitles: ["Hành Tinh Cát: Phần Hai"],
    categoryIds: ["cat-2", "cat-1", "cat-4"],
    actors: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler"],
    directors: ["Denis Villeneuve"],
    rating: 9.1,
    releaseDate: "2026-08-25",
    duration: 166,
    ageRating: "T16",
    trailer: "https://www.youtube.com/embed/Way9Dexny3w",
    thumbnail: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    format: "IMAX Laser, 2D Digital",
    language: "Tiếng Anh",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Paul Atreides hợp lực cùng Chani và tộc người Fremen thực hiện cuộc trả thù chống lại những kẻ đã hủy diệt gia tộc mình, quyết định vận mệnh của toàn vũ trụ.",
    status: "Đang chiếu"
  },
  {
    id: "film-3",
    title: "Deadpool & Wolverine",
    otherTitles: ["Deadpool Và Wolverine"],
    categoryIds: ["cat-1", "cat-6", "cat-2"],
    actors: ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"],
    directors: ["Shawn Levy"],
    rating: 8.9,
    releaseDate: "2026-08-15",
    duration: 128,
    ageRating: "T18",
    trailer: "https://www.youtube.com/embed/73_1biulkYk",
    thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    format: "2D, IMAX 3D, 4DX",
    language: "Tiếng Anh",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Deadpool buộc phải tái xuất giang hồ và tìm kiếm sự hỗ trợ từ một Wolverine đang suy sụp để bảo vệ dòng thời gian và vũ trụ của mình.",
    status: "Đang chiếu"
  },
  {
    id: "film-4",
    title: "Spider-Man: Across the Spider-Verse",
    otherTitles: ["Người Nhện: Du Hành Vũ Trụ Nhện"],
    categoryIds: ["cat-5", "cat-1", "cat-2"],
    actors: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac"],
    directors: ["Joaquim Dos Santos", "Kemp Powers"],
    rating: 9.2,
    releaseDate: "2026-09-01",
    duration: 140,
    ageRating: "P",
    trailer: "https://www.youtube.com/embed/cqGjhVJWtEg",
    thumbnail: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    format: "2D Lồng tiếng, 2D Phụ đề",
    language: "Tiếng Anh / Lồng tiếng Việt",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Miles Morales phóng qua đa vũ trụ, chạm trán với một Quân đoàn Người Nhện chịu trách nhiệm bảo vệ sự tồn vong của các thực tại song song.",
    status: "Đang chiếu"
  },
  {
    id: "film-5",
    title: "Lật Mặt 7: Một Điều Ước",
    otherTitles: ["Face Off 7: One Wish"],
    categoryIds: ["cat-7", "cat-4", "cat-6"],
    actors: ["Thanh Hiền", "Trương Minh Cường", "Đinh Y Nhung", "Quách Ngọc Tuyên"],
    directors: ["Lý Hải"],
    rating: 9.3,
    releaseDate: "2026-08-10",
    duration: 138,
    ageRating: "P",
    trailer: "https://www.youtube.com/embed/yV4J46r93j8",
    thumbnail: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    format: "2D Digital",
    language: "Tiếng Việt",
    subtitles: "Phụ đề Tiếng Anh",
    description: "Bộ phim cảm động về tình mẫu tử thiêng liêng của bà Hai và năm người con, chạm đến trái tim của hàng triệu khán giả Việt với thông điệp sum vầy gia đình.",
    status: "Đang chiếu"
  },
  {
    id: "film-6",
    title: "Mai (Trấn Thành)",
    otherTitles: ["Mai - A Story of Love & Healing"],
    categoryIds: ["cat-4", "cat-7"],
    actors: ["Phương Anh Đào", "Tuấn Trần", "Hồng Đào", "Trấn Thành"],
    directors: ["Trấn Thành"],
    rating: 9.0,
    releaseDate: "2026-08-05",
    duration: 131,
    ageRating: "T18",
    trailer: "https://www.youtube.com/embed/3aGZk_sE3bA",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
    format: "2D Digital",
    language: "Tiếng Việt",
    subtitles: "Phụ đề Tiếng Anh",
    description: "Câu chuyện tình yêu đầy trắc trở giữa Mai - một phụ nữ làm nghề massage trị liệu chịu nhiều định kiến, và Dương - chàng nhạc công lãng tử trẻ tuổi.",
    status: "Đang chiếu"
  },
  {
    id: "film-7",
    title: "Oppenheimer",
    otherTitles: ["Cha Đẻ Bom Nguyên Tử"],
    categoryIds: ["cat-4", "cat-1"],
    actors: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    directors: ["Christopher Nolan"],
    rating: 9.3,
    releaseDate: "2026-08-01",
    duration: 180,
    ageRating: "T18",
    trailer: "https://www.youtube.com/embed/uYPbbksJxIg",
    thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    format: "IMAX Laser, 2D Digital",
    language: "Tiếng Anh",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Thiên sử thi về nhà vật lý học lý thuyết J. Robert Oppenheimer, người lãnh đạo dự án Manhattan chế tạo vũ khí hạt nhân làm thay đổi lịch sử nhân loại.",
    status: "Đang chiếu"
  },
  {
    id: "film-8",
    title: "Inside Out 2",
    otherTitles: ["Những Mảnh Ghép Cảm Xúc 2"],
    categoryIds: ["cat-5", "cat-6", "cat-7"],
    actors: ["Amy Poehler", "Maya Hawke", "Kensington Tallman"],
    directors: ["Kelsey Mann"],
    rating: 8.9,
    releaseDate: "2026-09-02",
    duration: 96,
    ageRating: "P",
    trailer: "https://www.youtube.com/embed/LEjhY15eCx0",
    thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    format: "2D Lồng tiếng, 3D",
    language: "Tiếng Anh / Lồng tiếng Việt",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Bộ chỉ huy tâm trí của cô bé Riley bỗng xáo trộn dữ dội khi bước vào tuổi dậy thì với sự xuất hiện bất ngờ của những cảm xúc mới: Lo Âu, Ganh Tị, Xấu Hổ và Chán Nản.",
    status: "Đang chiếu"
  },
  {
    id: "film-9",
    title: "Godzilla x Kong: The New Empire",
    otherTitles: ["Godzilla Và Kong: Đế Chế Mới"],
    categoryIds: ["cat-1", "cat-2"],
    actors: ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens"],
    directors: ["Adam Wingard"],
    rating: 8.5,
    releaseDate: "2026-09-15",
    duration: 115,
    ageRating: "T13",
    trailer: "https://www.youtube.com/embed/lV1OOlGwExM",
    thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    format: "3D, IMAX, 4DX",
    language: "Tiếng Anh",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Hai đại quái thú huyền thoại Godzilla và Kong phải gạt bỏ hiềm khích để cùng hợp lực chống lại một mối đe dọa khổng lồ ẩn sâu trong Trái Đất Rỗng.",
    status: "Sắp chiếu"
  },
  {
    id: "film-10",
    title: "Exhuma: Quật Mộ Trùng Ma",
    otherTitles: ["Quật Mộ Trùng Ma - Bí Ẩn Mộ Cổ"],
    categoryIds: ["cat-3", "cat-4"],
    actors: ["Choi Min-sik", "Kim Go-eun", "Lee Do-hyun", "Yoo Hae-jin"],
    directors: ["Jang Jae-hyun"],
    rating: 8.7,
    releaseDate: "2026-09-18",
    duration: 134,
    ageRating: "T18",
    trailer: "https://www.youtube.com/embed/wXU3q8d1b1k",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    format: "2D Digital",
    language: "Tiếng Hàn",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Bộ đôi pháp sư và thầy phong thủy nhận lời khai quật một ngôi mộ cổ kỳ quái trên đỉnh núi hoang vu, vô tình giải thoát một thế lực ma quỷ tàn độc.",
    status: "Sắp chiếu"
  },
  {
    id: "film-11",
    title: "Detective Conan: The Million-dollar Pentagram",
    otherTitles: ["Thám Tử Lừng Danh Conan: Ngôi Sao 5 Cánh 1 Triệu Đô"],
    categoryIds: ["cat-5", "cat-1", "cat-3"],
    actors: ["Minami Takayama", "Wakana Yamazaki", "Rikiya Koyama"],
    directors: ["Chika Nagaoka"],
    rating: 9.0,
    releaseDate: "2026-09-22",
    duration: 110,
    ageRating: "P",
    trailer: "https://www.youtube.com/embed/8vB1C9Xf0-g",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    format: "2D Lồng tiếng, 2D Phụ đề",
    language: "Tiếng Nhật / Lồng tiếng Việt",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Cuộc đối đầu kịch tính giữa Siêu đạo chích Kid và Kiếm sĩ Hattori Heiji tại Hakodate xoay quanh thanh kiếm Nhật cổ cất giấu kho báu triệu đô thời Edo.",
    status: "Sắp chiếu"
  },
  {
    id: "film-12",
    title: "The Wild Robot",
    otherTitles: ["Robot Hoang Dã"],
    categoryIds: ["cat-5", "cat-7", "cat-2"],
    actors: ["Lupita Nyong'o", "Pedro Pascal", "Kit Connor", "Bill Nighy"],
    directors: ["Chris Sanders"],
    rating: 9.4,
    releaseDate: "2026-09-25",
    duration: 102,
    ageRating: "P",
    trailer: "https://www.youtube.com/embed/67vbA5ZJdKQ",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    posterUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    format: "2D Lồng tiếng, 3D",
    language: "Tiếng Anh / Lồng tiếng Việt",
    subtitles: "Phụ đề Tiếng Việt",
    description: "Tác phẩm hoạt hình cảm động nhất năm của DreamWorks kể về robot Roz bị đắm tàu dạt vào hòn đảo hoang, học cách hòa nhập và nuôi nấng một chú ngỗng non côi cút.",
    status: "Sắp chiếu"
  }
];

export const INITIAL_USERS = [
  {
    id: "usr-admin-01",
    fullName: "Quản trị viên Movix",
    username: "admin",
    email: "admin@movix.vn",
    phone: "0988888888",
    role: "admin",
    password: "123",
    status: "active",
    point: 9999,
    tier: "Kim Cương"
  },
  {
    id: "usr-1",
    fullName: "Nguyễn Toàn Thắng",
    username: "thangnguyen",
    email: "thangnguyen13725@gmail.com",
    phone: "0987654321",
    role: "customer",
    password: "123",
    status: "active",
    point: 450,
    tier: "Vàng"
  },
  {
    id: "usr-2",
    fullName: "Lê Phương Thảo",
    username: "thaole",
    email: "thaole@gmail.com",
    phone: "0901112233",
    role: "customer",
    password: "123",
    status: "active",
    point: 220,
    tier: "Bạc"
  },
  {
    id: "usr-3",
    fullName: "Trần Minh Anh",
    username: "minhanh",
    email: "minhanh@gmail.com",
    phone: "0933445566",
    role: "customer",
    password: "123",
    status: "active",
    point: 80,
    tier: "Thành viên"
  }
];

export const INITIAL_COMBOFOODS = [
  {
    id: "cb-1",
    name: "Combo Solo Bắp Bơ (L) + 1 Coca",
    image: "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?auto=format&fit=crop&w=600&q=80",
    price: 79000,
    description: "1 bắp lớn vị bơ thơm lừng chuẩn rạp kèm 1 cốc Coca-Cola 32oz mát lạnh sảng khoái.",
    status: "active"
  },
  {
    id: "cb-2",
    name: "Combo Đôi Bạn Thân (Couple Box)",
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=600&q=80",
    price: 119000,
    description: "1 xô bắp khổng lồ mix 2 vị (Phô mai + Caramel) + 2 ly nước ngọt lớn + 1 gói snack khoai tây.",
    status: "active"
  },
  {
    id: "cb-3",
    name: "Bắp Lắc Phô Mai Hảo Hạng (M)",
    image: "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&w=600&q=80",
    price: 59000,
    description: "Bắp rang bơ lắc bột phô mai Cheddar béo ngậy, hạt nở tròn đều, thơm nức mũi.",
    status: "active"
  },
  {
    id: "cb-4",
    name: "Snack Nachos Sốt Phô Mai Nóng",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80",
    price: 65000,
    description: "Bánh ngô nướng Nachos Mexico giòn tan chấm cùng sốt phô mai tan chảy và sốt cà salsa cay nhẹ.",
    status: "active"
  },
  {
    id: "cb-5",
    name: "Combo Bình Nước Độc Quyền Phim",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
    price: 159000,
    description: "1 Bình nước lưu niệm phiên bản giới hạn khắc laser logo bom tấn + 1 bắp ngọt lớn.",
    status: "active"
  }
];

export const INITIAL_PROMOTIONS = [
  {
    id: "pr-1",
    code: "MOVIX50",
    description: "Giảm 50% vé xem phim cho khách hàng mới (tối đa 50.000đ)",
    discountPercent: 50,
    maxDiscount: 50000,
    startDate: "2026-08-01",
    endDate: "2026-12-31",
    usageLimit: 1000,
    usedCount: 285,
    status: "Đang hoạt động",
    filmTitle: "Tất cả phim"
  },
  {
    id: "pr-2",
    code: "CINEVIP",
    description: "Ưu đãi giảm 30.000đ cho phòng chiếu IMAX / ScreenX",
    discountPercent: 25,
    maxDiscount: 30000,
    startDate: "2026-08-15",
    endDate: "2026-11-30",
    usageLimit: 800,
    usedCount: 420,
    status: "Đang hoạt động",
    filmTitle: "Avatar: The Way of Water"
  },
  {
    id: "pr-3",
    code: "HSSV20",
    description: "Đồng giá vé 55K hoặc giảm 20% cho Học sinh - Sinh viên",
    discountPercent: 20,
    maxDiscount: 40000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageLimit: 3000,
    usedCount: 1640,
    status: "Đang hoạt động",
    filmTitle: "Tất cả phim"
  },
  {
    id: "pr-4",
    code: "WEEKENDPOP",
    description: "Tặng ngay 20.000đ khi đặt kèm Combo Bắp Nước cuối tuần",
    discountPercent: 15,
    maxDiscount: 20000,
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    usageLimit: 500,
    usedCount: 110,
    status: "Đang hoạt động",
    filmTitle: "Tất cả phim"
  }
];

export function getTodayStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const d0 = getTodayStr(0); // Hôm nay
const d1 = getTodayStr(1); // Ngày mai
const d2 = getTodayStr(2); // Ngày kia
const d3 = getTodayStr(3);

export const INITIAL_SHOWTIMES = [
  // --- CGV Bà Triệu (cin-1, Hà Nội) ---
  {
    id: "st-1",
    filmId: "film-1",
    cinemaId: "cin-1",
    roomId: "room-1",
    startTime: "10:15",
    date: d0,
    basePrice: 90000,
    seatsBooked: ["B3", "B4", "B9", "E4", "E5", "E6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-2",
    filmId: "film-1",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "14:00",
    date: d0,
    basePrice: 125000,
    seatsBooked: ["C5", "C6", "H7"],
    status: "Đang hoạt động"
  },
  {
    id: "st-3",
    filmId: "film-1",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "19:30",
    date: d0,
    basePrice: 135000,
    seatsBooked: ["G5", "G6", "H5", "H6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-4",
    filmId: "film-2",
    cinemaId: "cin-1",
    roomId: "room-1",
    startTime: "11:30",
    date: d0,
    basePrice: 95000,
    seatsBooked: ["D4", "D5"],
    status: "Đang hoạt động"
  },
  {
    id: "st-5",
    filmId: "film-2",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "16:45",
    date: d0,
    basePrice: 130000,
    seatsBooked: ["F5", "F6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-13",
    filmId: "film-7",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "21:15",
    date: d0,
    basePrice: 130000,
    seatsBooked: ["E7", "E8"],
    status: "Đang hoạt động"
  },
  {
    id: "st-15",
    filmId: "film-9",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "20:15",
    date: d0,
    basePrice: 140000,
    seatsBooked: ["F7", "F8"],
    status: "Đang hoạt động"
  },
  {
    id: "st-16",
    filmId: "film-10",
    cinemaId: "cin-1",
    roomId: "room-1",
    startTime: "18:00",
    date: d0,
    basePrice: 100000,
    seatsBooked: ["D6", "D7"],
    status: "Đang hoạt động"
  },

  // --- Lotte Cinema Landmark 72 (cin-2, Hà Nội) ---
  {
    id: "st-6",
    filmId: "film-3",
    cinemaId: "cin-2",
    roomId: "room-3",
    startTime: "10:30",
    date: d0,
    basePrice: 110000,
    seatsBooked: ["A1", "A2"],
    status: "Đang hoạt động"
  },
  {
    id: "st-7",
    filmId: "film-3",
    cinemaId: "cin-2",
    roomId: "room-3",
    startTime: "18:00",
    date: d0,
    basePrice: 120000,
    seatsBooked: ["C3", "C4"],
    status: "Đang hoạt động"
  },
  {
    id: "st-17",
    filmId: "film-5",
    cinemaId: "cin-2",
    roomId: "room-3",
    startTime: "14:15",
    date: d0,
    basePrice: 110000,
    seatsBooked: ["D4", "D5"],
    status: "Đang hoạt động"
  },
  {
    id: "st-18",
    filmId: "film-10",
    cinemaId: "cin-2",
    roomId: "room-3",
    startTime: "20:30",
    date: d0,
    basePrice: 130000,
    seatsBooked: ["B3", "B4"],
    status: "Đang hoạt động"
  },

  // --- Beta Cinema Quang Trung (cin-3, TP.HCM) ---
  {
    id: "st-8",
    filmId: "film-4",
    cinemaId: "cin-3",
    roomId: "room-4",
    startTime: "09:30",
    date: d0,
    basePrice: 75000,
    seatsBooked: ["B5", "B6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-9",
    filmId: "film-4",
    cinemaId: "cin-3",
    roomId: "room-4",
    startTime: "15:00",
    date: d0,
    basePrice: 80000,
    seatsBooked: ["F5", "F6", "G7"],
    status: "Đang hoạt động"
  },
  {
    id: "st-14",
    filmId: "film-8",
    cinemaId: "cin-3",
    roomId: "room-4",
    startTime: "11:00",
    date: d0,
    basePrice: 75000,
    seatsBooked: ["C3", "C4"],
    status: "Đang hoạt động"
  },
  {
    id: "st-19",
    filmId: "film-11",
    cinemaId: "cin-3",
    roomId: "room-4",
    startTime: "17:15",
    date: d0,
    basePrice: 75000,
    seatsBooked: ["E3", "E4"],
    status: "Đang hoạt động"
  },
  {
    id: "st-20",
    filmId: "film-12",
    cinemaId: "cin-3",
    roomId: "room-4",
    startTime: "19:45",
    date: d0,
    basePrice: 80000,
    seatsBooked: ["D5", "D6"],
    status: "Đang hoạt động"
  },

  // --- Galaxy Cinema Nguyễn Du (cin-4, TP.HCM) ---
  {
    id: "st-10",
    filmId: "film-5",
    cinemaId: "cin-4",
    roomId: "room-5",
    startTime: "14:15",
    date: d0,
    basePrice: 85000,
    seatsBooked: ["D5", "D6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-11",
    filmId: "film-5",
    cinemaId: "cin-4",
    roomId: "room-5",
    startTime: "20:00",
    date: d0,
    basePrice: 95000,
    seatsBooked: ["G5", "G6", "H6", "H7"],
    status: "Đang hoạt động"
  },
  {
    id: "st-12",
    filmId: "film-6",
    cinemaId: "cin-4",
    roomId: "room-5",
    startTime: "17:30",
    date: d0,
    basePrice: 90000,
    seatsBooked: ["A5", "A6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-21",
    filmId: "film-2",
    cinemaId: "cin-4",
    roomId: "room-5",
    startTime: "10:45",
    date: d0,
    basePrice: 85000,
    seatsBooked: ["C5"],
    status: "Đang hoạt động"
  },

  // --- BHD Star Vincom Thảo Điền (cin-5, TP.HCM) ---
  {
    id: "st-22",
    filmId: "film-1",
    cinemaId: "cin-5",
    roomId: "room-5a",
    startTime: "13:30",
    date: d0,
    basePrice: 115000,
    seatsBooked: ["B3", "B4"],
    status: "Đang hoạt động"
  },
  {
    id: "st-23",
    filmId: "film-3",
    cinemaId: "cin-5",
    roomId: "room-5a",
    startTime: "16:15",
    date: d0,
    basePrice: 110000,
    seatsBooked: ["C3", "C4"],
    status: "Đang hoạt động"
  },
  {
    id: "st-24",
    filmId: "film-9",
    cinemaId: "cin-5",
    roomId: "room-5a",
    startTime: "19:00",
    date: d0,
    basePrice: 130000,
    seatsBooked: ["D3", "D4"],
    status: "Đang hoạt động"
  },
  {
    id: "st-25",
    filmId: "film-7",
    cinemaId: "cin-5",
    roomId: "room-5a",
    startTime: "21:45",
    date: d0,
    basePrice: 120000,
    seatsBooked: ["A2", "A3"],
    status: "Đang hoạt động"
  },

  // --- CGV Vincom Đà Nẵng (cin-6, Đà Nẵng) ---
  {
    id: "st-26",
    filmId: "film-2",
    cinemaId: "cin-6",
    roomId: "room-6",
    startTime: "10:30",
    date: d0,
    basePrice: 95000,
    seatsBooked: ["C5", "C6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-27",
    filmId: "film-4",
    cinemaId: "cin-6",
    roomId: "room-6",
    startTime: "14:00",
    date: d0,
    basePrice: 95000,
    seatsBooked: ["D4", "D5"],
    status: "Đang hoạt động"
  },
  {
    id: "st-28",
    filmId: "film-5",
    cinemaId: "cin-6",
    roomId: "room-6",
    startTime: "17:15",
    date: d0,
    basePrice: 100000,
    seatsBooked: ["E5", "E6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-29",
    filmId: "film-8",
    cinemaId: "cin-6",
    roomId: "room-6",
    startTime: "20:00",
    date: d0,
    basePrice: 95000,
    seatsBooked: ["F5", "F6"],
    status: "Đang hoạt động"
  },

  // --- Lotte Cinema Ninh Kiều Cần Thơ (cin-7, Cần Thơ) ---
  {
    id: "st-30",
    filmId: "film-3",
    cinemaId: "cin-7",
    roomId: "room-7",
    startTime: "10:00",
    date: d0,
    basePrice: 80000,
    seatsBooked: ["B4", "B5"],
    status: "Đang hoạt động"
  },
  {
    id: "st-31",
    filmId: "film-5",
    cinemaId: "cin-7",
    roomId: "room-7",
    startTime: "13:45",
    date: d0,
    basePrice: 85000,
    seatsBooked: ["C4", "C5"],
    status: "Đang hoạt động"
  },
  {
    id: "st-32",
    filmId: "film-7",
    cinemaId: "cin-7",
    roomId: "room-7",
    startTime: "17:00",
    date: d0,
    basePrice: 85000,
    seatsBooked: ["D5", "D6"],
    status: "Đang hoạt động"
  },
  {
    id: "st-33",
    filmId: "film-11",
    cinemaId: "cin-7",
    roomId: "room-7",
    startTime: "19:30",
    date: d0,
    basePrice: 80000,
    seatsBooked: ["E5", "E6"],
    status: "Đang hoạt động"
  },

  // --- Suất chiếu các ngày tiếp theo (d1, d2, d3) ---
  {
    id: "st-34",
    filmId: "film-1",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "14:30",
    date: d1,
    basePrice: 125000,
    seatsBooked: ["C4", "C5"],
    status: "Đang hoạt động"
  },
  {
    id: "st-35",
    filmId: "film-2",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "18:45",
    date: d1,
    basePrice: 130000,
    seatsBooked: ["D6", "D7"],
    status: "Đang hoạt động"
  },
  {
    id: "st-36",
    filmId: "film-3",
    cinemaId: "cin-2",
    roomId: "room-3",
    startTime: "15:00",
    date: d1,
    basePrice: 110000,
    seatsBooked: ["A3"],
    status: "Đang hoạt động"
  },
  {
    id: "st-37",
    filmId: "film-4",
    cinemaId: "cin-3",
    roomId: "room-4",
    startTime: "16:30",
    date: d1,
    basePrice: 80000,
    seatsBooked: ["C4"],
    status: "Đang hoạt động"
  },
  {
    id: "st-38",
    filmId: "film-6",
    cinemaId: "cin-4",
    roomId: "room-5",
    startTime: "19:15",
    date: d1,
    basePrice: 90000,
    seatsBooked: ["B5"],
    status: "Đang hoạt động"
  },
  {
    id: "st-39",
    filmId: "film-8",
    cinemaId: "cin-6",
    roomId: "room-6",
    startTime: "14:45",
    date: d1,
    basePrice: 95000,
    seatsBooked: ["E4"],
    status: "Đang hoạt động"
  },
  {
    id: "st-40",
    filmId: "film-1",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "19:30",
    date: d2,
    basePrice: 135000,
    seatsBooked: [],
    status: "Đang hoạt động"
  },
  {
    id: "st-41",
    filmId: "film-5",
    cinemaId: "cin-4",
    roomId: "room-5",
    startTime: "20:00",
    date: d2,
    basePrice: 95000,
    seatsBooked: [],
    status: "Đang hoạt động"
  },
  {
    id: "st-42",
    filmId: "film-2",
    cinemaId: "cin-6",
    roomId: "room-6",
    startTime: "18:30",
    date: d3,
    basePrice: 100000,
    seatsBooked: [],
    status: "Đang hoạt động"
  },
  {
    id: "st-43",
    filmId: "film-9",
    cinemaId: "cin-1",
    roomId: "room-2",
    startTime: "20:00",
    date: d3,
    basePrice: 140000,
    seatsBooked: [],
    status: "Đang hoạt động"
  }
];

export const INITIAL_COMMENTS = [
  {
    id: "cm-1",
    userId: "usr-1",
    userName: "Nguyễn Toàn Thắng",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    filmId: "film-1",
    filmTitle: "Avatar: The Way of Water",
    rate: 5,
    content: "Kỹ xảo 3D trên màn hình IMAX Laser chân thực đến từng bọt nước! Âm thanh đại dương bao la sống động tuyệt đối. Đặt vé trên Movix cực nhanh.",
    report: false,
    reportedBy: null,
    reportReason: null,
    createdAt: "2026-09-02T10:15:00Z"
  },
  {
    id: "cm-2",
    userId: "usr-2",
    userName: "Lê Phương Thảo",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    filmId: "film-2",
    filmTitle: "Dune: Part Two",
    rate: 5,
    content: "Đỉnh cao điện ảnh sci-fi thế kỷ 21! Nhạc nền Hans Zimmer rung chuyển cả rạp, diễn xuất Timothée quá xuất thần.",
    report: false,
    reportedBy: null,
    reportReason: null,
    createdAt: "2026-08-30T16:20:00Z"
  },
  {
    id: "cm-3",
    userId: "usr-3",
    userName: "Trần Minh Anh",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    filmId: "film-5",
    filmTitle: "Lật Mặt 7: Một Điều Ước",
    rate: 5,
    content: "Phim lấy đi nhiều nước mắt nhất từ đầu năm đến giờ. Diễn xuất của Má Hai quá chân thực, xem xong chỉ muốn bắt chuyến xe về nhà ngay với mẹ.",
    report: false,
    reportedBy: null,
    reportReason: null,
    createdAt: "2026-09-03T20:05:00Z"
  },
  {
    id: "cm-4",
    userId: "usr-2",
    userName: "Lê Phương Thảo",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    filmId: "film-4",
    filmTitle: "Spider-Man: Across the Spider-Verse",
    rate: 5,
    content: "Mỗi khung hình là một kiệt tác nghệ thuật đồ họa! Nhịp phim dồn dập, sáng tạo vượt qua mọi giới hạn phim hoạt hình.",
    report: false,
    reportedBy: null,
    reportReason: null,
    createdAt: "2026-09-03T21:40:00Z"
  },
  {
    id: "cm-5",
    userId: "usr-3",
    userName: "spambot_warning",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    filmId: "film-3",
    filmTitle: "Deadpool & Wolverine",
    rate: 1,
    content: "Đây là nội dung thử nghiệm tính năng báo cáo vi phạm và kiểm duyệt bình luận của quản trị viên.",
    report: true,
    reportedBy: "mod_inspector",
    reportReason: "Bình luận thử nghiệm tính năng kiểm duyệt bình luận (UC18).",
    createdAt: "2026-09-03T11:45:00Z"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ord-1",
    ticketCode: "MVX-92813",
    userId: "usr-1",
    userName: "Nguyễn Toàn Thắng",
    phone: "0987654321",
    filmId: "film-1",
    filmTitle: "Avatar: The Way of Water",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    cinemaId: "cin-1",
    cinemaName: "CGV Vincom Center Bà Triệu",
    roomName: "Phòng 2 (IMAX Laser)",
    city: "Hà Nội",
    showtimeDate: "04/09/2026",
    showtimeTime: "19:30",
    seats: [
      { seatKey: "G5", type: "vip", unitPrice: 135000 },
      { seatKey: "G6", type: "vip", unitPrice: 135000 }
    ],
    comboFoods: [
      { comboId: "cb-1", name: "Combo Solo Bắp Bơ (L) + 1 Coca", quantity: 1, price: 79000 }
    ],
    seatSubtotal: 270000,
    comboSubtotal: 79000,
    promotionCode: "CINEVIP",
    discountAmount: 30000,
    totalAmount: 319000,
    ticketQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MVX-92813",
    paymentMethod: "PayOS",
    paymentStatus: "paid",
    orderStatus: "confirmed",
    createdAt: "2026-09-04T01:15:00Z"
  },
  {
    id: "ord-2",
    ticketCode: "MVX-64019",
    userId: "usr-2",
    userName: "Lê Phương Thảo",
    phone: "0901112233",
    filmId: "film-2",
    filmTitle: "Dune: Part Two",
    posterUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    cinemaId: "cin-1",
    cinemaName: "CGV Vincom Center Bà Triệu",
    roomName: "Phòng 2 (IMAX Laser)",
    city: "Hà Nội",
    showtimeDate: "04/09/2026",
    showtimeTime: "16:45",
    seats: [
      { seatKey: "F5", type: "standard", unitPrice: 120000 },
      { seatKey: "F6", type: "standard", unitPrice: 120000 }
    ],
    comboFoods: [
      { comboId: "cb-2", name: "Combo Đôi Bạn Thân (Couple Box)", quantity: 1, price: 119000 }
    ],
    seatSubtotal: 240000,
    comboSubtotal: 119000,
    promotionCode: "MOVIX50",
    discountAmount: 50000,
    totalAmount: 309000,
    ticketQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MVX-64019",
    paymentMethod: "VietQR",
    paymentStatus: "paid",
    orderStatus: "confirmed",
    createdAt: "2026-09-03T18:40:00Z"
  },
  {
    id: "ord-3",
    ticketCode: "MVX-11204",
    userId: "usr-3",
    userName: "Trần Minh Anh",
    phone: "0933445566",
    filmId: "film-5",
    filmTitle: "Lật Mặt 7: Một Điều Ước",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    cinemaId: "cin-4",
    cinemaName: "Galaxy Cinema Nguyễn Du",
    roomName: "Phòng 1 (Dolby Atmos)",
    city: "TP. Hồ Chí Minh",
    showtimeDate: "04/09/2026",
    showtimeTime: "20:00",
    seats: [
      { seatKey: "G5", type: "standard", unitPrice: 85000 },
      { seatKey: "G6", type: "standard", unitPrice: 85000 }
    ],
    comboFoods: [
      { comboId: "cb-3", name: "Bắp Lắc Phô Mai Hảo Hạng (M)", quantity: 1, price: 59000 }
    ],
    seatSubtotal: 170000,
    comboSubtotal: 59000,
    promotionCode: null,
    discountAmount: 0,
    totalAmount: 229000,
    ticketQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=MVX-11204",
    paymentMethod: "PayOS",
    paymentStatus: "paid",
    orderStatus: "used",
    createdAt: "2026-09-03T09:10:00Z"
  }
];

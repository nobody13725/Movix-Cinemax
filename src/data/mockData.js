export const genres = ["Hành động", "Khoa học viễn tưởng", "Kinh dị", "Chính kịch", "Hoạt hình", "Hài"];

export const movies = [
  { id: "m1", title: "Avatar: The Way of Water", genre: "Khoa học viễn tưởng", duration: 192, rating: 8.5, emoji: "🌊", color: "#dbeafe", ageTag: "T13", desc: "Jake Sully và gia đình Na'vi phải rời khỏi khu rừng thân thuộc để khám phá vùng biển của hành tinh Pandora, nơi họ tìm kiếm sự bảo vệ và đối mặt với một thế lực đe dọa mới." },
  { id: "m2", title: "Black Panther: Wakanda Forever", genre: "Hành động", duration: 161, rating: 9.2, emoji: "🐆", color: "#fee2e2", ageTag: "T13", desc: "Nữ hoàng Ramonda, Shuri và các đồng minh chiến đấu để bảo vệ Wakanda sau sự ra đi của Vua T'Challa, trong khi một vương quốc dưới nước bí ẩn nổi lên đe dọa." },
  { id: "m3", title: "Top Gun: Maverick", genre: "Hành động", duration: 130, rating: 8.8, emoji: "✈️", color: "#dbeafe", ageTag: "T13", desc: "Sau hơn 30 năm phục vụ, Pete 'Maverick' Mitchell được giao nhiệm vụ huấn luyện một đội phi công trẻ cho một sứ mệnh nguy hiểm bậc nhất." },
  { id: "m4", title: "The Menu", genre: "Kinh dị", duration: 107, rating: 7.9, emoji: "🍽️", color: "#dcfce7", ageTag: "T18", desc: "Một cặp đôi trẻ đến hòn đảo hẻo lánh để thưởng thức bữa tối tại nhà hàng độc quyền, nơi đầu bếp nổi tiếng chuẩn bị một thực đơn đầy bất ngờ kinh hoàng." },
  { id: "m5", title: "Babylon", genre: "Chính kịch", duration: 189, rating: 7.2, emoji: "🎬", color: "#ede9fe", ageTag: "T18", desc: "Câu chuyện tham vọng, dục vọng và sự sa đọa tại Hollywood trong thời kỳ chuyển giao từ phim câm sang phim có tiếng những năm 1920." },
  { id: "m6", title: "Puss in Boots: Last Wish", genre: "Hoạt hình", duration: 102, rating: 8.7, emoji: "🐱", color: "#fef9c3", ageTag: "P", desc: "Mèo Đi Hia khám phá rằng lòng đam mê phiêu lưu đã tiêu tốn 8 trong 9 mạng sống của mình, buộc anh phải lên đường tìm điều ước cuối cùng để lấy lại mạng sống đã mất." },
];

export const cinemas = [
  {
    id: "c1", name: "CGV Vincom Center", address: "191 Bà Triệu, Hai Bà Trưng, Hà Nội", openHours: "08:00 - 23:30",
    showtimes: {
      m1: ["10:30", "13:45", "17:00", "20:15", "22:30"],
      m2: ["11:00", "14:30", "18:00", "21:30"],
      m3: ["09:45", "12:30", "15:15", "18:45", "21:30"],
    }
  },
  {
    id: "c2", name: "Lotte Cinema Landmark", address: "58 Nguyễn Du, Hai Bà Trưng, Hà Nội", openHours: "09:00 - 24:00",
    showtimes: {
      m3: ["09:45", "12:30", "15:15", "18:45", "21:30"],
      m4: ["10:00", "13:20", "16:40", "20:00"],
      m6: ["10:15", "12:30", "14:45", "17:00"],
    }
  },
  {
    id: "c3", name: "Beta Quang Trung", address: "645 Quang Trung, Gò Vấp, TP. Hồ Chí Minh", openHours: "08:00 - 24:00",
    showtimes: {
      m5: ["11:10", "15:00", "18:50", "22:20"],
      m2: ["10:20", "13:50", "17:20", "20:50"],
      m1: ["09:30", "12:45", "16:00", "19:15", "22:20"],
    }
  },
];

export function buildDateStrip(count = 6) {
  const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];
  const out = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      dow: i === 0 ? "Hôm nay" : days[d.getDay()],
      dm: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return out;
}

const takenPool = ["B3", "B4", "B9", "E4", "E5", "E6", "E7"];
const vipRows = ["H", "I"];
const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export function buildSeatMap() {
  return rows.map((row) => ({
    row,
    seats: cols.map((c) => {
      const id = `${row}${c}`;
      return {
        id,
        vip: vipRows.includes(row),
        taken: takenPool.includes(id),
      };
    }),
  }));
}

export const TICKET_PRICE = 75000;
export const VIP_PRICE = 95000;

export const combos = [
  { id: "co1", name: "Bắp rang bơ (L) + Coca (L)", desc: "1 bắp lớn, 2 nước ngọt cỡ lớn", price: 89000, emoji: "🍿" },
  { id: "co2", name: "Combo đôi tiết kiệm", desc: "1 bắp lớn, 2 nước, giảm 15%", price: 109000, emoji: "🥤" },
  { id: "co3", name: "Bắp phô mai (M)", desc: "1 bắp vừa vị phô mai", price: 55000, emoji: "🧀" },
  { id: "co4", name: "Snack nachos", desc: "Nachos kèm sốt phô mai cay", price: 62000, emoji: "🌽" },
];

export const reviews = [
  { name: "Minh Anh", stars: 5, text: "Kỹ xảo cực đẹp, xem trên màn hình lớn đã mắt luôn. Đặt vé qua Movix nhanh gọn.", initials: "MA" },
  { name: "Quốc Bảo", stars: 4, text: "Nội dung ổn, hơi dài nhưng vẫn đáng xem một lần ngoài rạp.", initials: "QB" },
  { name: "Thuỳ Linh", stars: 5, text: "Ghế VIP hàng H rất thoải mái, sẽ đặt lại lần sau.", initials: "TL" },
];

export function seedBookingHistory() {
  return [
    { id: "bk1001", movieId: "m2", cinema: "CGV Vincom Center", date: "12/09/2026", time: "18:00", seats: ["H5", "H6"], status: "upcoming", total: 265000 },
    { id: "bk0987", movieId: "m3", cinema: "Lotte Cinema Landmark", date: "02/08/2026", time: "15:15", seats: ["D4", "D5"], status: "done", total: 150000 },
    { id: "bk0954", movieId: "m1", cinema: "Beta Quang Trung", date: "20/07/2026", time: "19:15", seats: ["B3"], status: "cancelled", total: 75000 },
  ];
}

import { createClient } from "@supabase/supabase-js";
import {
  INITIAL_CITIES,
  INITIAL_CATEGORIES,
  INITIAL_CINEMAS,
  INITIAL_ROOMS,
  INITIAL_FILMS,
  INITIAL_USERS,
  INITIAL_COMBOFOODS,
  INITIAL_PROMOTIONS,
  INITIAL_BANNERS,
  INITIAL_SHOWTIMES,
  INITIAL_COMMENTS,
  INITIAL_ORDERS,
} from "../data/initialDbData.js";

const STORAGE_KEY_DB = "movix_db_v4";
const STORAGE_KEY_CONFIG = "movix_supabase_config_v1";
const STORAGE_KEY_AUTH = "movix_current_user_v2";

export const authService = {
  getCurrentUser() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  },
  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } else {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    }
  },
  logout() {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },
  isAdmin(user) {
    return Boolean(user && (user.role === "admin" || user.role === "administrator"));
  },
};

// 1. Quản lý cấu hình Supabase
export function getSupabaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Lỗi đọc cấu hình Supabase:", e);
  }

  return {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  };
}

export function saveSupabaseConfig(url, anonKey) {
  const config = { url: url.trim(), anonKey: anonKey.trim() };
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  // Reset cached client
  cachedClient = null;
  return config;
}

let cachedClient = null;
export function getSupabaseClient() {
  if (cachedClient) return cachedClient;
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      cachedClient = createClient(config.url, config.anonKey);
      return cachedClient;
    } catch (e) {
      console.warn("Không thể khởi tạo Supabase Client:", e);
    }
  }
  return null;
}

// 2. Local Database Repository (Đồng bộ thời gian thực cho ứng dụng)
function initLocalDb() {
  const existing = localStorage.getItem(STORAGE_KEY_DB);
  if (existing) {
    try {
      const db = JSON.parse(existing);
      let changed = false;

      // Bảo đảm mảng promotions luôn đầy đủ và có các mã mới nhất
      if (!db.promotions || !Array.isArray(db.promotions) || db.promotions.length === 0) {
        db.promotions = [...INITIAL_PROMOTIONS];
        changed = true;
      } else {
        // Đồng bộ các mã mới nếu thiếu (ví dụ: CHAOMOI, VIP20, MOMO15)
        for (const initP of INITIAL_PROMOTIONS) {
          const foundIndex = db.promotions.findIndex(
            (p) => p.code && p.code.trim().toUpperCase() === initP.code.toUpperCase()
          );
          if (foundIndex === -1) {
            db.promotions.push(initP);
            changed = true;
          } else if (!db.promotions[foundIndex].bannerUrl || !db.promotions[foundIndex].title) {
            db.promotions[foundIndex] = {
              ...initP,
              ...db.promotions[foundIndex],
              bannerUrl: initP.bannerUrl,
              title: initP.title,
              category: initP.category,
            };
            changed = true;
          }
        }
      }

      // Bảo đảm mảng banners quảng cáo luôn sẵn sàng
      if (!db.banners || !Array.isArray(db.banners) || db.banners.length === 0) {
        db.banners = [...INITIAL_BANNERS];
        changed = true;
      }

      // Bảo đảm mảng users luôn có đầy đủ tài khoản mẫu (Admin & Khách hàng)
      if (!db.users || !Array.isArray(db.users) || db.users.length === 0) {
        db.users = [...INITIAL_USERS];
        changed = true;
      } else {
        for (const initU of INITIAL_USERS) {
          const idx = db.users.findIndex(
            (u) => u.id === initU.id || u.email?.toLowerCase() === initU.email?.toLowerCase()
          );
          if (idx === -1) {
            db.users.push(initU);
            changed = true;
          } else {
            // Đảm bảo mật khẩu và vai trò chuẩn xác
            if (!db.users[idx].password) {
              db.users[idx].password = initU.password || "123";
              changed = true;
            }
            if (initU.role === "admin" && db.users[idx].role !== "admin") {
              db.users[idx].role = "admin";
              changed = true;
            }
            // Chuẩn hoá phân quyền: Chỉ có 'Quản trị viên' và 'Thành viên'
            if (db.users[idx].role === "admin") {
              db.users[idx].tier = "Quản trị viên";
            } else {
              db.users[idx].role = "customer";
              db.users[idx].tier = "Thành viên";
            }
          }
        }
      }

      if (changed) {
        localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(db));
      }

      return db;
    } catch (e) {
      console.error("Lỗi parse DB từ localStorage, khởi tạo lại:", e);
    }
  }

  const initial = {
    cities: INITIAL_CITIES,
    categories: INITIAL_CATEGORIES,
    cinemas: INITIAL_CINEMAS,
    rooms: INITIAL_ROOMS,
    films: INITIAL_FILMS,
    users: INITIAL_USERS,
    combofoods: INITIAL_COMBOFOODS,
    promotions: INITIAL_PROMOTIONS,
    banners: INITIAL_BANNERS,
    showtimes: INITIAL_SHOWTIMES,
    comments: INITIAL_COMMENTS,
    orders: INITIAL_ORDERS,
  };
  localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(initial));
  return initial;
}

let subscribers = [];
function notifySubscribers() {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error(e);
    }
  });
}

export function subscribeDb(callback) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
  };
}

function getDb() {
  return initLocalDb();
}

function saveDb(db) {
  localStorage.setItem(STORAGE_KEY_DB, JSON.stringify(db));
  notifySubscribers();
}

// 3. Database Service API
export const dbService = {
  // Cities & Categories
  getCities() {
    return getDb().cities || [];
  },
  getCategories() {
    return getDb().categories || [];
  },

  // Cinemas
  getCinemas() {
    return getDb().cinemas || [];
  },
  addCinema(data) {
    const db = getDb();
    const newCinema = {
      id: `cin-${Date.now()}`,
      avatar: "🏢",
      ...data,
    };
    db.cinemas.unshift(newCinema);
    saveDb(db);
    return newCinema;
  },
  updateCinema(id, data) {
    const db = getDb();
    db.cinemas = db.cinemas.map((c) => (c.id === id ? { ...c, ...data } : c));
    saveDb(db);
  },
  deleteCinema(id) {
    const db = getDb();
    db.cinemas = db.cinemas.filter((c) => c.id !== id);
    saveDb(db);
  },

  // Rooms
  getRooms() {
    return getDb().rooms || [];
  },
  addRoom(data) {
    const db = getDb();
    const newRoom = {
      id: `room-${Date.now()}`,
      seatLayout: [
        { row: "A", count: 12 },
        { row: "B", count: 12 },
        { row: "C", count: 12 },
        { row: "D", count: 12 },
        { row: "E", count: 12 },
        { row: "F", count: 12, vip: true },
        { row: "G", count: 12, vip: true },
      ],
      ...data,
    };
    db.rooms.unshift(newRoom);
    saveDb(db);
    return newRoom;
  },
  updateRoom(id, data) {
    const db = getDb();
    db.rooms = db.rooms.map((r) => (r.id === id ? { ...r, ...data } : r));
    saveDb(db);
  },
  deleteRoom(id) {
    const db = getDb();
    db.rooms = db.rooms.filter((r) => r.id !== id);
    saveDb(db);
  },

  // Films
  getFilms() {
    return getDb().films || [];
  },
  getFilm(id) {
    return getDb().films.find((f) => f.id === id);
  },
  addFilm(data) {
    const db = getDb();
    const newFilm = {
      id: `film-${Date.now()}`,
      rating: 8.5,
      thumbnail: "🎬",
      format: "2D, 3D",
      status: "Đang chiếu",
      releaseDate: new Date().toISOString().slice(0, 10),
      ...data,
    };
    db.films.unshift(newFilm);
    saveDb(db);
    return newFilm;
  },
  updateFilm(id, data) {
    const db = getDb();
    db.films = db.films.map((f) => (f.id === id ? { ...f, ...data } : f));
    saveDb(db);
  },
  deleteFilm(id) {
    const db = getDb();
    db.films = db.films.filter((f) => f.id !== id);
    saveDb(db);
  },

  // Showtimes
  getShowtimes() {
    return getDb().showtimes || [];
  },
  addShowtime(data) {
    const db = getDb();
    const newShowtime = {
      id: `st-${Date.now()}`,
      seatsBooked: [],
      status: "Đang hoạt động",
      ...data,
    };
    db.showtimes.unshift(newShowtime);
    saveDb(db);
    return newShowtime;
  },
  updateShowtime(id, data) {
    const db = getDb();
    db.showtimes = db.showtimes.map((s) => (s.id === id ? { ...s, ...data } : s));
    saveDb(db);
  },
  deleteShowtime(id) {
    const db = getDb();
    db.showtimes = db.showtimes.filter((s) => s.id !== id);
    saveDb(db);
  },

  // Users
  getUsers() {
    return getDb().users || [];
  },
  getUser(id) {
    return getDb().users.find((u) => u.id === id);
  },
  getUserByIdentity(identity) {
    if (!identity) return null;
    const clean = identity.trim().toLowerCase();
    return (getDb().users || []).find(
      (u) =>
        u.email?.toLowerCase() === clean ||
        u.username?.toLowerCase() === clean ||
        u.phone === clean
    );
  },
  addUser(data) {
    const db = getDb();
    const newUser = {
      id: `usr-${Date.now()}`,
      avatar: "🧑",
      role: "member",
      status: "Hoạt động",
      deleted: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
    db.users.unshift(newUser);
    saveDb(db);
    return newUser;
  },
  updateUser(id, data) {
    const db = getDb();
    db.users = db.users.map((u) => (u.id === id ? { ...u, ...data } : u));
    saveDb(db);
  },
  toggleLockUser(id) {
    const db = getDb();
    db.users = db.users.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === "Tạm khóa" ? "Hoạt động" : "Tạm khóa";
        return { ...u, status: nextStatus };
      }
      return u;
    });
    saveDb(db);
  },
  deleteUser(id) {
    const db = getDb();
    db.users = db.users.filter((u) => u.id !== id);
    saveDb(db);
  },

  // Comments & Moderation
  getComments() {
    return getDb().comments || [];
  },
  addComment(data) {
    const db = getDb();
    const newComment = {
      id: `cm-${Date.now()}`,
      report: false,
      reportedBy: null,
      reportReason: null,
      createdAt: new Date().toISOString(),
      ...data,
    };
    db.comments.unshift(newComment);
    saveDb(db);
    return newComment;
  },
  reportComment(id, reason, reportedByName = "Người dùng") {
    const db = getDb();
    db.comments = db.comments.map((c) =>
      c.id === id ? { ...c, report: true, reportReason: reason, reportedBy: reportedByName } : c
    );
    saveDb(db);
  },
  resolveCommentReport(id, action) {
    // action: 'delete' (duyệt gỡ bình luận vi phạm) or 'dismiss' (từ chối báo cáo, giữ bình luận)
    const db = getDb();
    if (action === "delete") {
      db.comments = db.comments.filter((c) => c.id !== id);
    } else {
      db.comments = db.comments.map((c) =>
        c.id === id ? { ...c, report: false, reportReason: null, reportedBy: null } : c
      );
    }
    saveDb(db);
  },

  // Promotions
  getPromotions() {
    return getDb().promotions || [];
  },
  addPromotion(data) {
    const db = getDb();
    const newPromo = {
      id: `pr-${Date.now()}`,
      usedCount: 0,
      status: "Đang hoạt động",
      category: "Vé xem phim",
      ...data,
    };
    db.promotions.unshift(newPromo);
    saveDb(db);
    return newPromo;
  },
  updatePromotion(id, data) {
    const db = getDb();
    db.promotions = db.promotions.map((p) => (p.id === id ? { ...p, ...data } : p));
    saveDb(db);
  },
  deletePromotion(id) {
    const db = getDb();
    db.promotions = db.promotions.filter((p) => p.id !== id);
    saveDb(db);
  },
  validatePromo(code, subtotal = 0) {
    const db = getDb();
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, message: "Vui lòng nhập mã khuyến mãi!" };
    }

    const promo = (db.promotions || []).find((p) => {
      if (!p.code) return false;
      const matchCode = p.code.trim().toUpperCase() === cleanCode;
      const statusLower = (p.status || "").toLowerCase();
      const isActive = statusLower.includes("hoạt động") || statusLower.includes("active") || !p.status;
      return matchCode && isActive;
    });

    if (!promo) {
      return { valid: false, message: `Mã khuyến mãi "${cleanCode}" không tồn tại hoặc đã ngưng áp dụng!` };
    }

    // Kiểm tra thời hạn
    const today = new Date().toISOString().slice(0, 10);
    if (promo.startDate && promo.startDate > today) {
      return { valid: false, message: `Mã "${cleanCode}" chỉ có hiệu lực từ ngày ${promo.startDate}!` };
    }
    if (promo.endDate && promo.endDate < today) {
      return { valid: false, message: `Mã "${cleanCode}" đã hết hạn sử dụng vào ngày ${promo.endDate}!` };
    }

    // Kiểm tra lượt dùng
    if (promo.usageLimit && (promo.usedCount || 0) >= promo.usageLimit) {
      return { valid: false, message: `Mã "${cleanCode}" đã đạt giới hạn lượt sử dụng trên hệ thống!` };
    }

    // Tính toán số tiền được giảm
    let discountAmount = 0;
    if (promo.discountPercent) {
      discountAmount = Math.round((subtotal * Number(promo.discountPercent)) / 100);
      if (promo.maxDiscount) {
        discountAmount = Math.min(discountAmount, Number(promo.maxDiscount));
      }
    } else if (promo.maxDiscount) {
      discountAmount = Math.min(Number(promo.maxDiscount), subtotal);
    }

    discountAmount = Math.max(0, Math.min(discountAmount, subtotal));

    return {
      valid: true,
      promo,
      discountAmount,
      message: `Áp dụng thành công mã ${promo.code}: Giảm ${promo.discountPercent || 0}%`,
    };
  },

  // Banners Quảng cáo & Khuyến mãi
  getBanners() {
    return getDb().banners || [];
  },
  addBanner(data) {
    const db = getDb();
    const newBanner = {
      id: `bn-${Date.now()}`,
      badge: "ƯU ĐÃI",
      badgeColor: "var(--brand-600)",
      bgGradient: "linear-gradient(135deg, #1e1b4b, #312e81)",
      ...data,
    };
    db.banners.unshift(newBanner);
    saveDb(db);
    return newBanner;
  },
  updateBanner(id, data) {
    const db = getDb();
    db.banners = (db.banners || []).map((b) => (b.id === id ? { ...b, ...data } : b));
    saveDb(db);
  },
  deleteBanner(id) {
    const db = getDb();
    db.banners = (db.banners || []).filter((b) => b.id !== id);
    saveDb(db);
  },

  // Combo foods
  getComboFoods() {
    return getDb().combofoods || [];
  },
  addComboFood(data) {
    const db = getDb();
    const newCombo = {
      id: `cb-${Date.now()}`,
      image: "🍿",
      status: "active",
      ...data,
    };
    db.combofoods.unshift(newCombo);
    saveDb(db);
    return newCombo;
  },

  // Orders / Bookings
  getOrders() {
    return getDb().orders || [];
  },
  createOrder(data) {
    const db = getDb();
    const ticketNum = Math.floor(10000 + Math.random() * 90000);
    const ticketCode = `MVX-${ticketNum}`;
    const newOrder = {
      id: `ord-${Date.now()}`,
      ticketCode,
      ticketQrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${ticketCode}`,
      orderStatus: "confirmed",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
      ...data,
    };

    // Cập nhật trạng thái ghế đã đặt trong suất chiếu
    if (data.showtimeId && data.seats && data.seats.length > 0) {
      const seatKeys = data.seats.map((s) => s.seatKey);
      db.showtimes = db.showtimes.map((st) => {
        if (st.id === data.showtimeId) {
          const updatedBooked = Array.from(new Set([...(st.seatsBooked || []), ...seatKeys]));
          return { ...st, seatsBooked: updatedBooked };
        }
        return st;
      });
    }

    // Tăng lượt dùng mã giảm giá nếu có
    if (data.promotionCode) {
      db.promotions = db.promotions.map((p) =>
        p.code === data.promotionCode ? { ...p, usedCount: (p.usedCount || 0) + 1 } : p
      );
    }

    db.orders.unshift(newOrder);
    saveDb(db);
    return newOrder;
  },
  updateOrderStatus(id, newStatus) {
    const db = getDb();
    db.orders = db.orders.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o));
    saveDb(db);
  },

  // Data management
  exportDataJSON() {
    return JSON.stringify(getDb(), null, 2);
  },
  importDataJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === "object") {
        saveDb(parsed);
        return { success: true };
      }
      return { success: false, message: "Dữ liệu JSON không hợp lệ." };
    } catch (e) {
      return { success: false, message: e.message };
    }
  },
  resetDefaultData() {
    localStorage.removeItem(STORAGE_KEY_DB);
    const fresh = initLocalDb();
    notifySubscribers();
    return fresh;
  },

  // Remote Supabase Test & Sync helpers
  async testRemoteConnection() {
    const client = getSupabaseClient();
    if (!client) {
      return { ok: false, error: "Chưa cấu hình Supabase URL hoặc Anon Key." };
    }
    try {
      const { data, error } = await client.from("films").select("id, title").limit(1);
      if (error) {
        return { ok: false, error: error.message };
      }
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: err.message || "Không thể kết nối đến Supabase." };
    }
  },

  async pushSeedToRemote() {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Chưa cấu hình Supabase URL và Key.");
    }
    const db = getDb();

    // Insert cities
    if (db.cities?.length) {
      await client.from("cities").upsert(
        db.cities.map((c) => ({ id: c.id, name: c.name }))
      );
    }
    // Insert categories
    if (db.categories?.length) {
      await client.from("categories").upsert(
        db.categories.map((c) => ({ id: c.id, title: c.title }))
      );
    }
    // Insert films
    if (db.films?.length) {
      await client.from("films").upsert(
        db.films.map((f) => ({
          id: f.id,
          title: f.title,
          duration: f.duration,
          rating: f.rating,
          description: f.description,
          status: f.status,
          age_rating: f.ageRating,
          trailer: f.trailer,
          thumbnail: f.thumbnail,
        }))
      );
    }
    return { ok: true, count: db.films.length };
  },

  async pullFromRemote() {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Chưa kết nối Supabase.");
    }
    const { data: films, error } = await client.from("films").select("*");
    if (error) throw error;
    if (films && films.length > 0) {
      const db = getDb();
      db.films = films.map((f) => ({
        id: f.id,
        title: f.title,
        duration: f.duration || 120,
        rating: f.rating || 8.0,
        description: f.description || "",
        status: f.status || "Đang chiếu",
        ageRating: f.age_rating || "T13",
        trailer: f.trailer || "",
        thumbnail: f.thumbnail || "🎬",
      }));
      saveDb(db);
      return { ok: true, filmsCount: films.length };
    }
    return { ok: true, filmsCount: 0 };
  },

  resetToInitialData() {
    const initial = {
      cities: INITIAL_CITIES,
      categories: INITIAL_CATEGORIES,
      cinemas: INITIAL_CINEMAS,
      rooms: INITIAL_ROOMS,
      films: INITIAL_FILMS,
      users: INITIAL_USERS,
      combofoods: INITIAL_COMBOFOODS,
      promotions: INITIAL_PROMOTIONS,
      showtimes: INITIAL_SHOWTIMES,
      comments: INITIAL_COMMENTS,
      orders: INITIAL_ORDERS,
    };
    saveDb(initial);
    return initial;
  },
};

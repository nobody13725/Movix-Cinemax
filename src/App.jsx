import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Showtimes from "./pages/Showtimes.jsx";
import Cinemas from "./pages/Cinemas.jsx";
import BookingFlow from "./pages/BookingFlow.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/Profile.jsx";
import Promotions from "./pages/Promotions.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import { authService } from "./lib/supabaseClient.js";

export default function App() {
  const [route, setRoute] = useState({ name: "home", params: {} });
  const historyRef = useRef([{ name: "home", params: {} }]);
  // Khôi phục phiên đăng nhập từ localStorage thay vì cố định tài khoản Admin
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [toast, setToast] = useState("");

  // Đồng bộ với nút Back/Forward của trình duyệt
  useEffect(() => {
    try {
      if (!window.history.state) {
        window.history.replaceState({ name: "home", params: {} }, "");
      }
    } catch {
      // ignore
    }

    function handlePopState(e) {
      if (e.state && e.state.name) {
        setRoute(e.state);
        if (historyRef.current.length > 1) {
          historyRef.current.pop();
        }
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function go(name, params = {}, replace = false) {
    const newRoute = { name, params };
    try {
      if (replace) {
        window.history.replaceState(newRoute, "");
        if (historyRef.current.length > 0) {
          historyRef.current[historyRef.current.length - 1] = newRoute;
        } else {
          historyRef.current.push(newRoute);
        }
      } else {
        window.history.pushState(newRoute, "");
        historyRef.current.push(newRoute);
      }
    } catch {
      // ignore
    }
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const prevRoute = historyRef.current[historyRef.current.length - 1];
      try {
        window.history.back();
      } catch {
        // ignore
      }
      setRoute(prevRoute);
    } else {
      go("home");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onLogin(u) {
    setUser(u);
    authService.setCurrentUser(u);
    const roleTitle = authService.isAdmin(u) ? "Quản trị viên (Admin)" : "Thành viên Movix";
    showToast(`Đăng nhập thành công: ${u.fullName || u.name} (${roleTitle})`);
  }

  function onLogout() {
    authService.logout();
    setUser(null);
    showToast("Đã đăng xuất tài khoản an toàn.");
    go("home");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  const noChromePages = new Set(["login", "register", "forgotPassword", "admin"]);
  const hideChrome = noChromePages.has(route.name);

  let page;
  switch (route.name) {
    case "home":
      page = <Home go={go} goBack={goBack} />;
      break;
    case "movies":
      page = <Movies go={go} goBack={goBack} params={route.params} />;
      break;
    case "search":
      page = <Movies go={go} goBack={goBack} params={{ q: route.params.q }} />;
      break;
    case "movie":
      page = <MovieDetail go={go} goBack={goBack} params={route.params} user={user} />;
      break;
    case "showtimes":
      page = <Showtimes go={go} goBack={goBack} params={route.params} />;
      break;
    case "cinemas":
      page = <Cinemas go={go} goBack={goBack} />;
      break;
    case "promotions":
      page = <Promotions go={go} goBack={goBack} params={route.params} />;
      break;
    case "seatSelect":
      page = <BookingFlow go={go} goBack={goBack} params={route.params} user={user} />;
      break;
    case "bookingSuccess":
      page = <BookingSuccess go={go} goBack={goBack} params={route.params} />;
      break;
    case "login":
      page = <Login go={go} goBack={goBack} onLogin={onLogin} params={route.params} />;
      break;
    case "register":
      page = <Register go={go} goBack={goBack} onLogin={onLogin} />;
      break;
    case "forgotPassword":
      page = <ForgotPassword go={go} goBack={goBack} />;
      break;
    case "profile":
      page = <Profile go={go} goBack={goBack} user={user} onLogout={onLogout} />;
      break;
    case "admin":
      // Phân quyền chặt chẽ: Chỉ tài khoản Admin mới được truy cập Bảng quản trị
      if (!user) {
        page = (
          <div className="section container" style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>
            <div className="card" style={{ padding: 36, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
              <h2 style={{ fontSize: 20, marginBottom: 10, color: "var(--ink-900)" }}>
                Yêu cầu đăng nhập Quản trị viên
              </h2>
              <p style={{ fontSize: 14.5, color: "var(--ink-600)", lineHeight: 1.6, marginBottom: 24 }}>
                Khu vực Quản trị hệ thống Movix chứa các dữ liệu bảo mật và cấu hình cơ sở dữ liệu. Vui lòng đăng nhập bằng tài khoản Quản trị viên (Admin) để tiếp tục.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn btn-secondary" onClick={() => go("home")}>
                  ← Về trang chủ
                </button>
                <button className="btn btn-primary" onClick={() => go("login", { redirect: "admin" })}>
                  Đăng nhập Admin
                </button>
              </div>
            </div>
          </div>
        );
      } else if (!authService.isAdmin(user)) {
        page = (
          <div className="section container" style={{ maxWidth: 560, margin: "60px auto", textAlign: "center" }}>
            <div className="card" style={{ padding: 36, border: "1px solid #fecaca", background: "#fff5f5" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
              <h2 style={{ fontSize: 20, marginBottom: 10, color: "#991b1b" }}>
                Truy cập bị từ chối (403 Forbidden)
              </h2>
              <p style={{ fontSize: 14.5, color: "#7f1d1d", lineHeight: 1.6, marginBottom: 14 }}>
                Tài khoản <strong>{user.fullName || user.name}</strong> ({user.email}) hiện có vai trò là <strong>Thành viên / Khách hàng</strong>.
              </p>
              <p style={{ fontSize: 13.5, color: "var(--ink-600)", lineHeight: 1.6, marginBottom: 24 }}>
                Bạn không có quyền truy cập vào Bảng điều khiển Quản trị viên. Hãy quay lại trang chủ hoặc chuyển đổi sang tài khoản Quản trị viên.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn btn-secondary" onClick={() => go("home")}>
                  ← Về trang chủ
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    authService.logout();
                    setUser(null);
                    go("login", { redirect: "admin" });
                  }}
                >
                  Đăng nhập tài khoản Admin khác
                </button>
              </div>
            </div>
          </div>
        );
      } else {
        page = <AdminLayout go={go} goBack={goBack} onExitAdmin={() => go("home")} user={user} />;
      }
      break;
    default:
      page = <Home go={go} goBack={goBack} />;
  }

  return (
    <div className="app-shell">
      {!hideChrome && <Navbar route={route} go={go} user={user} onLogout={onLogout} />}
      <main style={{ flex: 1 }}>{page}</main>
      {!hideChrome && <Footer go={go} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

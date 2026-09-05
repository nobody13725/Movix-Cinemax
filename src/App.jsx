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
import AdminLayout from "./pages/Admin/AdminLayout.jsx";

export default function App() {
  const [route, setRoute] = useState({ name: "home", params: {} });
  const historyRef = useRef([{ name: "home", params: {} }]);
  const [user, setUser] = useState({
    id: "usr-admin-01",
    fullName: "Quản trị viên Movix",
    name: "Quản trị viên",
    email: "admin@movix.vn",
    role: "admin",
    status: "Hoạt động",
  });
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
    showToast(`Chào mừng, ${u.fullName || u.name}!`);
  }

  function onLogout() {
    setUser(null);
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
      page = <Profile go={go} goBack={goBack} user={user} />;
      break;
    case "admin":
      page = <AdminLayout go={go} goBack={goBack} onExitAdmin={() => go("home")} user={user} />;
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

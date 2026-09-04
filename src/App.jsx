import React, { useState } from "react";
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

export default function App() {
  const [route, setRoute] = useState({ name: "home", params: {} });
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");

  function go(name, params = {}) {
    setRoute({ name, params });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onLogin(u) {
    setUser(u);
    showToast(`Chào mừng trở lại, ${u.name}!`);
  }

  function onLogout() {
    setUser(null);
    go("home");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  }

  const noChromePages = new Set(["login", "register", "forgotPassword"]);
  const hideChrome = noChromePages.has(route.name);

  let page;
  switch (route.name) {
    case "home":
      page = <Home go={go} />;
      break;
    case "movies":
      page = <Movies go={go} params={route.params} />;
      break;
    case "search":
      page = <Movies go={go} params={{ q: route.params.q }} />;
      break;
    case "movie":
      page = <MovieDetail go={go} params={route.params} />;
      break;
    case "showtimes":
      page = <Showtimes go={go} params={route.params} />;
      break;
    case "cinemas":
      page = <Cinemas go={go} />;
      break;
    case "seatSelect":
      page = <BookingFlow go={go} params={route.params} user={user} />;
      break;
    case "bookingSuccess":
      page = <BookingSuccess go={go} params={route.params} />;
      break;
    case "login":
      page = <Login go={go} onLogin={onLogin} params={route.params} />;
      break;
    case "register":
      page = <Register go={go} onLogin={onLogin} />;
      break;
    case "forgotPassword":
      page = <ForgotPassword go={go} />;
      break;
    case "profile":
      page = <Profile go={go} user={user} />;
      break;
    default:
      page = <Home go={go} />;
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

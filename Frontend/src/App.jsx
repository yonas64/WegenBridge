import './App.css'
import axios from "axios";

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminRegister from "./pages/AdminRegister";
import Dashboard from "./pages/Dashboard";
import MissingPersonsList from "./pages/MissingPersonsList";
import MissingPersonDetail from "./pages/MissingPersonDetail";
import ReportMissingPerson from "./pages/ReportMissingPerson";
import ReportSighting from "./pages/ReportSighting";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import About from "./pages/about";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { logError, logPageView } from "./utils/siemLogger";
//routes

function RouteLogger() {
  const location = useLocation();

  // Log page views on route change
  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);

  // Global error handlers
  useEffect(() => {
    const onError = (event) => {
      logError("window_error", event?.message, {
        filename: event?.filename,
        lineno: event?.lineno,
        colno: event?.colno,
      });
    };
    const onUnhandled = (event) => {
      const reason = event?.reason;
      logError("unhandled_rejection", reason?.message || String(reason));
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, []);

  return null;
}

function App() {
  return (
    <Router>
      <RouteLogger />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-admin" element={<AdminRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/missing-persons" element={<MissingPersonsList />} />
        <Route path="/missing-persons/:id" element={<MissingPersonDetail />} />
        <Route path="/report-missing-person" element={<ReportMissingPerson />} />
        <Route path="/report-sighting" element={<ReportSighting />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;

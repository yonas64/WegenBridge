import './App.css'
import axios from "axios";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MissingPersonsList from "./pages/MissingPersonsList";
import MissingPersonDetail from "./pages/MissingPersonDetail";
import ReportMissingPerson from "./pages/ReportMissingPerson";
import ReportSighting from "./pages/ReportSighting";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import About from "./pages/about";
//routes
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/missing-persons" element={<MissingPersonsList />} />
        <Route path="/missing-persons/:id" element={<MissingPersonDetail />} />
        <Route path="/report-missing-person" element={<ReportMissingPerson />} />
        <Route path="/report-sighting" element={<ReportSighting />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage.tsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CommunityMap from "./pages/CommunityMap";
import Reports from "./pages/Reports";
import SubmitReport from "./pages/SubmitReport";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<CommunityMap />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/submit" element={<SubmitReport />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

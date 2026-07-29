import { Bell, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="bg-white rounded-2xl px-6 py-4 flex justify-between items-center shadow-sm">

      <div className="flex items-center gap-3">

        <Search />

        <input
          placeholder="Search reports..."
          className="outline-none bg-transparent"
        />

      </div>

      <div className="flex items-center gap-5">

        <Bell />

        {user && (
          <span className="text-sm text-stone-500 hidden sm:inline">
            {user.first_name ?? user.email}
          </span>
        )}

        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full"
          alt="User avatar"
        />

        <button
          onClick={handleLogout}
          title="Log out"
          className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
        >
          <LogOut size={18} />
        </button>

      </div>

    </header>
  );
}
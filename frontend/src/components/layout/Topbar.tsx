import { Bell, Search } from "lucide-react";

export default function Topbar() {
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

        <img
          src="https://i.pravatar.cc/40"
          className="rounded-full"
          alt="User avatar"
        />

      </div>

    </header>
  );
}
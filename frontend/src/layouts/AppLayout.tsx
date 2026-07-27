import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8F2E8]">
      <Sidebar />

      <div className="flex-1 p-8 space-y-6">
        <Topbar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-[#F8F2E8]">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Topbar />

        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
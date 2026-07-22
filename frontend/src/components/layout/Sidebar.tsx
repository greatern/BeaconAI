import {
  LayoutDashboard,
  Map,
  FileText,
  PlusCircle,
  User,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Map, label: "Map", path: "/map" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: PlusCircle, label: "Submit", path: "/submit" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-[#243447] text-white p-8">

      <h1 className="text-3xl font-bold mb-12">
        Beacon AI
      </h1>

      <nav className="space-y-3">

        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-white/10"
            >
              <Icon size={20} />
              {link.label}
            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
}
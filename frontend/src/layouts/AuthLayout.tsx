import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F8F2E8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
            B
          </div>
          <span className="text-xl font-bold">Beacon AI</span>
        </Link>

        <div className="beacon-card p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

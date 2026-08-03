import { Outlet, Link } from "react-router-dom";
import { MapPin, Sparkles, Users } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-[#F8F2E8]">
      {/* Branded panel — hidden on small screens, shown from lg up */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#1E2B36] text-white flex-col justify-between p-14">
        {/* Decorative glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-teal-400/10 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-3">
<div className="flex items-center justify-center">
  <img
    src="/images/logo.png"
    alt="Beacon AI Logo"
    className="h-10 w-auto rounded-full"
  />
</div>
          <span className="text-xl font-bold">Beacon AI</span>
        </Link>

        <div className="relative">
          <span className="inline-block rounded-full bg-orange-500/15 text-orange-300 px-4 py-1.5 text-sm font-medium mb-6">
            AI-powered community intelligence
          </span>
<h2
  className="text-4xl font-bold leading-tight"
  style={{ color: "oklch(68.364% 0.14351 73.097 / 0.8)" }}
>
  See what's happening around you, before it happens.
</h2>

          <p className="mt-5 text-white/60 leading-7 max-w-md">
            Beacon AI turns citizen reports into real-time, predictive insight 
            so your community can stay one step ahead.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <p className="text-white/80">Live, geo-tagged incident reporting</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <p className="text-white/80">AI classification &amp; severity scoring</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <p className="text-white/80">Built by and for your community</p>
            </div>
          </div>
        </div>

        <p className="relative text-white/40 text-sm">
          © {new Date().getFullYear()} Beacon AI
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-3 justify-center mb-8 lg:hidden">
<div className="flex items-center justify-center">
  <img
    src="/images/logo.png"
    alt="Beacon AI Logo"
    className="h-10 w-auto"
  />
</div>
            <span className="text-xl font-bold">Beacon AI</span>
          </Link>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg shadow-black/5 border border-stone-100">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

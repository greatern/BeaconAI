import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F8F2E8]/80 border-b border-stone-200">

            <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

<div className="flex items-center justify-center">
  <img
    src="/images/logo.png"
    alt="Beacon AI Logo"
    className="h-10 w-auto rounded-full"
  />
</div>

                    <div>

                        <h1 className="text-xl font-bold">
                            Beacon AI
                        </h1>

                        <p className="text-xs">
                            Community Intelligence
                        </p>

                    </div>

                </div>

                <nav className="hidden lg:flex gap-10">

                    <a href="/home/features">Features</a>
                    <a href="/home/community">Community</a>
                    <a href="/home/map">Map</a>
                    <a href="/home/about">About</a>

                </nav>

                <div className="flex items-center gap-4">

                    <Link to="/login" className="hidden sm:inline-block font-medium hover:text-primary">
                        Log in
                    </Link>

                    <Link
                        to="/register"
                        className="bg-primary text-secondary rounded-full px-6 py-3 hover:bg-accent/90 transition"
                        style={{ color: "oklch(68.364% 0.14351 73.097 / 0.8)" }}
                    >
                        Get Started
                    </Link>

                    <button className="lg:hidden">
                        <Menu />
                    </button>

                </div>

            </div>

        </header>
    );
}
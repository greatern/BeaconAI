import { Bell, Menu } from "lucide-react";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F8F2E8]/80 border-b border-stone-200">

            <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                        B
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

                    <a href="#">Features</a>
                    <a href="#">Community</a>
                    <a href="#">Map</a>
                    <a href="#">About</a>

                </nav>

                <div className="flex items-center gap-4">

                    <button className="p-2 rounded-full hover:bg-stone-200">
                        <Bell size={18} />
                    </button>

                    <button className="bg-primary text-white rounded-full px-6 py-3">
                        Get Started
                    </button>

                    <button className="lg:hidden">
                        <Menu />
                    </button>

                </div>

            </div>

        </header>
    );
}
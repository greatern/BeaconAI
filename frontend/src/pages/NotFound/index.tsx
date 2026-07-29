import { Link } from "react-router-dom";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F2E8] px-4 text-center">
      <MapPinOff size={48} className="text-primary mb-6" />

      <h1 className="text-4xl font-bold mb-2">Page not found</h1>
      <p className="text-stone-500 mb-8 max-w-md">
        Looks like this spot isn't on the map. Let's get you back to somewhere familiar.
      </p>

      <Link
        to="/"
        className="bg-primary text-white rounded-xl px-6 py-3 font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}

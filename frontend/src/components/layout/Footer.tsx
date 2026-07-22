import {

  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E2B36] text-white">

      <div className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-4 gap-14">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-lg">
                B
              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Beacon AI
                </h2>

                <p className="text-stone-400 text-sm">
                  Community Intelligence
                </p>

              </div>

            </div>

            <p className="mt-6 text-stone-400 leading-7">
              Beacon AI empowers South Africans with
              predictive insights, community intelligence,
              and AI-driven recommendations to make
              smarter everyday decisions.
            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="font-semibold text-lg mb-6">
              Product
            </h3>

            <ul className="space-y-4 text-stone-400">

              <li>
                <a href="#">Features</a>
              </li>

              <li>
                <a href="#">Community Map</a>
              </li>

              <li>
                <a href="#">AI Predictions</a>
              </li>

              <li>
                <a href="#">Mobile App</a>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="font-semibold text-lg mb-6">
              Company
            </h3>

            <ul className="space-y-4 text-stone-400">

              <li>
                <a href="#">About</a>
              </li>

              <li>
                <a href="#">Roadmap</a>
              </li>

              <li>
                <a href="#">Privacy</a>
              </li>

              <li>
                <a href="#">Terms</a>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="font-semibold text-lg mb-6">
              Connect
            </h3>

            <div className="space-y-5 text-stone-400">

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                South Africa
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                hello@beaconai.co.za
              </div>

            </div>

            <div className="flex gap-4 mt-8">



            </div>

          </div>

        </div>

        <div className="border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row justify-between text-stone-500 text-sm">

          <p>
            © {new Date().getFullYear()} Beacon AI. All rights reserved.
          </p>

          <p>
            Built with ❤️ for South African communities.
          </p>

        </div>

      </div>

    </footer>
  );
}
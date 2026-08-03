import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto px-8 py-24">

      {/* Decorative background shape — sits behind the left column only */}
      <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 -z-10">
        <svg
          width="640"
          height="640"
          viewBox="0 0 640 640"
          className="opacity-[0.18] blur-2xl"
        >
          <path
            fill="#f97316"
            d="M453.5,309Q459,378,406,428.5Q353,479,286,466.5Q219,454,166,405.5Q113,357,131.5,283.5Q150,210,206,161.5Q262,113,332.5,133Q403,153,432,222.5Q461,292,453.5,309Z"
            transform="translate(320 320) scale(1.15) translate(-320 -320)"
          />
        </svg>
      </div>

      {/* A tighter, slightly warmer secondary glow for depth */}
      <div className="pointer-events-none absolute left-10 top-1/3 w-72 h-72 rounded-full bg-primary/10 blur-3xl -z-10" />

      <div className="grid lg:grid-cols-2 gap-20 items-center">

        <div>

          <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-primary font-medium">

            AI-powered community intelligence

          </span>

          <h1 className="text-7xl font-bold leading-[1.05] mt-8">

            Stay one step ahead

            of your community.

          </h1>

          <p className="mt-8 text-xl max-w-xl">

            Predict disruptions, receive personalised
            alerts and make better daily decisions
            with Beacon AI.

          </p>

          <div className="flex gap-5 mt-12">

            <Link
              to="/register"
              className="bg-primary text-white rounded-full px-8 py-4 flex items-center gap-2 hover:opacity-90 transition "
              style={{ color: "oklch(68.364% 0.14351 73.097 / 0.8)" }}
            >

              Launch App

              <ArrowRight size={18}/>

            </Link>

            <Link to="/login" className="border rounded-full px-8 py-4 hover:bg-white transition">

              Log In

            </Link>

          </div>

        </div>

        <DashboardPreview/>

      </div>

    </section>
  );
}
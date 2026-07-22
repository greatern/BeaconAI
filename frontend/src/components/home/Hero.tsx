import { ArrowRight } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

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

            <button className="bg-primary text-white rounded-full px-8 py-4 flex items-center gap-2">

              Launch App

              <ArrowRight size={18}/>

            </button>

            <button className="border rounded-full px-8 py-4">

              Learn More

            </button>

          </div>

        </div>

        <DashboardPreview/>

      </div>

    </section>
  );
}
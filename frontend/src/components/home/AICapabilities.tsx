import {
  BrainCircuit,
  Camera,
  BellRing,
  MapPinned,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

const capabilities = [
  {
    icon: BrainCircuit,
    title: "Predictive AI",
    description:
      "Machine learning predicts community disruptions before they escalate.",
  },
  {
    icon: Camera,
    title: "Computer Vision",
    description:
      "Analyse uploaded photos to identify potholes, flooding, fires and infrastructure damage.",
  },
  {
    icon: BellRing,
    title: "Smart Alerts",
    description:
      "Receive personalised notifications based on your home, work and travel routes.",
  },
  {
    icon: MapPinned,
    title: "Live Intelligence",
    description:
      "Visualise incidents across South Africa in real time.",
  },
  {
    icon: TrendingUp,
    title: "Risk Forecasting",
    description:
      "Understand which communities are becoming higher risk over time.",
  },
  {
    icon: ShieldAlert,
    title: "Safety Insights",
    description:
      "AI summarises what matters so you don't have to read hundreds of reports.",
  },
];

export default function AICapabilities() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-28">

      <div className="max-w-3xl">

        <p className="text-primary font-semibold uppercase tracking-wider">
          Capabilities
        </p>

        <h2 className="text-5xl font-bold mt-4">
          Intelligence built for everyday life.
        </h2>

        <p className="mt-6 text-lg">
          Beacon AI combines machine learning, computer vision and community reporting
          into one platform that helps citizens stay informed.
        </p>

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

        {capabilities.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl bg-white border border-stone-200 p-8 transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                <Icon className="text-primary" />
              </div>

              <h3 className="mt-6 text-2xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-4">
                {item.description}
              </p>
            </div>
          );
        })}

      </div>

    </section>
  );
}
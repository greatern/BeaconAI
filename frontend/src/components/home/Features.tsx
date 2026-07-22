import { Brain, MapPinned, BellRing } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Predictions",
    description:
      "Predict disruptions before they happen using machine learning.",
  },
  {
    icon: MapPinned,
    title: "Community Map",
    description:
      "See live reports and incidents happening around you.",
  },
  {
    icon: BellRing,
    title: "Smart Alerts",
    description:
      "Receive personalised notifications based on your location.",
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-24">

      <h2 className="text-4xl font-bold mb-16">
        Why Beacon?
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-3xl bg-white p-8 shadow-sm border border-stone-200 hover:-translate-y-2 transition"
            >
              <Icon size={34} className="text-primary mb-6" />

              <h3 className="text-2xl mb-4">
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>
            </div>
          );
        })}

      </div>

    </section>
  );
}
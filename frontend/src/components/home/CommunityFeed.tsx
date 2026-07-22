import {
  TriangleAlert,
  Droplets,
  TrafficCone,
  Zap,
} from "lucide-react";

const reports = [
  {
    id: 1,
    icon: Zap,
    title: "Power outage reported",
    location: "Secunda",
    time: "5 mins ago",
    risk: "High",
  },
  {
    id: 2,
    icon: Droplets,
    title: "Water leak detected",
    location: "Pretoria",
    time: "18 mins ago",
    risk: "Medium",
  },
  {
    id: 3,
    icon: TrafficCone,
    title: "Road closure",
    location: "Johannesburg",
    time: "42 mins ago",
    risk: "Medium",
  },
];

export default function CommunityFeed() {
  return (
    <section className="max-w-7xl mx-auto px-10 py-24">

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold">
          Live Community Reports
        </h2>

        <button className="text-primary font-semibold">
          View All →
        </button>
      </div>

      <div className="space-y-5">

        {reports.map((report) => {
          const Icon = report.icon;

          return (
            <div
              key={report.id}
              className="bg-white rounded-3xl p-6 shadow-sm border flex justify-between items-center"
            >
              <div className="flex gap-5 items-center">

                <div className="bg-orange-100 p-4 rounded-2xl">
                  <Icon className="text-primary" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    {report.title}
                  </h3>

                  <p>
                    {report.location} • {report.time}
                  </p>
                </div>

              </div>

              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full">
                {report.risk}
              </span>

            </div>
          );
        })}

      </div>

    </section>
  );
}
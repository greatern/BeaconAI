import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Activity, Zap, Droplets, TriangleAlert } from "lucide-react";

const hotspots = [
  {
    id: 1,
    position: [-26.2041, 28.0473],
    title: "Power Instability",
    score: 82,
    color: "#B33A3A",
  },
  {
    id: 2,
    position: [-25.7479, 28.2293],
    title: "Flood Risk",
    score: 71,
    color: "#C77F00",
  },
  {
    id: 3,
    position: [-29.8587, 31.0218],
    title: "Traffic Disruption",
    score: 54,
    color: "#5B6B3A",
  },
];

export default function CommunityMap() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-28">

      <div className="flex justify-between items-end mb-10">

        <div>

          <p className="text-primary font-semibold uppercase tracking-wider">
            Live Intelligence
          </p>

          <h2 className="text-5xl font-bold mt-3">
            Community Risk Map
          </h2>

        </div>

        <div className="hidden lg:flex gap-3">

          <Badge icon={<Zap size={16} />} text="Power" />
          <Badge icon={<Droplets size={16} />} text="Water" />
          <Badge icon={<TriangleAlert size={16} />} text="Safety" />
          <Badge icon={<Activity size={16} />} text="Traffic" />

        </div>

      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">

        <div className="overflow-hidden rounded-[32px] shadow-xl border border-stone-200">

          <MapContainer
            center={[-29, 24]}
            zoom={5}
            style={{ height: "600px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {hotspots.map((spot) => (
              <CircleMarker
                key={spot.id}
                center={spot.position as [number, number]}
                radius={16}
                pathOptions={{
                  color: spot.color,
                  fillColor: spot.color,
                  fillOpacity: 0.8,
                }}
              >
                <Popup>
                  <strong>{spot.title}</strong>
                  <br />
                  AI Risk Score: {spot.score}/100
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

        </div>

        <aside className="bg-white rounded-[32px] border border-stone-200 p-8">

          <h3 className="text-2xl font-bold">
            AI Summary
          </h3>

          <p className="mt-5">
            Johannesburg has experienced a rise in electricity-related reports over the last 24 hours.
          </p>

          <div className="mt-10 space-y-6">

            <Metric
              title="Power"
              value="High Risk"
              color="#B33A3A"
            />

            <Metric
              title="Water"
              value="Stable"
              color="#5B6B3A"
            />

            <Metric
              title="Roads"
              value="Moderate"
              color="#C77F00"
            />

            <Metric
              title="Safety"
              value="Low"
              color="#4D6A6D"
            />

          </div>

        </aside>

      </div>

    </section>
  );
}

function Badge({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white border px-4 py-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Metric({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex justify-between items-center">

      <span>{title}</span>

      <span
        className="font-semibold"
        style={{ color }}
      >
        {value}
      </span>

    </div>
  );
}
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Loader2 } from "lucide-react";

import "../../lib/leafletIcons";
import { listReports } from "../../features/reports/api";
import { CATEGORY_LABELS, STATUS_STYLES } from "../../features/reports/types";
import { resolveMediaUrl } from "../../lib/api";

const DEFAULT_CENTER: [number, number] = [-26.2041, 28.0473]; // Johannesburg

export default function CommunityMap() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports", "map"],
    queryFn: () => listReports({ limit: 500 }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community Map</h1>
          <p className="text-stone-500 mt-1">
            {data ? `${data.total} report${data.total === 1 ? "" : "s"} in your area` : "Live citizen reports"}
          </p>
        </div>
      </div>

      {isError && (
        <p className="text-danger mb-4">Couldn't load reports. Please try again shortly.</p>
      )}

      <div className="rounded-2xl overflow-hidden border border-stone-200 h-[calc(100vh-220px)] relative">
        {isLoading && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/70">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        )}

        <MapContainer center={DEFAULT_CENTER} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {data?.reports.map((report) => (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <div className="space-y-2 min-w-48">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{CATEGORY_LABELS[report.category]}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[report.status] ?? ""}`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {report.image_url && (
                    <img
                      src={resolveMediaUrl(report.image_url) ?? undefined}
                      alt={CATEGORY_LABELS[report.category]}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                  )}

                  {report.description && <p className="text-sm">{report.description}</p>}

                  {report.address && <p className="text-xs text-stone-500">{report.address}</p>}

                  <p className="text-xs text-stone-400">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

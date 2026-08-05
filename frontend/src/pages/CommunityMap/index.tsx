import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Flame, Loader2, MapPin, Sparkles, TriangleAlert } from "lucide-react";

import "../../lib/leafletIcons";
import HeatmapLayer from "../../components/map/HeatmapLayer";
import { listReports } from "../../features/reports/api";
import { CATEGORY_LABELS, STATUS_STYLES } from "../../features/reports/types";
import { resolveMediaUrl } from "../../lib/api";

const DEFAULT_CENTER: [number, number] = [-26.2041, 28.0473]; // Johannesburg

function severityStyle(score: number) {
  if (score >= 65) return "bg-danger/10 text-danger";
  if (score >= 35) return "bg-warning/10 text-warning";
  return "bg-success/10 text-success";
}

type ViewMode = "markers" | "heatmap";

export default function CommunityMap() {
  const [view, setView] = useState<ViewMode>("markers");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports", "map"],
    queryFn: () => listReports({ limit: 500 }),
  });

  const reports = data?.reports ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community Map</h1>
          <p className="text-stone-500 mt-1">
            {data ? `${data.total} report${data.total === 1 ? "" : "s"} in your area` : "Live citizen reports"}
          </p>
        </div>

        <div className="flex items-center bg-white rounded-full p-1 border border-stone-200">
          <button
            onClick={() => setView("markers")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${
              view === "markers" ? "bg-primary text-white" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <MapPin size={15} />
            Markers
          </button>

          <button
            onClick={() => setView("heatmap")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${
              view === "heatmap" ? "bg-primary text-white" : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <Flame size={15} />
            Heatmap
          </button>
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

        {view === "heatmap" && !isLoading && (
          <div className="absolute bottom-4 left-4 z-[500] bg-white/95 rounded-xl px-3 py-2 text-xs text-stone-500 shadow-sm">
            Intensity reflects report density and AI severity
          </div>
        )}

        <MapContainer center={DEFAULT_CENTER} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {view === "heatmap" ? (
            <HeatmapLayer reports={reports} />
          ) : (
            <MarkerClusterGroup chunkedLoading>
              {reports.map((report) => {
                const categoryMismatch =
                  report.ai_category !== null && report.ai_category !== report.category;

                return (
                  <Marker key={report.id} position={[report.latitude, report.longitude]}>
                    <Popup>
                      <div className="space-y-2 min-w-56">
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

                        {report.severity_score !== null && (
                          <span
                            className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${severityStyle(report.severity_score)}`}
                          >
                            Severity {Math.round(report.severity_score)}/100
                          </span>
                        )}

                        {report.description && <p className="text-sm">{report.description}</p>}

                        {report.ai_summary && (
                          <div className="flex items-start gap-1.5 text-sm bg-stone-50 rounded-lg px-2.5 py-2">
                            <Sparkles size={14} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-stone-600">{report.ai_summary}</p>
                          </div>
                        )}

                        {categoryMismatch && report.ai_category && (
                          <div className="flex items-center gap-1.5 text-xs text-warning">
                            <TriangleAlert size={13} />
                            AI detected {CATEGORY_LABELS[report.ai_category]}
                            {report.ai_confidence !== null &&
                              ` (${Math.round(report.ai_confidence * 100)}% confidence)`}
                          </div>
                        )}

                        {report.address && <p className="text-xs text-stone-500">{report.address}</p>}

                        <p className="text-xs text-stone-400">
                          {new Date(report.created_at).toLocaleString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
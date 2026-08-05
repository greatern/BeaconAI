import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

import type { Report } from "../../features/reports/types";

interface HeatmapLayerProps {
  reports: Report[];
}

/**
 * Renders a density heatmap of report locations, weighted by severity
 * so clusters of high-severity incidents glow hotter than a cluster of
 * equally-frequent but low-severity ones. Imperative (not a normal React
 * child) because leaflet.heat attaches directly to the underlying
 * Leaflet map instance rather than rendering its own DOM.
 */
export default function HeatmapLayer({ reports }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number, number][] = reports.map((report) => [
      report.latitude,
      report.longitude,
      // Normalize severity (0-100) to a 0.2-1.0 weight so even unscored
      // reports (severity_score null) still show up on the map, just faintly.
      report.severity_score !== null ? 0.2 + (report.severity_score / 100) * 0.8 : 0.3,
    ]);

    const heatLayer = L.heatLayer(points, {
      radius: 28,
      blur: 22,
      maxZoom: 16,
      gradient: {
        0.2: "#4ade80",
        0.5: "#f59e0b",
        0.8: "#f97316",
        1.0: "#dc2626",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, reports]);

  return null;
}
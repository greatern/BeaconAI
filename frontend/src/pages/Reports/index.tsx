import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Loader2, MapPin, PlusCircle, TriangleAlert } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { listReports } from "../../features/reports/api";
import {
  CATEGORY_LABELS,
  INCIDENT_CATEGORIES,
  STATUS_LABELS,
  STATUS_STYLES,
  type IncidentCategory,
} from "../../features/reports/types";
import { resolveMediaUrl } from "../../lib/api";

function severityStyle(score: number) {
  if (score >= 65) return "bg-danger/10 text-danger";
  if (score >= 35) return "bg-warning/10 text-warning";
  return "bg-success/10 text-success";
}

export default function Reports() {
  const { user } = useAuth();
  const [category, setCategory] = useState<IncidentCategory | "all">("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reports", "mine", user?.id, category],
    queryFn: () =>
      listReports({
        user_id: user?.id,
        category: category === "all" ? undefined : category,
        limit: 100,
      }),
    enabled: !!user,
  });

  const reports = data?.reports ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-stone-500 mt-1">
            {data ? `${data.total} report${data.total === 1 ? "" : "s"} submitted` : "Everything you've reported"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as IncidentCategory | "all")}
            className="rounded-xl border border-stone-200 px-4 py-2.5 outline-none focus:border-primary bg-white"
          >
            <option value="all">All categories</option>
            {INCIDENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          <Link
            to="/submit"
            className="flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5 font-medium whitespace-nowrap"
          >
            <PlusCircle size={18} />
            New Report
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-stone-400">
          <Loader2 className="animate-spin" size={28} />
        </div>
      )}

      {isError && <p className="text-danger">Couldn't load your reports. Please try again shortly.</p>}

      {!isLoading && !isError && reports.length === 0 && (
        <div className="beacon-card p-12 text-center">
          <p className="text-stone-500 mb-4">You haven't submitted any reports yet.</p>
          <Link to="/submit" className="text-primary font-medium">
            Submit your first report
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="beacon-card p-5 flex gap-4">
            {report.image_url ? (
              <img
                src={resolveMediaUrl(report.image_url) ?? undefined}
                alt={CATEGORY_LABELS[report.category]}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="text-stone-300" size={28} />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{CATEGORY_LABELS[report.category]}</h3>
                  {report.address && (
                    <p className="text-sm text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={14} />
                      {report.address}
                    </p>
                  )}
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[report.status]}`}
                >
                  {STATUS_LABELS[report.status]}
                </span>
              </div>

              {report.description && (
                <p className="text-sm text-stone-600 mt-2 line-clamp-2">{report.description}</p>
              )}

              {report.ai_summary && (
                <p className="text-sm text-stone-500 mt-2 italic">"{report.ai_summary}"</p>
              )}

              {report.ai_category !== null && report.ai_category !== report.category && (
                <div className="flex items-center gap-1.5 text-xs text-warning mt-2">
                  <TriangleAlert size={13} />
                  AI detected {CATEGORY_LABELS[report.ai_category]}
                  {report.ai_confidence !== null &&
                    ` (${Math.round(report.ai_confidence * 100)}% confidence)`}
                </div>
              )}

              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="text-stone-400">{new Date(report.created_at).toLocaleString()}</span>
                {report.severity_score !== null && (
                  <span className={`px-2 py-0.5 rounded-full font-medium ${severityStyle(report.severity_score)}`}>
                    Severity {Math.round(report.severity_score)}/100
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
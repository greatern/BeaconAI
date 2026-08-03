import { useAllReports } from "../../reports/hooks";
import { CATEGORY_LABELS } from "../../reports/types";
import type { IncidentCategory } from "../../reports/types";

export default function DailyBrief() {
  const { data, isLoading } = useAllReports();

  const reports = data?.reports ?? [];

  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const last24h = reports.filter((r) => new Date(r.created_at).getTime() >= oneDayAgo);

  const counts = last24h.reduce<Partial<Record<IncidentCategory, number>>>((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
  }, {});

  const topCategory = (Object.entries(counts) as [IncidentCategory, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const pending = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="bg-white rounded-3xl p-8">
      <h2 className="text-2xl font-bold">Community Brief</h2>

      {isLoading ? (
        <p className="mt-6 text-stone-400">Loading...</p>
      ) : (
        <div className="mt-6 space-y-3 leading-7 text-stone-700">
          <p>
            <span className="font-semibold">{last24h.length}</span> report
            {last24h.length === 1 ? "" : "s"} submitted in the last 24 hours.
          </p>

          {topCategory && (
            <p>
              Most reported issue: <span className="font-semibold">{CATEGORY_LABELS[topCategory[0]]}</span>{" "}
              ({topCategory[1]} report{topCategory[1] === 1 ? "" : "s"}).
            </p>
          )}

          <p>
            <span className="font-semibold">{pending}</span> report{pending === 1 ? "" : "s"} still
            awaiting review community-wide.
          </p>

          <p className="text-sm text-stone-400 pt-2">
            AI-generated summaries and severity scoring are coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
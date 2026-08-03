import { useAllReports } from "../../reports/hooks";
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_STYLES } from "../../reports/types";

function timeAgo(isoDate: string) {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ActivityFeed() {
  const { data, isLoading } = useAllReports();

  const recent = [...(data?.reports ?? [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return (
    <div className="bg-white rounded-3xl p-8">
      <h2 className="text-2xl font-bold">Recent Activity</h2>

      <div className="space-y-4 mt-8">
        {isLoading && <p className="text-stone-400">Loading...</p>}

        {!isLoading && recent.length === 0 && (
          <p className="text-stone-400">No reports yet — be the first to submit one.</p>
        )}

        {recent.map((report) => (
          <div key={report.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{CATEGORY_LABELS[report.category]}</p>
              {report.address && <p className="text-sm text-stone-500">{report.address}</p>}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[report.status]}`}>
                {STATUS_LABELS[report.status]}
              </span>
              <span className="text-xs text-stone-400">{timeAgo(report.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
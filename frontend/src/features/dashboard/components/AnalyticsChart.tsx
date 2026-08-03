import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

import { useAllReports } from "../../reports/hooks";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildLastSevenDays(reports: { created_at: string }[]) {
  const days: { day: string; reports: number }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const count = reports.filter((r) => {
      const created = new Date(r.created_at);
      return created >= date && created < nextDate;
    }).length;

    days.push({ day: DAY_LABELS[date.getDay()], reports: count });
  }

  return days;
}

export default function AnalyticsChart() {
  const { data, isLoading } = useAllReports();

  const chartData = buildLastSevenDays(data?.reports ?? []);

  return (
    <div className="bg-white rounded-3xl p-8 h-[420px]">
      <h2 className="text-2xl font-bold mb-8">Reports This Week</h2>

      {isLoading ? (
        <p className="text-stone-400">Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <AreaChart data={chartData}>
            <XAxis dataKey="day" />
            <Tooltip />
            <Area dataKey="reports" stroke="#243447" fill="#243447" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
import RiskCard from "./RiskCard";
import { useAllReports } from "../../reports/hooks";
import { computeHealthIndex, healthIndexLabel } from "../../reports/utils";

export default function KPIGrid() {
  const { data, isLoading } = useAllReports();

  const reports = data?.reports ?? [];

  const activeIncidents = reports.filter((r) => r.status === "pending").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const reportsThisWeek = reports.filter(
    (r) => new Date(r.created_at).getTime() >= oneWeekAgo,
  ).length;

  const healthIndex = computeHealthIndex(reports);
  const healthColour = healthIndex >= 75 ? "green" : healthIndex >= 50 ? "orange" : "red";

  const display = (value: number) => (isLoading ? "…" : String(value));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
      <RiskCard title="Total Reports" value={display(reports.length)} colour="blue" />
      <RiskCard title="Active Incidents" value={display(activeIncidents)} colour="orange" />
      <RiskCard title="Reports This Week" value={display(reportsThisWeek)} colour="blue" />
      <RiskCard title="Resolved" value={display(resolved)} colour="green" />
      <RiskCard
        title="Community Health"
        value={isLoading ? "…" : String(healthIndex)}
        subtitle={isLoading ? undefined : healthIndexLabel(healthIndex)}
        colour={healthColour}
      />
    </div>
  );
}
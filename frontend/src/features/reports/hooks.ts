import { useQuery } from "@tanstack/react-query";

import { listReports } from "./api";
import { enrichmentPollInterval } from "./utils";

/**
 * Fetches the full report set once and shares it (via the query cache)
 * across every dashboard widget that needs it — KPI counts, the weekly
 * chart, and the activity feed all key off ["reports", "all"], so this
 * only hits the network once no matter how many components use it.
 *
 * Polls every few seconds while any report in the set is still
 * awaiting AI enrichment (severity_score null), and stops polling on
 * its own once everything has landed - so KPI cards and the health
 * index update live as background enrichment finishes, without
 * polling indefinitely once there's nothing left pending.
 */
export function useAllReports() {
  return useQuery({
    queryKey: ["reports", "all"],
    queryFn: () => listReports({ limit: 500 }),
    refetchInterval: (query) => enrichmentPollInterval(query.state.data?.reports),
  });
}

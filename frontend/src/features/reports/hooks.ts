import { useQuery } from "@tanstack/react-query";

import { listReports } from "./api";

/**
 * Fetches the full report set once and shares it (via the query cache)
 * across every dashboard widget that needs it — KPI counts, the weekly
 * chart, and the activity feed all key off ["reports", "all"], so this
 * only hits the network once no matter how many components use it.
 */
export function useAllReports() {
  return useQuery({
    queryKey: ["reports", "all"],
    queryFn: () => listReports({ limit: 500 }),
  });
}
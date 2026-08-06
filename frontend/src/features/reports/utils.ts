import type { Report } from "./types";

/**
 * A composite 0-100 score summarizing how "healthy" the community
 * currently looks, based on real report data:
 *
 *   - Starts at 100 (nothing wrong).
 *   - Subtracts for the average AI severity of still-open,
 *     non-duplicate reports (pending/verified) - a handful of
 *     high-severity open issues drags this down more than many
 *     low-severity ones. Reports flagged as likely duplicates (see
 *     duplicate_of_id) are excluded here so the same incident
 *     reported five times doesn't drag the score down 5x.
 *   - Adds a small bonus for a healthy resolution rate, rewarding
 *     communities/moderators that are actively closing out reports.
 *
 * This is a transparent, rule-based heuristic (not a trained model) -
 * documented here so it's clear what's driving the number. A natural
 * next iteration once there's enough historical data would be to
 * calibrate the weights against real outcomes instead of the fixed
 * constants below.
 */
export function computeHealthIndex(reports: Report[]): number {
  if (reports.length === 0) return 100;

  const active = reports.filter(
    (r) => (r.status === "pending" || r.status === "verified") && !r.is_duplicate,
  );
  const resolved = reports.filter((r) => r.status === "resolved");

  const avgActiveSeverity =
    active.length > 0
      ? active.reduce((sum, r) => sum + (r.severity_score ?? 30), 0) / active.length
      : 0;

  const resolutionRate = resolved.length / reports.length;

  const raw = 100 - avgActiveSeverity * 0.7 + resolutionRate * 15;

  return Math.round(Math.max(0, Math.min(100, raw)));
}

export function healthIndexLabel(score: number): string {
  if (score >= 75) return "Healthy";
  if (score >= 50) return "Watch";
  return "At Risk";
}

/**
 * True while a report's AI enrichment (severity, summary, category
 * check) hasn't landed yet. Now that enrichment runs in a background
 * Celery worker instead of inline with the POST, a freshly submitted
 * report comes back with these fields null and fills in a few
 * seconds later - this flags that "still processing" window so the
 * UI can show a live indicator instead of a blank/missing state.
 *
 * severity_score is the signal to key off: it's the one field every
 * report gets from the pipeline regardless of whether an image was
 * attached, so it's null if and only if enrichment hasn't run yet.
 */
export function isEnriching(report: Report): boolean {
  return report.severity_score === null;
}

/**
 * Poll interval (ms) for report lists that may contain reports still
 * being enriched. Pass this as a query's `refetchInterval` option -
 * it turns polling off automatically once nothing in the list is
 * still pending, so we're not hammering the API forever.
 */
export function enrichmentPollInterval(reports: Report[] | undefined): number | false {
  if (!reports || reports.length === 0) return false;
  return reports.some(isEnriching) ? 3000 : false;
}
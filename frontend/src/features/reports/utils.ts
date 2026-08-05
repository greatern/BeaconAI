import type { Report } from "./types";

/**
 * A composite 0-100 score summarizing how "healthy" the community
 * currently looks, based on real report data:
 *
 *   - Starts at 100 (nothing wrong).
 *   - Subtracts for the average AI severity of still-open reports
 *     (pending/verified) - a handful of high-severity open issues
 *     drags this down more than many low-severity ones.
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

  const active = reports.filter((r) => r.status === "pending" || r.status === "verified");
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
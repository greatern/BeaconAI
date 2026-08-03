export const INCIDENT_CATEGORIES = [
  "pothole",
  "water_leak",
  "flooding",
  "fire",
  "illegal_dumping",
  "broken_traffic_light",
  "fallen_tree",
  "power_outage",
  "crime",
  "road_accident",
  "other",
] as const;

export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number];

export const REPORT_STATUSES = ["pending", "verified", "resolved", "rejected"] as const;

export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "Pending",
  verified: "Verified",
  resolved: "Resolved",
  rejected: "Rejected",
};

export const STATUS_STYLES: Record<ReportStatus, string> = {
  pending: "bg-warning/10 text-warning",
  verified: "bg-success/10 text-success",
  resolved: "bg-stone-200 text-stone-600",
  rejected: "bg-danger/10 text-danger",
};

export const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  pothole: "Pothole",
  water_leak: "Water Leak",
  flooding: "Flooding",
  fire: "Fire",
  illegal_dumping: "Illegal Dumping",
  broken_traffic_light: "Broken Traffic Light",
  fallen_tree: "Fallen Tree",
  power_outage: "Power Outage",
  crime: "Crime",
  road_accident: "Road Accident",
  other: "Other",
};

export interface Report {
  id: number;
  user_id: number;
  category: IncidentCategory;
  description: string | null;
  image_url: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  status: ReportStatus;
  ai_summary: string | null;
  severity_score: number | null;
  ai_category: IncidentCategory | null;
  ai_confidence: number | null;
  created_at: string;
}

export interface ReportListResponse {
  total: number;
  reports: Report[];
}

export interface CreateReportPayload {
  category: IncidentCategory;
  latitude: number;
  longitude: number;
  description?: string;
  address?: string;
  image?: File | null;
}

export interface ReportListFilters {
  category?: IncidentCategory;
  status?: ReportStatus;
  user_id?: number;
  min_lat?: number;
  max_lat?: number;
  min_lng?: number;
  max_lng?: number;
  limit?: number;
  offset?: number;
}


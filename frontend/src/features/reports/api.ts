import { api } from "../../lib/api";
import type {
  CreateReportPayload,
  Report,
  ReportListFilters,
  ReportListResponse,
} from "./types";

export async function createReport(payload: CreateReportPayload): Promise<Report> {
  const formData = new FormData();

  formData.append("category", payload.category);
  formData.append("latitude", String(payload.latitude));
  formData.append("longitude", String(payload.longitude));

  if (payload.description) formData.append("description", payload.description);
  if (payload.address) formData.append("address", payload.address);
  if (payload.image) formData.append("image", payload.image);

  const { data } = await api.post<Report>("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

export async function listReports(filters: ReportListFilters = {}): Promise<ReportListResponse> {
  const { data } = await api.get<ReportListResponse>("/reports", { params: filters });
  return data;
}

export async function getReport(id: number): Promise<Report> {
  const { data } = await api.get<Report>(`/reports/${id}`);
  return data;
}

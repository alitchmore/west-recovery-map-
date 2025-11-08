// API client for West Recovery Map backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Types
export type RoadAccess = "clear" | "partial" | "foot_or_bike_only" | "blocked";
export type ElectricityStatus = "mostly_restored" | "partially_restored" | "none" | "unknown";
export type WaterStatus = "pipe" | "standpipe_tank" | "trucking_only" | "none" | "unknown";
export type SignalStatus = "good" | "weak_unstable" | "none";

export interface ReportPayload {
  parish: string;
  community_name: string;
  nearest_landmark?: string;

  road_access: RoadAccess;
  electricity_status: ElectricityStatus;
  water_status: WaterStatus;
  signal_status: SignalStatus;

  households_estimated?: number | null;
  houses_no_damage?: number | null;
  houses_roof_damaged?: number | null;
  houses_roof_gone?: number | null;
  houses_destroyed?: number | null;

  needs_drinking_water?: boolean;
  needs_food?: boolean;
  needs_tarps_roofing?: boolean;
  needs_building_materials?: boolean;

  urgent_cases_text?: string;
  other_details?: string;
}

export interface CommunitySummary {
  id: number;
  parish: string;
  name: string;
  nearest_landmark: string | null;
  lat: string | null;
  lng: string | null;
  report_count: number;
  severe_houses: number;
  no_water: 0 | 1;
  no_light: 0 | 1;
  limited_access: 0 | 1;
  has_high_risk: 0 | 1;
  last_report_at: string | null;
  severity_score: number;
  severity: "low" | "moderate" | "severe";
}

// Helper to handle API errors
async function handleResponse(response: Response) {
  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const body = await response.json();
      if (body.message) {
        errorMessage = body.message;
      }
    } catch {
      // If parsing fails, use default error message
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// Submit a new report
export async function submitReport(payload: ReportPayload): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

// Fetch community summaries for admin dashboard
export async function fetchCommunitySummaries(parish?: string): Promise<CommunitySummary[]> {
  const url = new URL(`${API_BASE_URL}/admin/communities/summary`);
  if (parish) {
    url.searchParams.append("parish", parish);
  }
  const response = await fetch(url.toString());
  return handleResponse(response);
}

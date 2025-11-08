import { useState, useEffect } from "react";
import { fetchCommunitySummaries, CommunitySummary } from "@/api/client";

export default function AdminDashboardPage() {
  const [parish, setParish] = useState<string>("");
  const [data, setData] = useState<CommunitySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const summaries = await fetchCommunitySummaries(parish || undefined);
        setData(summaries);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [parish]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "text-destructive font-semibold";
      case "moderate":
        return "text-warning font-semibold";
      case "low":
        return "text-success font-medium";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            West Recovery Map – Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            View aggregated community reports and prioritize recovery efforts based on severity.
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6 bg-card rounded-lg shadow p-4">
          <label htmlFor="parish-filter" className="block text-sm font-medium text-foreground mb-2">
            Filter by Parish
          </label>
          <select
            id="parish-filter"
            value={parish}
            onChange={(e) => setParish(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Parishes</option>
            <option value="Hanover">Hanover</option>
            <option value="Westmoreland">Westmoreland</option>
            <option value="St James">St James</option>
            <option value="St Elizabeth">St Elizabeth</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-card rounded-lg shadow p-8 text-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4 mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <div className="bg-card rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Parish
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Community
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      No Water
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      No Light
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Limited Access
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Severe Houses
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Reports
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Last Report
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                        No data yet. Submit reports via the Public Report page.
                      </td>
                    </tr>
                  ) : (
                    data.map((community) => (
                      <tr key={community.id} className="hover:bg-accent/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                          {community.parish}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          <div className="font-medium">{community.name}</div>
                          {community.nearest_landmark && (
                            <div className="text-xs text-muted-foreground">{community.nearest_landmark}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className={getSeverityColor(community.severity)}>
                            {community.severity.charAt(0).toUpperCase() + community.severity.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {community.no_water ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              Yes
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {community.no_light ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              Yes
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-center">
                          {community.limited_access ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                              Yes
                            </span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-foreground">
                          {community.severe_houses}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-foreground">
                          {community.report_count}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(community.last_report_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {data.length > 0 && (
              <div className="px-4 py-3 bg-muted/50 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Severity is calculated on the backend using water, light, access, housing damage and vulnerable persons.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

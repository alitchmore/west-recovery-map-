import { CommunitySummary } from "@/api/client";
import { Users, Home, Droplet, Zap } from "lucide-react";

interface StatisticsOverviewProps {
  communities: CommunitySummary[];
}

export function StatisticsOverview({ communities }: StatisticsOverviewProps) {
  const totalCommunities = communities.length;
  const communitiesNoWater = communities.filter((c) => c.no_water === 1).length;
  const communitiesNoLight = communities.filter((c) => c.no_light === 1).length;
  const totalSevereHouses = communities.reduce((sum, c) => sum + c.severe_houses, 0);

  const percentNoWater = totalCommunities > 0 
    ? Math.round((communitiesNoWater / totalCommunities) * 100) 
    : 0;
  const percentNoLight = totalCommunities > 0 
    ? Math.round((communitiesNoLight / totalCommunities) * 100) 
    : 0;

  const lastUpdate = communities.reduce((latest, c) => {
    if (!c.last_report_at) return latest;
    const date = new Date(c.last_report_at);
    return !latest || date > latest ? date : latest;
  }, null as Date | null);

  const kpis = [
    {
      label: "Total Communities",
      value: totalCommunities,
      caption: "Reporting damage",
      bgColor: "bg-emerald-600",
      icon: Users,
    },
    {
      label: "Severe Houses",
      value: totalSevereHouses,
      caption: "Destroyed or severely damaged",
      bgColor: "bg-red-600",
      icon: Home,
    },
    {
      label: "Without Water",
      value: `${percentNoWater}%`,
      caption: `${communitiesNoWater} of ${totalCommunities} communities`,
      bgColor: "bg-sky-600",
      icon: Droplet,
    },
    {
      label: "Without Electricity",
      value: `${percentNoLight}%`,
      caption: `${communitiesNoLight} of ${totalCommunities} communities`,
      bgColor: "bg-amber-600",
      icon: Zap,
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-0">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`${kpi.bgColor} h-48 flex items-center px-6 text-white rounded-none`}
          >
            <kpi.icon className="h-12 w-12 mr-6 opacity-80 flex-shrink-0" />
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium uppercase tracking-wide opacity-90">
                {kpi.label}
              </p>
              <p className="text-5xl font-bold my-2">
                {kpi.value}
              </p>
              <p className="text-xs opacity-80">
                {kpi.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {lastUpdate && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Last updated: {lastUpdate.toLocaleString()}
        </p>
      )}
    </div>
  );
}

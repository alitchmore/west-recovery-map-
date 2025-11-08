import { CommunitySummary } from "@/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, AlertTriangle, Droplets, Zap, MapPin, Building } from "lucide-react";

interface StatisticsOverviewProps {
  communities: CommunitySummary[];
}

export function StatisticsOverview({ communities }: StatisticsOverviewProps) {
  const totalCommunities = communities.length;
  const severeCommunities = communities.filter((c) => c.severity === "severe").length;
  const communitiesNoWater = communities.filter((c) => c.no_water === 1).length;
  const communitiesNoLight = communities.filter((c) => c.no_light === 1).length;
  const communitiesLimitedAccess = communities.filter((c) => c.limited_access === 1).length;
  const totalSevereHouses = communities.reduce((sum, c) => sum + c.severe_houses, 0);

  const lastUpdate = communities.reduce((latest, c) => {
    if (!c.last_report_at) return latest;
    const date = new Date(c.last_report_at);
    return !latest || date > latest ? date : latest;
  }, null as Date | null);

  const stats = [
    {
      title: "Total Communities",
      value: totalCommunities,
      icon: MapPin,
      description: "Reporting damage",
      colorClass: "text-primary",
    },
    {
      title: "Severe Damage",
      value: severeCommunities,
      icon: AlertTriangle,
      description: "Communities with severe impact",
      colorClass: "text-destructive",
    },
    {
      title: "No Water",
      value: communitiesNoWater,
      icon: Droplets,
      description: "Communities without water",
      colorClass: "text-destructive",
    },
    {
      title: "No Electricity",
      value: communitiesNoLight,
      icon: Zap,
      description: "Communities without power",
      colorClass: "text-warning",
    },
    {
      title: "Limited Access",
      value: communitiesLimitedAccess,
      icon: Home,
      description: "Communities with road issues",
      colorClass: "text-warning",
    },
    {
      title: "Severe Houses",
      value: totalSevereHouses,
      icon: Building,
      description: "Houses destroyed or severely damaged",
      colorClass: "text-destructive",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.colorClass}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.colorClass}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {lastUpdate && (
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Last updated: {lastUpdate.toLocaleString()}
        </p>
      )}
    </div>
  );
}

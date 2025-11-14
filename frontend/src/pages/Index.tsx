import { useState, useEffect, useMemo } from "react";
import { fetchCommunitySummaries, CommunitySummary } from "@/api/client";
import { JamaicaMap } from "@/components/JamaicaMap";
import { StatisticsOverview } from "@/components/StatisticsOverview";
import { MapSkeleton } from "@/components/MapSkeleton";
import { StatisticsSkeleton } from "@/components/StatisticsSkeleton";
import { CommunityDetailDialog } from "@/components/CommunityDetailDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  FileText,
  LayoutDashboard,
  AlertTriangle,
  Search,
  List,
  Map,
  Info,
} from "lucide-react";

const PARISHES = ["all", "Hanover", "Westmoreland", "St James", "St Elizabeth"];

interface IndexProps {
  onNavigate: (view: "public" | "admin") => void;
}

type Sev = "severe" | "moderate" | "low";

/* =========================
   Research Panel–style HOW IT WORKS
   ========================= */
const HOW_STEPS = [
  {
    num: "01",
    title: "Report what you’re seeing",
    copy:
      "Share community damage, blocked roads, water/electricity status, and photos. Clear locations help responders act faster.",
    img: "/illustrations/how-report.png", // ⬅ replace with your asset
  },
  {
    num: "02",
    title: "We verify and tag severity",
    copy:
      "Coordinators review submissions, confirm key details, and apply a severity level so teams can prioritize safely.",
    img: "/illustrations/how-verify.png", // ⬅ replace with your asset
  },
  {
    num: "03",
    title: "Relief teams respond",
    copy:
      "Live data guides the routing of supplies and crews. Updates show progress and remaining gaps.",
    img: "/illustrations/how-respond.png", // ⬅ replace with your asset
  },
];

function HowItWorks({
  onNavigate,
}: {
  onNavigate: (v: "public" | "admin") => void;
}) {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
        <p className="text-muted-foreground">
          A simple flow: report → verify → respond. Clear data, faster help.
        </p>
      </div>

      {/* Alternating rows */}
      <div className="mt-10 space-y-10">
        {HOW_STEPS.map((s, i) => (
          <div
            key={s.num}
            className="grid md:grid-cols-2 gap-8 items-center border-t border-border pt-10 first:pt-0 first:border-t-0"
          >
            {/* Text */}
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <div className="text-5xl md:text-6xl font-extrabold tracking-tight leading-none">
                {s.num}
              </div>
              <h3 className="mt-3 text-xl md:text-2xl font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm md:text-base text-muted-foreground">{s.copy}</p>
            </div>

            {/* Visual */}
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              {s.img ? (
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="aspect-[4/3] bg-muted border border-border" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA band */}
      <div className="mt-12 border border-border bg-primary/5 px-6 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-between">
          <p className="text-lg md:text-xl font-semibold text-center md:text-left">
            Great responses don’t happen by accident. Let’s make them happen.
          </p>
          <div className="flex gap-3">
            <Button size="lg" onClick={() => onNavigate("public")}>
              Submit a report
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate("admin")}>
              Coordinator login
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const Index = ({ onNavigate }: IndexProps) => {
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParish, setSelectedParish] = useState<string>("all");
  const [selectedSeverities, setSelectedSeverities] = useState<Set<Sev>>(
    new Set(["severe", "moderate", "low"])
  );
  const [selectedCommunity, setSelectedCommunity] =
    useState<CommunitySummary | null>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCommunitySummaries(
          selectedParish === "all" ? undefined : selectedParish
        );
        setCommunities(data);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedParish]);

  const toggleSeverity = (severity: Sev) => {
    setSelectedSeverities((prev) => {
      const next = new Set(prev);
      next.has(severity) ? next.delete(severity) : next.add(severity);
      return next;
    });
  };

  const filteredCommunities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return communities.filter((c) => {
      const sevOk = selectedSeverities.has(c.severity as Sev);
      const qOk =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        // @ts-ignore (parish is commonly present on CommunitySummary)
        (c.parish && String(c.parish).toLowerCase().includes(q));
      return sevOk && qOk;
    });
  }, [communities, selectedSeverities, search]);

  const severityCounts = useMemo(
    () => ({
      severe: communities.filter((c) => c.severity === "severe").length,
      moderate: communities.filter((c) => c.severity === "moderate").length,
      low: communities.filter((c) => c.severity === "low").length,
    }),
    [communities]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero / Status */}
      <section className="relative border-b border-border bg-gradient-to-r from-primary/10 via-background to-primary/10">
        {/* Full-width advisory bar */}
        <div className="w-full bg-amber-50 text-amber-950 border-b border-amber-200">
          <div className="container mx-auto px-4 py-2 text-sm flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">
              Hurricane Relief Coordination — Hurricane Update
            </span>
            {lastUpdated && (
              <span className="text-amber-900/80">
                · Last updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              West Recovery Map
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time damage and access updates for Jamaica’s western parishes
              following <span className="font-semibold">the recent hurricane</span>.
              Help responders reach those most in need.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button size="lg" onClick={() => onNavigate("public")} className="gap-2">
                <FileText className="h-5 w-5" />
                Submit Community Report
              </Button>
              <Button
                size="lg"
                variant="link"
                onClick={() => onNavigate("admin")}
                className="gap-2"
              >
                <LayoutDashboard className="h-5 w-5" />
                Coordinator login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map + List Section */}
      <section id="map" className="container mx-auto px-4 py-10 md:py-14">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  Interactive Damage Map
                </h2>
                <p className="text-muted-foreground mt-1">
                  Click markers to view community details and severity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 w-[240px]"
                    placeholder="Find a community…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <Select value={selectedParish} onValueChange={setSelectedParish}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Parishes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Parishes</SelectItem>
                    {PARISHES.slice(1).map((parish) => (
                      <SelectItem key={parish} value={parish}>
                        {parish}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Tabs
                  value={viewMode}
                  onValueChange={(v) => setViewMode(v as "map" | "list")}
                >
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="map" className="gap-1">
                      <Map className="h-4 w-4" /> Map
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-1">
                      <List className="h-4 w-4" /> List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Legend & severity chips */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 px-3 py-2 border border-border bg-card">
                <span className="text-sm font-medium">Severity key</span>
                <span className="flex items-center gap-1 text-sm">
                  <span className="inline-block h-3 w-3 rounded-full bg-red-500" /> Severe
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <span className="inline-block h-3 w-3 rounded-full bg-yellow-500" /> Moderate
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <span className="inline-block h-3 w-3 rounded-full bg-green-500" /> Low
                </span>
              </div>

              <span className="text-sm text-muted-foreground ml-1">Filter:</span>
              <Badge
                variant={selectedSeverities.has("severe") ? "destructive" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSeverity("severe")}
              >
                Severe ({severityCounts.severe})
              </Badge>
              <Badge
                variant={selectedSeverities.has("moderate") ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSeverity("moderate")}
              >
                Moderate ({severityCounts.moderate})
              </Badge>
              <Badge
                variant={selectedSeverities.has("low") ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSeverity("low")}
              >
                Low ({severityCounts.low})
              </Badge>
            </div>
          </div>

          {loading ? (
            <MapSkeleton />
          ) : error ? (
            <div className="w-full h-[60vh] md:h-[70vh] border border-destructive bg-destructive/5 grid place-items-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredCommunities.length === 0 ? (
            <div className="w-full h-[60vh] md:h-[70vh] border border-border bg-muted/20 grid place-items-center">
              <p className="text-muted-foreground">No communities match the selected filters.</p>
            </div>
          ) : (
            <>
              <Tabs value={viewMode}>
                <TabsContent value="map">
                  <JamaicaMap
                    communities={filteredCommunities}
                    selectedParish={selectedParish === "all" ? undefined : selectedParish}
                    onCommunityClick={setSelectedCommunity}
                  />
                </TabsContent>
                <TabsContent value="list">
                  <div className="overflow-x-auto border border-border bg-card">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3">Community</th>
                          <th className="text-left p-3">Parish</th>
                          <th className="text-left p-3">Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCommunities.map((c) => (
                          <tr
                            key={c.id ?? `${c.name}-${c.severity}`}
                            className="border-t border-border hover:bg-muted/40 cursor-pointer"
                            onClick={() => setSelectedCommunity(c)}
                          >
                            <td className="p-3">{c.name}</td>
                            {/* @ts-ignore parish typically available */}
                            <td className="p-3">{c.parish ?? "—"}</td>
                            <td className="p-3 capitalize">{c.severity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>

              {lastUpdated && (
                <p className="text-xs text-muted-foreground">
                  Snapshot includes {communities.length} reporting communities • Last updated{" "}
                  {lastUpdated.toLocaleString()}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold">Impact Overview</h2>
              <p className="text-muted-foreground mt-2">
                Snapshot of reported impact across western parishes — updated periodically.
              </p>
            </div>

            {loading ? (
              <StatisticsSkeleton />
            ) : error ? (
              <p className="text-center text-destructive">{error}</p>
            ) : (
              <StatisticsOverview communities={communities} />
            )}

            <p className="text-center text-xs text-muted-foreground flex items-center gap-1 justify-center">
              <Info className="h-3.5 w-3.5" />
              Based on community submissions and coordinator verification • © OpenStreetMap contributors &amp; Leaflet
            </p>
          </div>
        </div>
      </section>

      {/* NEW: Research Panel–style How It Works */}
      <HowItWorks onNavigate={onNavigate} />

      {/* Partners */}
      <section className="bg-muted/20 border-t border-border">
        <div className="container mx-auto px-4 py-10">
          <div className="text-center mb-6">
            <h3 className="font-semibold">Partnering with</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            <div className="h-12 bg-card border border-border grid place-items-center text-xs text-muted-foreground">ODPEM</div>
            <div className="h-12 bg-card border border-border grid place-items-center text-xs text-muted-foreground">UWI</div>
            <div className="h-12 bg-card border border-border grid place-items-center text-xs text-muted-foreground">MoLG</div>
            <div className="h-12 bg-card border border-border grid place-items-center text-xs text-muted-foreground">NWC</div>
            <div className="h-12 bg-card border border-border grid place-items-center text-xs text-muted-foreground">JPS</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">FAQs</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>Who can submit reports?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Any community member. Please include a clear location and optional photos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>How is data verified?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Coordinators review reports and tag severity; verified items are highlighted on the map.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How often is the map updated?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                As new reports are received and verified. The banner shows the last refresh time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Will my information be public?</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                We display community-level information only. Personal details are not shared publicly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Community Detail Dialog */}
      <CommunityDetailDialog
        community={selectedCommunity}
        open={!!selectedCommunity}
        onOpenChange={(open) => {
          if (!open) setSelectedCommunity(null);
        }}
      />
    </div>
  );
};

export default Index;


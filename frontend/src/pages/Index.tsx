import { useState, useEffect } from "react";
import { fetchCommunitySummaries, CommunitySummary } from "@/api/client";
import { JamaicaMap } from "@/components/JamaicaMap";
import { StatisticsOverview } from "@/components/StatisticsOverview";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, FileText, LayoutDashboard, AlertTriangle } from "lucide-react";

const PARISHES = ["", "Hanover", "Westmoreland", "St James", "St Elizabeth"];

interface IndexProps {
  onNavigate: (view: "public" | "admin") => void;
}

const Index = ({ onNavigate }: IndexProps) => {
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedParish, setSelectedParish] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCommunitySummaries(selectedParish || undefined);
        setCommunities(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedParish]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 via-background to-primary/10 border-b border-border">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-4">
              <AlertTriangle className="h-4 w-4" />
              Hurricane Relief Coordination
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              West Recovery Map
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time community damage assessment for Jamaica's western parishes affected by the recent hurricane
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => onNavigate("public")} className="gap-2">
                <FileText className="h-5 w-5" />
                Submit Community Report
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate("admin")} className="gap-2">
                <LayoutDashboard className="h-5 w-5" />
                View Admin Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Interactive Damage Map
              </h2>
              <p className="text-muted-foreground mt-1">
                Click markers to view community details and severity
              </p>
            </div>
            
            <Select value={selectedParish} onValueChange={setSelectedParish}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Parishes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Parishes</SelectItem>
                {PARISHES.slice(1).map((parish) => (
                  <SelectItem key={parish} value={parish}>
                    {parish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="w-full h-[60vh] md:h-[70vh] rounded-lg border border-border bg-muted/20 flex items-center justify-center">
              <p className="text-muted-foreground">Loading map data...</p>
            </div>
          ) : error ? (
            <div className="w-full h-[60vh] md:h-[70vh] rounded-lg border border-destructive bg-destructive/5 flex items-center justify-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <JamaicaMap communities={communities} selectedParish={selectedParish} />
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
                Aggregated statistics across all reporting communities
              </p>
            </div>
            
            {loading ? (
              <p className="text-center text-muted-foreground">Loading statistics...</p>
            ) : error ? (
              <p className="text-center text-destructive">{error}</p>
            ) : (
              <StatisticsOverview communities={communities} />
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">
              This platform helps coordinate hurricane relief efforts by collecting and visualizing community damage reports
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <h3 className="font-semibold text-lg">For Community Members</h3>
              <p className="text-sm text-muted-foreground">
                Submit reports about your community's damage, needs, and urgent cases. Your information helps relief coordinators prioritize assistance.
              </p>
              <Button onClick={() => onNavigate("public")} className="mt-4 w-full">
                Submit Report
              </Button>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-2">
              <h3 className="font-semibold text-lg">For Relief Coordinators</h3>
              <p className="text-sm text-muted-foreground">
                Access detailed dashboard with sortable community data, severity ratings, and resource needs to optimize relief distribution.
              </p>
              <Button onClick={() => onNavigate("admin")} variant="outline" className="mt-4 w-full">
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

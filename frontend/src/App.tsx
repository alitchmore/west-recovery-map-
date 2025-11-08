import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import PublicReportPage from "./pages/PublicReportPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

const App = () => {
  const [view, setView] = useState<"landing" | "public" | "admin">("landing");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setView("landing")}
                  className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
                >
                  West Recovery Map
                </button>
                <nav className="flex gap-2">
                  <Button
                    variant={view === "landing" ? "default" : "ghost"}
                    onClick={() => setView("landing")}
                    size="sm"
                  >
                    Home
                  </Button>
                  <Button
                    variant={view === "public" ? "default" : "ghost"}
                    onClick={() => setView("public")}
                    size="sm"
                  >
                    Report
                  </Button>
                  <Button
                    variant={view === "admin" ? "default" : "ghost"}
                    onClick={() => setView("admin")}
                    size="sm"
                  >
                    Dashboard
                  </Button>
                </nav>
              </div>
            </div>
          </header>

          <main>
            {view === "landing" && <Index onNavigate={setView} />}
            {view === "public" && <PublicReportPage />}
            {view === "admin" && <AdminDashboardPage />}
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

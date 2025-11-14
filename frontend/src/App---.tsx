import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import PublicReportPage from "./pages/PublicReportPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { Button } from "./components/ui/button";
import { Home, ClipboardEdit, LayoutDashboard } from "lucide-react";

// React 19 upgrade - rebuild trigger
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
                  className="flex items-center gap-2 text-2xl font-bold text-foreground hover:text-primary transition-colors"
                >
                  <img
                    src="/logo.png"
                    alt="West Recovery Map Logo"
                    className="h-8 w-8"
                  />
                  West Recovery Map
                </button>
                <nav className="flex gap-6">
                  <button
                    onClick={() => setView("landing")}
                    className={`px-2 py-1 text-sm font-medium relative inline-flex items-center gap-2 ${
                      view === "landing"
                        ? "text-green-500"
                        : "text-muted-foreground hover:text-green-500"
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                    {view === "landing" && (
                      <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-green-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setView("public")}
                    className={`px-2 py-1 text-sm font-medium relative inline-flex items-center gap-2 ${
                      view === "public"
                        ? "text-green-500"
                        : "text-muted-foreground hover:text-green-500"
                    }`}
                  >
                    <ClipboardEdit className="h-4 w-4" />
                    <span>Report</span>
                    {view === "public" && (
                      <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-green-500" />
                    )}
                  </button>
                  <button
                    onClick={() => setView("admin")}
                    className={`px-2 py-1 text-sm font-medium relative inline-flex items-center gap-2 ${
                      view === "admin"
                        ? "text-green-500"
                        : "text-muted-foreground hover:text-green-500"
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                    {view === "admin" && (
                      <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-green-500" />
                    )}
                  </button>
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

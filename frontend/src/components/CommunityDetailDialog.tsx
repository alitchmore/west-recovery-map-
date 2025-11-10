import { CommunitySummary } from "@/api/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Droplet,
  Zap,
  Home,
  AlertTriangle,
  Clock,
  FileText,
  Navigation,
} from "lucide-react";

interface CommunityDetailDialogProps {
  community: CommunitySummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "severe":
      return "destructive";
    case "moderate":
      return "default";
    case "low":
      return "secondary";
    default:
      return "outline";
  }
};

export const CommunityDetailDialog = ({
  community,
  open,
  onOpenChange,
}: CommunityDetailDialogProps) => {
  return (
    <Dialog open={open && !!community} onOpenChange={onOpenChange}>
      {community && (
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {community.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Navigation className="h-4 w-4" />
                {community.parish}
                {community.lat && community.lng && (
                  <> • {parseFloat(community.lat).toFixed(4)}, {parseFloat(community.lng).toFixed(4)}</>
                )}
              </DialogDescription>
              {community.nearest_landmark && (
                <p className="text-sm text-muted-foreground mt-1">
                  Near: {community.nearest_landmark}
                </p>
              )}
            </div>
            <Badge variant={getSeverityColor(community.severity)}>
              {community.severity.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Indicators */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Status Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Severe Houses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-destructive">{community.severe_houses}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Reports Submitted
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{community.report_count}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Infrastructure Issues */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Infrastructure Issues
            </h3>
            <div className="space-y-2">
              {community.no_water === 1 && (
                <Card className="border-destructive/50">
                  <CardContent className="py-3 flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">No Water Supply</span>
                  </CardContent>
                </Card>
              )}
              
              {community.no_light === 1 && (
                <Card className="border-destructive/50">
                  <CardContent className="py-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-destructive" />
                    <span className="font-medium text-destructive">No Electricity</span>
                  </CardContent>
                </Card>
              )}
              
              {community.limited_access === 1 && (
                <Card className="border-warning/50">
                  <CardContent className="py-3 flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-warning" />
                    <span className="font-medium text-warning">Limited Road Access</span>
                  </CardContent>
                </Card>
              )}

              {community.no_water === 0 && community.no_light === 0 && community.limited_access === 0 && (
                <p className="text-sm text-muted-foreground">No major infrastructure issues reported</p>
              )}
            </div>
          </div>

          {/* High Risk Cases */}
          {community.has_high_risk === 1 && (
            <Card className="border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  High Risk Situations Reported
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">This community has reported urgent cases requiring immediate attention.</p>
              </CardContent>
            </Card>
          )}

          {/* Severity Score */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Severity Assessment</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Severity Score</span>
                  <span className="text-2xl font-bold">{community.severity_score.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${(community.severity_score / 10) * 100}%`,
                      backgroundColor: community.severity === "severe" 
                        ? "hsl(var(--destructive))" 
                        : community.severity === "moderate"
                        ? "hsl(var(--warning))"
                        : "hsl(var(--success))"
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Info */}
          {community.last_report_at && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border">
              <Clock className="h-4 w-4" />
              <span>Last report: {new Date(community.last_report_at).toLocaleString()}</span>
            </div>
          )}
        </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

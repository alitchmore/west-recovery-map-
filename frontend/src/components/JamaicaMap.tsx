import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { CommunitySummary } from "@/api/client";
import "leaflet/dist/leaflet.css";
import { MapLegend } from "./MapLegend";

interface JamaicaMapProps {
  communities: CommunitySummary[];
  selectedParish?: string;
  onCommunityClick?: (community: CommunitySummary) => void;
}

const JAMAICA_CENTER: [number, number] = [18.1096, -77.2975];
const JAMAICA_ZOOM = 9;

const getSeverityColor = (severity: "low" | "moderate" | "severe"): string => {
  switch (severity) {
    case "severe":
      return "hsl(var(--destructive))";
    case "moderate":
      return "hsl(var(--warning))";
    case "low":
      return "hsl(var(--success))";
    default:
      return "hsl(var(--muted))";
  }
};

function MapUpdater({ communities }: { communities: CommunitySummary[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (communities.length > 0) {
      const validCoords = communities.filter(c => c.lat && c.lng);
      if (validCoords.length > 0) {
        const bounds = validCoords.map(c => [parseFloat(c.lat!), parseFloat(c.lng!)] as [number, number]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
      }
    }
  }, [communities, map]);

  return null;
}

export function JamaicaMap({ communities, selectedParish, onCommunityClick }: JamaicaMapProps) {
  const filteredCommunities = selectedParish
    ? communities.filter((c) => c.parish === selectedParish)
    : communities;

  const communitiesWithCoords = filteredCommunities.filter(
    (c) => c.lat && c.lng
  );

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden border border-border shadow-lg">
      <MapContainer
        center={JAMAICA_CENTER}
        zoom={JAMAICA_ZOOM}
        className="w-full h-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater communities={communitiesWithCoords} />

        {communitiesWithCoords.map((community) => (
          <CircleMarker
            key={community.id}
            center={[parseFloat(community.lat!), parseFloat(community.lng!)]}
            radius={Math.max(8, Math.min(20, community.severe_houses / 2))}
            pathOptions={{
              fillColor: getSeverityColor(community.severity),
              color: getSeverityColor(community.severity),
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.6,
            }}
            eventHandlers={{
              click: () => onCommunityClick?.(community),
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold text-base mb-2">{community.name}</h3>
                <p className="text-muted-foreground mb-1">{community.parish}</p>
                {community.nearest_landmark && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Near: {community.nearest_landmark}
                  </p>
                )}
                <div className="space-y-1 mt-2">
                  <p className="font-semibold capitalize">
                    Severity: <span style={{ color: getSeverityColor(community.severity) }}>
                      {community.severity}
                    </span>
                  </p>
                  <p>Severe Houses: <span className="font-medium">{community.severe_houses}</span></p>
                  <p>Reports: <span className="font-medium">{community.report_count}</span></p>
                  {community.no_water === 1 && (
                    <p className="text-destructive font-medium">⚠️ No Water</p>
                  )}
                  {community.no_light === 1 && (
                    <p className="text-destructive font-medium">⚠️ No Electricity</p>
                  )}
                  {community.limited_access === 1 && (
                    <p className="text-warning font-medium">⚠️ Limited Access</p>
                  )}
                  {community.last_report_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last report: {new Date(community.last_report_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onCommunityClick?.(community)}
                  className="mt-3 w-full px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded hover:bg-primary/90 transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        <MapLegend />
      </MapContainer>
    </div>
  );
}

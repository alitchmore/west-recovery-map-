export function MapLegend() {
  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control bg-card border border-border rounded-lg shadow-lg p-3 m-4">
        <h4 className="font-semibold text-sm mb-2">Severity</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(var(--destructive))" }}></div>
            <span className="text-xs">Severe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(var(--warning))" }}></div>
            <span className="text-xs">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "hsl(var(--success))" }}></div>
            <span className="text-xs">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}

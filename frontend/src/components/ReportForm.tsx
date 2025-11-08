import { useState, FormEvent, ChangeEvent } from "react";
import { submitReport, ReportPayload } from "@/api/client";

const initialForm: ReportPayload = {
  parish: "",
  community_name: "",
  nearest_landmark: "",
  road_access: "clear",
  electricity_status: "unknown",
  water_status: "unknown",
  signal_status: "good",
  households_estimated: null,
  houses_no_damage: null,
  houses_roof_damaged: null,
  houses_roof_gone: null,
  houses_destroyed: null,
  needs_drinking_water: false,
  needs_food: false,
  needs_tarps_roofing: false,
  needs_building_materials: false,
  urgent_cases_text: "",
  other_details: "",
};

export default function ReportForm() {
  const [form, setForm] = useState<ReportPayload>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      const numValue = value === "" ? null : Number(value);
      setForm((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitReport(form);
      setSuccess(true);
      setForm(initialForm);
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-card rounded-lg shadow-md p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Community Damage Report</h2>
        <p className="text-sm text-muted-foreground">
          Please provide information about your community's current situation.
        </p>
      </div>

      {success && (
        <div className="bg-success/10 border border-success text-success-foreground rounded-md p-4">
          <p className="font-medium">Report submitted successfully!</p>
          <p className="text-sm mt-1">Thank you for helping us coordinate recovery efforts.</p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-md p-4">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Location Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Location</h3>
        
        <div>
          <label htmlFor="parish" className="block text-sm font-medium text-foreground mb-1">
            Parish <span className="text-destructive">*</span>
          </label>
          <select
            id="parish"
            name="parish"
            value={form.parish}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select parish</option>
            <option value="Hanover">Hanover</option>
            <option value="Westmoreland">Westmoreland</option>
            <option value="St James">St James</option>
            <option value="St Elizabeth">St Elizabeth</option>
          </select>
        </div>

        <div>
          <label htmlFor="community_name" className="block text-sm font-medium text-foreground mb-1">
            Community / District <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="community_name"
            name="community_name"
            value={form.community_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., Green Island"
          />
        </div>

        <div>
          <label htmlFor="nearest_landmark" className="block text-sm font-medium text-foreground mb-1">
            Nearest Landmark
          </label>
          <input
            type="text"
            id="nearest_landmark"
            name="nearest_landmark"
            value={form.nearest_landmark}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., Near the primary school"
          />
          <p className="text-xs text-muted-foreground mt-1">Optional but helpful for locating the community</p>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Infrastructure Status</h3>

        <div>
          <label htmlFor="road_access" className="block text-sm font-medium text-foreground mb-1">
            Road Access <span className="text-destructive">*</span>
          </label>
          <select
            id="road_access"
            name="road_access"
            value={form.road_access}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="clear">Clear</option>
            <option value="partial">Partial (vehicles with caution)</option>
            <option value="foot_or_bike_only">Foot or bike only</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <div>
          <label htmlFor="signal_status" className="block text-sm font-medium text-foreground mb-1">
            Mobile Signal / Data <span className="text-destructive">*</span>
          </label>
          <select
            id="signal_status"
            name="signal_status"
            value={form.signal_status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="good">Good</option>
            <option value="weak_unstable">Weak / Unstable</option>
            <option value="none">None</option>
          </select>
        </div>

        <div>
          <label htmlFor="electricity_status" className="block text-sm font-medium text-foreground mb-1">
            Electricity Status <span className="text-destructive">*</span>
          </label>
          <select
            id="electricity_status"
            name="electricity_status"
            value={form.electricity_status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="mostly_restored">Mostly restored</option>
            <option value="partially_restored">Partially restored</option>
            <option value="none">None</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label htmlFor="water_status" className="block text-sm font-medium text-foreground mb-1">
            Water Status <span className="text-destructive">*</span>
          </label>
          <select
            id="water_status"
            name="water_status"
            value={form.water_status}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="pipe">Pipe water available</option>
            <option value="standpipe_tank">Standpipe / tank only</option>
            <option value="trucking_only">Trucking only</option>
            <option value="none">None</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label htmlFor="households_estimated" className="block text-sm font-medium text-foreground mb-1">
            Approximate Number of Households
          </label>
          <input
            type="number"
            id="households_estimated"
            name="households_estimated"
            value={form.households_estimated ?? ""}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Estimate if exact number unknown"
          />
        </div>
      </div>

      {/* Housing Damage */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Housing Damage</h3>
        <p className="text-sm text-muted-foreground">Estimate the number of houses in each category</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="houses_no_damage" className="block text-sm font-medium text-foreground mb-1">
              No Damage
            </label>
            <input
              type="number"
              id="houses_no_damage"
              name="houses_no_damage"
              value={form.houses_no_damage ?? ""}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="houses_roof_damaged" className="block text-sm font-medium text-foreground mb-1">
              Roof Damaged
            </label>
            <input
              type="number"
              id="houses_roof_damaged"
              name="houses_roof_damaged"
              value={form.houses_roof_damaged ?? ""}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="houses_roof_gone" className="block text-sm font-medium text-foreground mb-1">
              Roof Gone
            </label>
            <input
              type="number"
              id="houses_roof_gone"
              name="houses_roof_gone"
              value={form.houses_roof_gone ?? ""}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="houses_destroyed" className="block text-sm font-medium text-foreground mb-1">
              Destroyed
            </label>
            <input
              type="number"
              id="houses_destroyed"
              name="houses_destroyed"
              value={form.houses_destroyed ?? ""}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Urgent Needs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Urgent Needs</h3>
        <p className="text-sm text-muted-foreground">Select all that apply</p>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="needs_drinking_water"
              checked={form.needs_drinking_water}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Drinking water</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="needs_food"
              checked={form.needs_food}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Food</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="needs_tarps_roofing"
              checked={form.needs_tarps_roofing}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Tarpaulins / Roofing materials</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="needs_building_materials"
              checked={form.needs_building_materials}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Building materials</span>
          </label>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>

        <div>
          <label htmlFor="urgent_cases_text" className="block text-sm font-medium text-foreground mb-1">
            Urgent Individual Cases
          </label>
          <textarea
            id="urgent_cases_text"
            name="urgent_cases_text"
            value={form.urgent_cases_text}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="Describe any urgent cases requiring immediate attention (elderly, disabled, medical needs, etc.)"
          />
        </div>

        <div>
          <label htmlFor="other_details" className="block text-sm font-medium text-foreground mb-1">
            Other Details
          </label>
          <textarea
            id="other_details"
            name="other_details"
            value={form.other_details}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            placeholder="Any other information the authorities should know"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground font-medium py-3 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}

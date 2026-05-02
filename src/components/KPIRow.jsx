export default function KPIRow({ plan, tsp, knap }) {
    const items = [
        {
            label: "Total Distance",
            value: tsp?.two_opt?.distance_km ?? plan?.summary?.total_distance_km ?? "—",
            unit: "km",
            tone: "primary",
            testid: "kpi-distance",
        },
        {
            label: "Value Loaded",
            value: knap?.dp?.total_value ?? plan?.summary?.total_value_loaded ?? "—",
            unit: "pts",
            tone: "success",
            testid: "kpi-value",
        },
        {
            label: "Weight Loaded",
            value: knap?.dp?.total_weight ?? plan?.summary?.total_weight_loaded_kg ?? "—",
            unit: "kg",
            tone: "default",
            testid: "kpi-weight",
        },
        {
            label: "Utilization",
            value: knap?.dp?.utilization_pct ?? plan?.summary?.capacity_utilization_pct ?? "—",
            unit: "%",
            tone: "default",
            testid: "kpi-utilization",
        },
        {
            label: "Hospitals Served",
            value: tsp ? tsp.nodes.length - 1 : plan?.summary?.hospitals_served ?? "—",
            unit: "",
            tone: "default",
            testid: "kpi-hospitals",
        },
        {
            label: "2-opt Improvement",
            value: tsp?.two_opt?.improvement_pct ?? "—",
            unit: "%",
            tone: "primary",
            testid: "kpi-improvement",
        },
    ];
    return (
        <div className="grid grid-cols-3 md:grid-cols-6 border-b border-slate-200 bg-white">
            {items.map((k) => (
                <div
                    key={k.label}
                    className="px-5 py-4 border-r border-slate-200 last:border-r-0 flex flex-col gap-1"
                    data-testid={k.testid}
                >
                    <div className="overline">{k.label}</div>
                    <div
                        className={`font-mono font-semibold text-2xl leading-tight ${
                            k.tone === "primary"
                                ? "text-[color:var(--mr-primary)]"
                                : k.tone === "success"
                                  ? "text-[color:var(--mr-success)]"
                                  : "text-slate-900"
                        }`}
                    >
                        {k.value}
                        <span className="text-xs text-slate-500 ml-1">{k.unit}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

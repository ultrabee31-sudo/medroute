export default function TSPPanel({ tsp }) {
    if (!tsp) {
        return (
            <div className="p-6 text-sm text-slate-500" data-testid="tsp-empty">
                <div className="overline mb-2">TSP Output</div>
                Run the optimizer to view the nearest-neighbor baseline, 2-opt refinement, and
                (optionally) the brute-force optimum.
            </div>
        );
    }
    const order = tsp.two_opt.tour.map((idx) => tsp.nodes[idx]);
    return (
        <div className="p-4 space-y-4" data-testid="tsp-panel">
            <div className="grid grid-cols-2 gap-0 border border-slate-200">
                <Stat label="NN Distance" value={`${tsp.nearest_neighbor.distance_km} km`} />
                <Stat label="NN Time" value={`${tsp.nearest_neighbor.time_ms.toFixed(2)} ms`} />
                <Stat
                    label="2-opt Distance"
                    value={`${tsp.two_opt.distance_km} km`}
                    primary
                />
                <Stat label="2-opt Time" value={`${tsp.two_opt.time_ms.toFixed(2)} ms`} />
                <Stat label="Improvement" value={`${tsp.two_opt.improvement_pct}%`} success />
                <Stat label="Swaps" value={tsp.two_opt.iterations.length} />
            </div>

            {tsp.brute_force && !tsp.brute_force.skipped && (
                <div className="border border-slate-200 p-3 bg-slate-50">
                    <div className="overline mb-1">Brute Force (Exact)</div>
                    <div className="flex flex-wrap gap-4 font-mono text-xs">
                        <span>Dist: {tsp.brute_force.distance_km} km</span>
                        <span>Time: {tsp.brute_force.time_ms.toFixed(2)} ms</span>
                        <span>Gap: {tsp.brute_force.optimality_gap_pct}%</span>
                    </div>
                </div>
            )}
            {tsp.brute_force?.skipped && (
                <div className="border border-slate-200 p-3 bg-slate-50 text-xs text-slate-600 font-mono">
                    Brute force skipped: {tsp.brute_force.reason}
                </div>
            )}

            <div>
                <div className="overline mb-2">Optimal Route</div>
                <ol className="space-y-1">
                    {order.map((n, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-2 text-xs font-mono py-1 border-b border-slate-100"
                        >
                            <span className="w-6 h-6 flex items-center justify-center bg-slate-900 text-white text-[10px]">
                                {i}
                            </span>
                            <span className="flex-1">
                                {n.is_depot ? "DEPOT · " : ""}
                                {n.name}{" "}
                                <span className="text-slate-400">· {n.city}</span>
                            </span>
                        </li>
                    ))}
                </ol>
            </div>

            {tsp.two_opt.iterations.length > 0 && (
                <div>
                    <div className="overline mb-2">2-opt Iterations</div>
                    <div className="max-h-40 overflow-y-auto mr-scroll border border-slate-200 p-2 font-mono text-[11px] space-y-0.5">
                        {tsp.two_opt.iterations.map((it, i) => (
                            <div key={i} className="flex justify-between">
                                <span>
                                    #{it.iter} swap[{it.swap[0]},{it.swap[1]}]
                                </span>
                                <span className="text-[color:var(--mr-primary)]">
                                    {it.distance_km} km
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Stat({ label, value, primary, success }) {
    return (
        <div className="p-3 border-b border-r border-slate-200 last:border-r-0">
            <div className="overline">{label}</div>
            <div
                className={`font-mono font-semibold text-lg ${
                    primary
                        ? "text-[color:var(--mr-primary)]"
                        : success
                          ? "text-[color:var(--mr-success)]"
                          : "text-slate-900"
                }`}
            >
                {value}
            </div>
        </div>
    );
}

export default function KnapsackPanel({ knap }) {
    if (!knap) {
        return (
            <div className="p-6 text-sm text-slate-500" data-testid="knap-empty">
                <div className="overline mb-2">Knapsack Output</div>
                Run the optimizer to see which supplies the 0/1 dynamic-programming algorithm
                packs into the vehicle.
            </div>
        );
    }
    return (
        <div className="p-4 space-y-4" data-testid="knap-panel">
            <div className="grid grid-cols-2 gap-0 border border-slate-200">
                <Stat label="DP Value" value={knap.dp.total_value} success />
                <Stat label="DP Weight" value={`${knap.dp.total_weight} / ${knap.capacity} kg`} />
                <Stat label="Utilization" value={`${knap.dp.utilization_pct}%`} primary />
                <Stat label="DP Time" value={`${knap.dp.time_ms.toFixed(2)} ms`} />
            </div>
            {knap.brute_force && !knap.brute_force.skipped && (
                <div className="border border-slate-200 p-3 bg-slate-50">
                    <div className="overline mb-1">Brute Force (2^n)</div>
                    <div className="flex flex-wrap gap-4 font-mono text-xs">
                        <span>Val: {knap.brute_force.total_value}</span>
                        <span>Wt: {knap.brute_force.total_weight} kg</span>
                        <span>Time: {knap.brute_force.time_ms.toFixed(2)} ms</span>
                        <span>
                            Matches DP:{" "}
                            <b
                                className={
                                    knap.brute_force.matches_dp
                                        ? "text-[color:var(--mr-success)]"
                                        : "text-[color:var(--mr-urgent)]"
                                }
                            >
                                {knap.brute_force.matches_dp ? "YES" : "NO"}
                            </b>
                        </span>
                    </div>
                </div>
            )}
            {knap.brute_force?.skipped && (
                <div className="border border-slate-200 p-3 bg-slate-50 text-xs text-slate-600 font-mono">
                    Brute force skipped: {knap.brute_force.reason}
                </div>
            )}

            <div>
                <div className="overline mb-2">Items</div>
                <table className="w-full text-xs font-mono">
                    <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                            <th className="py-1.5 text-left">#</th>
                            <th className="text-left">Name</th>
                            <th className="text-right">Wt</th>
                            <th className="text-right">Val</th>
                            <th className="text-center">Packed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {knap.items.map((it) => (
                            <tr key={it.id} className="border-b border-slate-100">
                                <td className="py-1.5">{it.idx}</td>
                                <td>{it.name}</td>
                                <td className="text-right">{it.weight_kg}</td>
                                <td className="text-right">{it.value}</td>
                                <td className="text-center">
                                    {it.selected_dp ? (
                                        <span className="inline-block w-2 h-2 rounded-full bg-[color:var(--mr-success)]"></span>
                                    ) : (
                                        <span className="inline-block w-2 h-2 rounded-full bg-slate-300"></span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

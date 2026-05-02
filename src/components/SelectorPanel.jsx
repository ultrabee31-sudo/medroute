import { Warning } from "@phosphor-icons/react";

function Toggle({ checked, onChange, children, testid }) {
    return (
        <label
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-slate-50 cursor-pointer text-xs"
            data-testid={testid}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="accent-[color:var(--mr-primary)]"
            />
            {children}
        </label>
    );
}

export default function SelectorPanel({
    hospitals,
    supplies,
    vehicles,
    selectedHospitalIds,
    setSelectedHospitalIds,
    selectedSupplyIds,
    setSelectedSupplyIds,
    selectedVehicleId,
    setSelectedVehicleId,
    onRunTSP,
    onRunKnap,
    running,
}) {
    const toggle = (list, id) =>
        list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

    return (
        <div className="flex flex-col divide-y divide-slate-200">
            <div className="p-4">
                <div className="overline mb-2">Vehicle</div>
                <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="mr-select"
                    data-testid="vehicle-select"
                >
                    {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.name} — {v.capacity_kg} kg
                        </option>
                    ))}
                </select>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="overline">Hospitals ({selectedHospitalIds.length})</div>
                    <div className="flex gap-1">
                        <button
                            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900"
                            onClick={() => setSelectedHospitalIds(hospitals.map((h) => h.id))}
                            data-testid="select-all-hospitals"
                        >
                            All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900"
                            onClick={() => setSelectedHospitalIds([])}
                            data-testid="clear-hospitals"
                        >
                            None
                        </button>
                    </div>
                </div>
                <div className="max-h-52 overflow-y-auto mr-scroll border border-slate-200">
                    {hospitals.map((h) => (
                        <Toggle
                            key={h.id}
                            checked={selectedHospitalIds.includes(h.id)}
                            onChange={() => setSelectedHospitalIds(toggle(selectedHospitalIds, h.id))}
                            testid={`hosp-toggle-${h.id}`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="truncate font-medium">{h.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                    {h.city} · P{h.priority}
                                </div>
                            </div>
                            {h.urgent && (
                                <Warning size={14} weight="fill" color="var(--mr-urgent)" />
                            )}
                        </Toggle>
                    ))}
                </div>
                <button
                    className="mr-btn mr-btn-outline w-full mt-2 justify-center"
                    onClick={onRunTSP}
                    disabled={running}
                    data-testid="run-tsp-btn"
                >
                    Run TSP only
                </button>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="overline">Supplies ({selectedSupplyIds.length})</div>
                    <div className="flex gap-1">
                        <button
                            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900"
                            onClick={() => setSelectedSupplyIds(supplies.map((s) => s.id))}
                            data-testid="select-all-supplies"
                        >
                            All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                            className="text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-900"
                            onClick={() => setSelectedSupplyIds([])}
                            data-testid="clear-supplies"
                        >
                            None
                        </button>
                    </div>
                </div>
                <div className="max-h-52 overflow-y-auto mr-scroll border border-slate-200">
                    {supplies.map((s) => (
                        <Toggle
                            key={s.id}
                            checked={selectedSupplyIds.includes(s.id)}
                            onChange={() => setSelectedSupplyIds(toggle(selectedSupplyIds, s.id))}
                            testid={`sup-toggle-${s.id}`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="truncate font-medium">{s.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                    {s.weight_kg} kg · val {s.value}
                                </div>
                            </div>
                        </Toggle>
                    ))}
                </div>
                <button
                    className="mr-btn mr-btn-outline w-full mt-2 justify-center"
                    onClick={onRunKnap}
                    disabled={running}
                    data-testid="run-knap-btn"
                >
                    Run Knapsack only
                </button>
            </div>
        </div>
    );
}

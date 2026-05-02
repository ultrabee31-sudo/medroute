import { useState } from "react";
import {
    createHospital,
    deleteHospital,
    createSupply,
    deleteSupply,
    createVehicle,
    deleteVehicle,
} from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash } from "@phosphor-icons/react";

export default function ManagementPanel({ hospitals, supplies, vehicles, onChange }) {
    const [section, setSection] = useState("hosp");
    return (
        <div className="p-4 space-y-4" data-testid="manage-panel">
            <div className="flex gap-0 border border-slate-200">
                {[
                    ["hosp", "Hospitals"],
                    ["sup", "Supplies"],
                    ["veh", "Vehicles"],
                ].map(([k, l]) => (
                    <button
                        key={k}
                        onClick={() => setSection(k)}
                        className={`flex-1 py-2 text-[11px] font-mono uppercase tracking-wider border-r border-slate-200 last:border-r-0 ${
                            section === k ? "bg-slate-900 text-white" : "bg-white"
                        }`}
                        data-testid={`manage-tab-${k}`}
                    >
                        {l}
                    </button>
                ))}
            </div>
            {section === "hosp" && <HospitalSection hospitals={hospitals} onChange={onChange} />}
            {section === "sup" && <SupplySection supplies={supplies} onChange={onChange} />}
            {section === "veh" && <VehicleSection vehicles={vehicles} onChange={onChange} />}
        </div>
    );
}

function HospitalSection({ hospitals, onChange }) {
    const [form, setForm] = useState({
        name: "",
        city: "",
        lat: "",
        lon: "",
        priority: 3,
        urgent: false,
    });
    const submit = async (e) => {
        e.preventDefault();
        try {
            await createHospital({
                ...form,
                lat: parseFloat(form.lat),
                lon: parseFloat(form.lon),
                priority: parseInt(form.priority),
            });
            toast.success("Hospital added");
            setForm({ name: "", city: "", lat: "", lon: "", priority: 3, urgent: false });
            onChange();
        } catch (err) {
            toast.error("Failed: " + err.message);
        }
    };
    return (
        <div className="space-y-3">
            <form onSubmit={submit} className="grid grid-cols-2 gap-2" data-testid="hosp-form">
                <input
                    required
                    className="mr-input col-span-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    data-testid="hosp-name"
                />
                <input
                    required
                    className="mr-input"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    data-testid="hosp-city"
                />
                <input
                    required
                    className="mr-input"
                    type="number"
                    step="0.0001"
                    placeholder="Lat"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                    data-testid="hosp-lat"
                />
                <input
                    required
                    className="mr-input"
                    type="number"
                    step="0.0001"
                    placeholder="Lon"
                    value={form.lon}
                    onChange={(e) => setForm({ ...form, lon: e.target.value })}
                    data-testid="hosp-lon"
                />
                <select
                    className="mr-select"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    data-testid="hosp-priority"
                >
                    {[1, 2, 3, 4, 5].map((p) => (
                        <option key={p} value={p}>
                            Priority {p}
                        </option>
                    ))}
                </select>
                <label className="flex items-center gap-2 text-xs">
                    <input
                        type="checkbox"
                        checked={form.urgent}
                        onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                        data-testid="hosp-urgent"
                    />
                    Urgent
                </label>
                <button
                    type="submit"
                    className="mr-btn col-span-2 justify-center"
                    data-testid="hosp-add-btn"
                >
                    <Plus size={13} weight="bold" /> Add hospital
                </button>
            </form>
            <ul className="divide-y divide-slate-100 border border-slate-200">
                {hospitals.map((h) => (
                    <li
                        key={h.id}
                        className="flex items-center justify-between px-2 py-1.5 text-xs font-mono"
                    >
                        <span className="truncate">
                            {h.name} · <span className="text-slate-500">{h.city}</span>
                        </span>
                        <button
                            onClick={async () => {
                                await deleteHospital(h.id);
                                onChange();
                            }}
                            className="text-slate-400 hover:text-[color:var(--mr-urgent)]"
                            data-testid={`hosp-del-${h.id}`}
                        >
                            <Trash size={14} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SupplySection({ supplies, onChange }) {
    const [form, setForm] = useState({
        name: "",
        weight_kg: "",
        value: "",
        category: "consumable",
    });
    const submit = async (e) => {
        e.preventDefault();
        try {
            await createSupply({
                ...form,
                weight_kg: parseInt(form.weight_kg),
                value: parseFloat(form.value),
            });
            toast.success("Supply added");
            setForm({ name: "", weight_kg: "", value: "", category: "consumable" });
            onChange();
        } catch (err) {
            toast.error("Failed: " + err.message);
        }
    };
    return (
        <div className="space-y-3">
            <form onSubmit={submit} className="grid grid-cols-2 gap-2" data-testid="sup-form">
                <input
                    required
                    className="mr-input col-span-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    data-testid="sup-name"
                />
                <input
                    required
                    className="mr-input"
                    type="number"
                    placeholder="Weight kg"
                    value={form.weight_kg}
                    onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                    data-testid="sup-weight"
                />
                <input
                    required
                    className="mr-input"
                    type="number"
                    step="0.1"
                    placeholder="Value"
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    data-testid="sup-value"
                />
                <select
                    className="mr-select col-span-2"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    data-testid="sup-category"
                >
                    <option value="pharma">Pharma</option>
                    <option value="consumable">Consumable</option>
                    <option value="biological">Biological</option>
                    <option value="device">Device</option>
                </select>
                <button
                    type="submit"
                    className="mr-btn col-span-2 justify-center"
                    data-testid="sup-add-btn"
                >
                    <Plus size={13} weight="bold" /> Add supply
                </button>
            </form>
            <ul className="divide-y divide-slate-100 border border-slate-200">
                {supplies.map((s) => (
                    <li
                        key={s.id}
                        className="flex items-center justify-between px-2 py-1.5 text-xs font-mono"
                    >
                        <span className="truncate">
                            {s.name}{" "}
                            <span className="text-slate-500">
                                · {s.weight_kg}kg · val {s.value}
                            </span>
                        </span>
                        <button
                            onClick={async () => {
                                await deleteSupply(s.id);
                                onChange();
                            }}
                            className="text-slate-400 hover:text-[color:var(--mr-urgent)]"
                            data-testid={`sup-del-${s.id}`}
                        >
                            <Trash size={14} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function VehicleSection({ vehicles, onChange }) {
    const [form, setForm] = useState({ name: "", capacity_kg: "", type: "standard_truck" });
    const submit = async (e) => {
        e.preventDefault();
        try {
            await createVehicle({ ...form, capacity_kg: parseInt(form.capacity_kg) });
            toast.success("Vehicle added");
            setForm({ name: "", capacity_kg: "", type: "standard_truck" });
            onChange();
        } catch (err) {
            toast.error("Failed: " + err.message);
        }
    };
    return (
        <div className="space-y-3">
            <form onSubmit={submit} className="grid grid-cols-2 gap-2" data-testid="veh-form">
                <input
                    required
                    className="mr-input col-span-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    data-testid="veh-name"
                />
                <input
                    required
                    className="mr-input"
                    type="number"
                    placeholder="Capacity kg"
                    value={form.capacity_kg}
                    onChange={(e) => setForm({ ...form, capacity_kg: e.target.value })}
                    data-testid="veh-capacity"
                />
                <select
                    className="mr-select"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    data-testid="veh-type"
                >
                    <option value="standard_truck">Standard truck</option>
                    <option value="refrigerated_van">Refrigerated van</option>
                    <option value="bike_courier">Bike courier</option>
                </select>
                <button
                    type="submit"
                    className="mr-btn col-span-2 justify-center"
                    data-testid="veh-add-btn"
                >
                    <Plus size={13} weight="bold" /> Add vehicle
                </button>
            </form>
            <ul className="divide-y divide-slate-100 border border-slate-200">
                {vehicles.map((v) => (
                    <li
                        key={v.id}
                        className="flex items-center justify-between px-2 py-1.5 text-xs font-mono"
                    >
                        <span className="truncate">
                            {v.name}{" "}
                            <span className="text-slate-500">· {v.capacity_kg}kg · {v.type}</span>
                        </span>
                        <button
                            onClick={async () => {
                                await deleteVehicle(v.id);
                                onChange();
                            }}
                            className="text-slate-400 hover:text-[color:var(--mr-urgent)]"
                            data-testid={`veh-del-${v.id}`}
                        >
                            <Trash size={14} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

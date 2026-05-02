import { useEffect, useMemo, useState } from "react";
import {
    seedAll,
    runPlan,
    runTSP,
    runKnapsack,
} from "@/lib/api";
import MapView from "@/components/MapView";
import KPIRow from "@/components/KPIRow";
import TSPPanel from "@/components/TSPPanel";
import KnapsackPanel from "@/components/KnapsackPanel";
import ManagementPanel from "@/components/ManagementPanel";
import AIChat from "@/components/AIChat";
import SelectorPanel from "@/components/SelectorPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Truck, Warning, Stack, ChartLineUp, Sparkle, GearSix } from "@phosphor-icons/react";

export default function Dashboard() {
    const [depot, setDepot] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [selectedHospitalIds, setSelectedHospitalIds] = useState([]);
    const [selectedSupplyIds, setSelectedSupplyIds] = useState([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState("");
    const [includeBF, setIncludeBF] = useState(true);

    const [plan, setPlan] = useState(null);
    const [tspOnly, setTspOnly] = useState(null);
    const [knapOnly, setKnapOnly] = useState(null);
    const [running, setRunning] = useState(false);
    const [animStep, setAnimStep] = useState(-1); // animated tour progression

    const refreshAll = async () => {
        const r = await seedAll();
        setDepot(r.depot);
        setHospitals(r.hospitals);
        setSupplies(r.supplies);
        setVehicles(r.vehicles);
        setSelectedHospitalIds(r.hospitals.map((h) => h.id));
        setSelectedSupplyIds(r.supplies.map((s) => s.id));
        setSelectedVehicleId(r.vehicles[0]?.id || "");
    };

    useEffect(() => {
        refreshAll().catch((e) => toast.error("Failed to load demo data: " + e.message));
    }, []);

    const selectedVehicle = useMemo(
        () => vehicles.find((v) => v.id === selectedVehicleId),
        [vehicles, selectedVehicleId],
    );

    const runFullPlan = async () => {
        if (!selectedVehicleId) return toast.error("Select a vehicle");
        if (selectedHospitalIds.length < 2) return toast.error("Select at least 2 hospitals");
        if (selectedSupplyIds.length < 1) return toast.error("Select at least 1 supply");
        setRunning(true);
        try {
            const res = await runPlan({
                hospital_ids: selectedHospitalIds,
                supply_ids: selectedSupplyIds,
                vehicle_id: selectedVehicleId,
                include_brute_force: includeBF,
            });
            setPlan(res);
            setTspOnly(res.tsp);
            setKnapOnly(res.knapsack);
            animateTour(res.tsp.two_opt.tour.length);
            toast.success(
                `Plan ready · ${res.summary.total_distance_km} km · value ${res.summary.total_value_loaded}`,
            );
        } catch (e) {
            toast.error("Optimization failed: " + (e?.response?.data?.detail || e.message));
        } finally {
            setRunning(false);
        }
    };

    const runTSPOnly = async () => {
        if (selectedHospitalIds.length < 2) return toast.error("Select at least 2 hospitals");
        setRunning(true);
        try {
            const res = await runTSP(selectedHospitalIds, includeBF);
            setTspOnly(res);
            animateTour(res.two_opt.tour.length);
            toast.success(`TSP done · 2-opt: ${res.two_opt.distance_km} km`);
        } catch (e) {
            toast.error("TSP failed: " + e.message);
        } finally {
            setRunning(false);
        }
    };

    const runKnapOnly = async () => {
        if (!selectedVehicle) return toast.error("Select vehicle (for capacity)");
        if (selectedSupplyIds.length < 1) return toast.error("Select at least 1 supply");
        setRunning(true);
        try {
            const res = await runKnapsack(
                selectedSupplyIds,
                selectedVehicle.capacity_kg,
                includeBF,
            );
            setKnapOnly(res);
            toast.success(`Knapsack done · value ${res.dp.total_value}`);
        } catch (e) {
            toast.error("Knapsack failed: " + e.message);
        } finally {
            setRunning(false);
        }
    };

    const animateTour = (len) => {
        setAnimStep(0);
        let i = 0;
        const iv = setInterval(() => {
            i += 1;
            setAnimStep(i);
            if (i >= len - 1) clearInterval(iv);
        }, 380);
    };

    return (
        <div className="min-h-screen flex flex-col" data-testid="dashboard-root">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="px-6 py-4 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[color:var(--mr-text)] flex items-center justify-center">
                            <Truck size={18} weight="fill" color="#fff" />
                        </div>
                        <div>
                            <h1 className="font-display text-xl font-extrabold tracking-tight">
                                MEDROUTE<span className="text-[color:var(--mr-primary)]">/</span>OPTIMIZER
                            </h1>
                            <div className="overline">TSP · 0/1 KNAPSACK · CONTROL ROOM</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-xs text-slate-600 font-mono uppercase tracking-wider select-none">
                            <input
                                type="checkbox"
                                checked={includeBF}
                                onChange={(e) => setIncludeBF(e.target.checked)}
                                data-testid="toggle-brute-force"
                            />
                            Brute-force compare
                        </label>
                        <button
                            className="mr-btn mr-btn-outline"
                            onClick={refreshAll}
                            data-testid="reload-data-btn"
                        >
                            <GearSix size={14} weight="bold" /> Reload demo
                        </button>
                        <button
                            className="mr-btn"
                            onClick={runFullPlan}
                            disabled={running}
                            data-testid="run-full-plan-btn"
                        >
                            <Sparkle size={14} weight="fill" />
                            {running ? "Optimizing…" : "Run Full Plan"}
                        </button>
                    </div>
                </div>
            </header>

            {/* KPI row */}
            <KPIRow plan={plan} tsp={tspOnly} knap={knapOnly} />

            {/* Main grid: left selector, center map, right tabs */}
            <div className="grid grid-cols-12 gap-0 flex-1 min-h-0">
                {/* Left selector */}
                <aside className="col-span-12 md:col-span-3 xl:col-span-2 border-r border-slate-200 bg-white overflow-y-auto mr-scroll">
                    <SelectorPanel
                        hospitals={hospitals}
                        supplies={supplies}
                        vehicles={vehicles}
                        selectedHospitalIds={selectedHospitalIds}
                        setSelectedHospitalIds={setSelectedHospitalIds}
                        selectedSupplyIds={selectedSupplyIds}
                        setSelectedSupplyIds={setSelectedSupplyIds}
                        selectedVehicleId={selectedVehicleId}
                        setSelectedVehicleId={setSelectedVehicleId}
                        onRunTSP={runTSPOnly}
                        onRunKnap={runKnapOnly}
                        running={running}
                    />
                </aside>

                {/* Map center */}
                <section className="col-span-12 md:col-span-5 xl:col-span-6 border-r border-slate-200 relative min-h-[520px]">
                    <MapView
                        depot={depot}
                        hospitals={hospitals}
                        tsp={tspOnly}
                        animStep={animStep}
                        selectedHospitalIds={selectedHospitalIds}
                    />
                </section>

                {/* Right tabs panel */}
                <aside className="col-span-12 md:col-span-4 xl:col-span-4 bg-white overflow-hidden flex flex-col min-h-[520px]">
                    <Tabs defaultValue="tsp" className="flex flex-col h-full">
                        <TabsList
                            className="grid grid-cols-4 w-full rounded-none bg-transparent border-b border-slate-200 p-0 h-auto"
                            data-testid="right-tabs"
                        >
                            <TabsTrigger
                                value="tsp"
                                className="rounded-none border-r border-slate-200 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none font-mono text-[11px] tracking-widest uppercase"
                                data-testid="tab-tsp"
                            >
                                <ChartLineUp size={13} className="mr-1" /> TSP
                            </TabsTrigger>
                            <TabsTrigger
                                value="knap"
                                className="rounded-none border-r border-slate-200 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none font-mono text-[11px] tracking-widest uppercase"
                                data-testid="tab-knap"
                            >
                                <Stack size={13} className="mr-1" /> Knapsack
                            </TabsTrigger>
                            <TabsTrigger
                                value="manage"
                                className="rounded-none border-r border-slate-200 py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none font-mono text-[11px] tracking-widest uppercase"
                                data-testid="tab-manage"
                            >
                                <Warning size={13} className="mr-1" /> Manage
                            </TabsTrigger>
                            <TabsTrigger
                                value="ai"
                                className="rounded-none py-3 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-none font-mono text-[11px] tracking-widest uppercase"
                                data-testid="tab-ai"
                            >
                                <Sparkle size={13} className="mr-1" /> AI
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="tsp" className="flex-1 overflow-y-auto mr-scroll m-0 p-0">
                            <TSPPanel tsp={tspOnly} />
                        </TabsContent>
                        <TabsContent value="knap" className="flex-1 overflow-y-auto mr-scroll m-0 p-0">
                            <KnapsackPanel knap={knapOnly} />
                        </TabsContent>
                        <TabsContent value="manage" className="flex-1 overflow-y-auto mr-scroll m-0 p-0">
                            <ManagementPanel
                                hospitals={hospitals}
                                supplies={supplies}
                                vehicles={vehicles}
                                onChange={refreshAll}
                            />
                        </TabsContent>
                        <TabsContent value="ai" className="flex-1 overflow-y-auto mr-scroll m-0 p-0">
                            <AIChat context={{ plan, tsp: tspOnly, knap: knapOnly }} />
                        </TabsContent>
                    </Tabs>
                </aside>
            </div>
        </div>
    );
}

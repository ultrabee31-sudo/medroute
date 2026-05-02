import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

const depotIcon = () =>
    L.divIcon({
        className: "",
        html: '<div class="mr-marker-depot">D</div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
    });

const hospIcon = (urgent, label) =>
    L.divIcon({
        className: "",
        html: `<div class="mr-marker-hosp ${urgent ? "mr-marker-urgent" : ""}">${label}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
    });

export default function MapView({ depot, hospitals, tsp, animStep, selectedHospitalIds }) {
    const center = depot ? [depot.lat, depot.lon] : [15.3, 78.0];

    const tourCoords = useMemo(() => {
        if (!tsp?.two_opt?.tour || !tsp.nodes) return [];
        return tsp.two_opt.tour.map((idx) => {
            const n = tsp.nodes[idx];
            return [n.lat, n.lon];
        });
    }, [tsp]);

    const nnCoords = useMemo(() => {
        if (!tsp?.nearest_neighbor?.tour || !tsp.nodes) return [];
        return tsp.nearest_neighbor.tour.map((idx) => {
            const n = tsp.nodes[idx];
            return [n.lat, n.lon];
        });
    }, [tsp]);

    const animatedCoords =
        animStep >= 0 && tourCoords.length
            ? tourCoords.slice(0, Math.max(2, Math.min(tourCoords.length, animStep + 2)))
            : tourCoords;

    const selectedSet = new Set(selectedHospitalIds || []);

    return (
        <MapContainer
            center={center}
            zoom={6}
            style={{ height: "100%", width: "100%", minHeight: 520 }}
            scrollWheelZoom
            data-testid="map-container"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {depot && (
                <Marker position={[depot.lat, depot.lon]} icon={depotIcon()}>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                        <div className="font-mono text-xs">
                            <div className="overline">DEPOT</div>
                            <div className="font-semibold">{depot.name}</div>
                            <div>{depot.city}</div>
                        </div>
                    </Tooltip>
                </Marker>
            )}
            {hospitals.map((h, i) => (
                <Marker
                    key={h.id}
                    position={[h.lat, h.lon]}
                    icon={hospIcon(h.urgent, String(i + 1))}
                    opacity={selectedSet.has(h.id) ? 1 : 0.3}
                >
                    <Popup>
                        <div className="font-mono text-xs">
                            <div className="font-semibold text-sm mb-1">{h.name}</div>
                            <div>{h.city}</div>
                            <div>Priority: {h.priority}</div>
                            {h.urgent && (
                                <div className="text-[color:var(--mr-urgent)] font-bold">URGENT</div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Nearest neighbor baseline (dashed grey) */}
            {nnCoords.length > 1 && (
                <Polyline
                    positions={nnCoords}
                    pathOptions={{
                        color: "#94A3B8",
                        weight: 2,
                        dashArray: "4 6",
                        opacity: 0.6,
                    }}
                />
            )}

            {/* 2-opt optimized route (solid blue, animated) */}
            {animatedCoords.length > 1 && (
                <Polyline
                    positions={animatedCoords}
                    pathOptions={{ color: "#00509E", weight: 4, opacity: 0.95 }}
                />
            )}
        </MapContainer>
    );
}

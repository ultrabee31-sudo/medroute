import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
    baseURL: API
});

export const seedAll = () => api.post("/seed").then((r) => r.data);
export const getDepot = () => api.get("/depot").then((r) => r.data);
export const getHospitals = () => api.get("/hospitals").then((r) => r.data);
export const getSupplies = () => api.get("/supplies").then((r) => r.data);
export const getVehicles = () => api.get("/vehicles").then((r) => r.data);

export const createHospital = (body) => api.post("/hospitals", body).then((r) => r.data);
export const updateHospital = (id, body) => api.put(`/hospitals/${id}`, body).then((r) => r.data);
export const deleteHospital = (id) => api.delete(`/hospitals/${id}`).then((r) => r.data);

export const createSupply = (body) => api.post("/supplies", body).then((r) => r.data);
export const updateSupply = (id, body) => api.put(`/supplies/${id}`, body).then((r) => r.data);
export const deleteSupply = (id) => api.delete(`/supplies/${id}`).then((r) => r.data);

export const createVehicle = (body) => api.post("/vehicles", body).then((r) => r.data);
export const updateVehicle = (id, body) => api.put(`/vehicles/${id}`, body).then((r) => r.data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`).then((r) => r.data);

export const runTSP = (hospital_ids, include_brute_force = false) =>
    api.post("/optimize/tsp", {
        hospital_ids,
        include_brute_force
    }).then((r) => r.data);

export const runKnapsack = (supply_ids, capacity_kg, include_brute_force = false) =>
    api.post("/optimize/knapsack", {
        supply_ids,
        capacity_kg,
        include_brute_force
    }).then((r) => r.data);

export const runPlan = (body) => api.post("/optimize/plan", body).then((r) => r.data);

export const aiExplain = (body) => api.post("/ai/explain", body).then((r) => r.data);
import Building from "../../models/building";
import { fetchJson } from "../index";
import Area from "../../models/area";
import Device from "../../models/device";

const ENDPOINT = "http://localhost:10001";
const DATA_MANAGER_BUILDINGS_URL = ENDPOINT + "/api/buildings/pull";
const DATA_MANAGER_AREAS_URL = ENDPOINT + "/api/areas/pull";
const DATA_MANAGER_DEVICES_URL = ENDPOINT + "/api/sniffers/pull";

function buildings(userId: number): Promise<Building[]> {
    return fetchJson<Building[]>(`${DATA_MANAGER_BUILDINGS_URL}/${userId}`);
}

function areas(buildingId: number): Promise<Area[]> {
    return fetchJson<Area[]>(`${DATA_MANAGER_AREAS_URL}/${buildingId}`);
}

function devices(buildingId: number): Promise<Device[]> {
    return fetchJson<Device[]>(`${DATA_MANAGER_DEVICES_URL}/${buildingId}`);
}

const DataManagerAPI = {
    buildings,
    areas,
    devices
};

export default DataManagerAPI;
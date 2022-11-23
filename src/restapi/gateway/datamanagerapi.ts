import Building from "../../models/building";
import { fetchJson } from "../index";
import Area from "../../models/area";
import Device from "../../models/device";
import CrowdPosition from "../../models/crowdposition";

const ENDPOINT = process.env.DATA_MANAGER_HOST ? process.env.DATA_MANAGER_HOST:"http://localhost:10002";
const DATA_MANAGER_BUILDINGS_URL = ENDPOINT + "/api/buildings/pull";
const DATA_MANAGER_AREAS_URL = ENDPOINT + "/api/areas/pull";
const DATA_MANAGER_DEVICES_URL = ENDPOINT + "/api/sniffers/pull";
const DATA_MANAGER_POSITION_DETECTION_URL = ENDPOINT + "/api/position-detection/pull";

function buildings(userId: number): Promise<Building[]> {
    return fetchJson<Building[]>(`${DATA_MANAGER_BUILDINGS_URL}/${userId}`);
}

function areas(buildingId: string): Promise<Area[]> {
    return fetchJson<Area[]>(`${DATA_MANAGER_AREAS_URL}/${buildingId}`);
}

function devices(buildingId: string): Promise<Device[]> {
    return fetchJson<Device[]>(`${DATA_MANAGER_DEVICES_URL}/${buildingId}`);
}

function crowdBehavior(buildingId: string, fromDate: Date, toDate: Date): Promise<CrowdPosition[]> {
    const startStr = fromDate.toISOString();
    const endStr = toDate.toISOString();
    return fetchJson<CrowdPosition[]>(`${DATA_MANAGER_POSITION_DETECTION_URL}/${buildingId}?start=${startStr}&end=${endStr}`);
}

const DataManagerAPI = {
    buildings,
    areas,
    devices,
    crowdBehavior
};

export default DataManagerAPI;
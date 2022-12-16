import Building from "../../models/building";
import {FetchError, fetchJson} from "../index";
import Area from "../../models/area";
import Device from "../../models/device";
import CrowdPosition from "../../models/crowdposition";
import PointOfInterest from "../../models/pointOfInterest";

const ENDPOINT = process.env.DATA_MANAGER_HOST ? process.env.DATA_MANAGER_HOST:"http://localhost:10002";
const DATA_MANAGER_BUILDINGS_URL = ENDPOINT + "/api/buildings/pull";
const DATA_MANAGER_AREAS_URL = ENDPOINT + "/api/areas/pull";
const DATA_MANAGER_DEVICES_URL = ENDPOINT + "/api/sniffers/pull";
const DATA_MANAGER_POSITION_DETECTION_URL = ENDPOINT + "/api/position-detection/pull";
const DATA_MANAGER_POSITION_DETECTION_MAX_DATE_URL = ENDPOINT + "/api/position-detection/maxdate";

const AI_URL = "http://localhost:10003/api/poi";



function buildings(userId: number): Promise<Building[]> {
    return fetchJson<Building[]>(`${DATA_MANAGER_BUILDINGS_URL}/${userId}`);
}

function areas(buildingId: string): Promise<Area[]> {
    return fetchJson<Area[]>(`${DATA_MANAGER_AREAS_URL}/${buildingId}`);
}

function devices(buildingId: string): Promise<Device[]> {
    return fetchJson<Device[]>(`${DATA_MANAGER_DEVICES_URL}/${buildingId}`);
}

function poi(buildingId: string, fromDate?: string, toDate?: string, k?: string): Promise<PointOfInterest[]> {
    return fetchJson<PointOfInterest[]>(`${AI_URL}/${buildingId}?k=${k}&start=${fromDate}&end=${toDate}`);
}

function crowdBehavior(buildingId: string, fromDate?: string, toDate?: string): Promise<CrowdPosition[]> {
    let url = `${DATA_MANAGER_POSITION_DETECTION_URL}/${buildingId}`;
    if (fromDate || toDate) url += "?";
    if (fromDate) url += `start=${fromDate}`;
    if (fromDate && toDate) url += `&`;
    if (toDate) url += `end=${toDate}`;

    return fetchJson<CrowdPosition[]>(url);
}

type MaxDateResponse = {
    maxDate: string
}
function maxDate(buildingId: string): Promise<Date> {
    return fetchJson<MaxDateResponse>(`${DATA_MANAGER_POSITION_DETECTION_MAX_DATE_URL}/${buildingId}`)
        .then(res => new Date(res.maxDate) );
}

const DataManagerAPI = {
    buildings,
    areas,
    devices,
    crowdBehavior,
    poi,
    maxDate
};

export default DataManagerAPI;
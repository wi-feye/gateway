import PointOfInterest from "../../models/pointOfInterest";
import {fetchJson} from "../index";

const ENDPOINT = process.env.AI_SERVER_HOST ? process.env.AI_SERVER_HOST:"http://localhost:10003";

const AI_GET_POI_URL = ENDPOINT + "/api/poi";

function poi(buildingId: string, fromDate?: string, toDate?: string, k?: string): Promise<PointOfInterest[]> {
    return fetchJson<PointOfInterest[]>(`${AI_GET_POI_URL}/${buildingId}?k=${k}&start=${fromDate}&end=${toDate}`);
}


const AIServerAPI = {
    poi,
};

export default AIServerAPI;
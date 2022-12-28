import PointOfInterest from "../../models/pointOfInterest";
import {fetchJson} from "../index";
import PredictedAttendance from "../../models/predictedAttendance";

const ENDPOINT = process.env.AI_SERVER_HOST ? process.env.AI_SERVER_HOST:"http://localhost:10003";

const AI_GET_POI_URL = ENDPOINT + "/api/poi";
const AI_GET_PREDICTIONS_URL = ENDPOINT + "/api/predict";

function poi(buildingId: string, fromDate?: string, toDate?: string, k?: string): Promise<PointOfInterest[]> {
    return fetchJson<PointOfInterest[]>(`${AI_GET_POI_URL}/${buildingId}?k=${k}&start=${fromDate}&end=${toDate}`);
}

function predictions(buildingId: string, fromDate: Date): Promise<PredictedAttendance[]> {
    const nextHour = new Date(fromDate);
    nextHour.setTime(nextHour.getTime()+60*60*1000); // add one hour
    nextHour.setTime(nextHour.getTime()+60*60*1000); // add one hour
    console.log(nextHour)
    return fetchJson<{}>(`${AI_GET_PREDICTIONS_URL}/${buildingId}?date=${nextHour.toISOString()}`)
        .then(res => {
            const predictedAttendance: PredictedAttendance[] = [];
            Object.entries(res).forEach(([key, value], index) => {
                predictedAttendance.push({
                    id_area: key,
                    minutesGap: 10,
                    from: fromDate.toISOString(),
                    count: value as number[]
                })
            });
            return predictedAttendance;
        });
}

const AIServerAPI = {
    poi,
    predictions,
};

export default AIServerAPI;
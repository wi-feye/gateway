import PointOfInterest from "../../models/pointOfInterest";
import {fetchJson} from "../index";
import PredictedAttendance from "../../models/predictedAttendance";

const ENDPOINT = process.env.DEVICE_INTEROPERABILITY_SERVER_HOST ? process.env.DEVICE_INTEROPERABILITY_SERVER_HOST:"http://localhost:10007";

const DEVICE_INTEROPERABILITY_PUBLISH_URL = ENDPOINT + "/api/publish";

function publish(body: any): Promise<any> {
    return fetch(DEVICE_INTEROPERABILITY_PUBLISH_URL, {
        method: "POST",
        body: JSON.stringify(body), 
        headers: {
            "Content-type": "application/json"
        }
    });
}

const DeviceInteroperabilityAPI = {
    publish,
};

export default DeviceInteroperabilityAPI;
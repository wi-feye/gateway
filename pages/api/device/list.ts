import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import Device from "../../../src/models/device";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

/*const response: Device[] = [
        {
            id: "84564564",
            name: "Device 1",
            status: "Online",
            lastRequest: "18/11/2020 18:44",
            position: [43.72249, 10.40767]
        },
        {
            id: "84564564",
            name: "Device 2",
            status: "Online",
            lastRequest: "18/11/2020 18:44",
            position: [43.72299, 10.40767]
        },
        {
            id: "84564564",
            name: "Device 3",
            status: "Offline",
            lastRequest: "18/11/2020 18:44",
            position: [43.72249, 10.40817]
        }
    ]*/

async function listRoute(req: NextApiRequest, res: NextApiResponse<Device[]>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    const buildingId = Array.isArray(req.query.buildingId) ? req.query.buildingId[0]:req.query.buildingId;
    if (!buildingId) {
        res.json([]);
        return;
    }
    const devices = await DataManagerAPI.devices(parseInt(buildingId));
    devices.forEach((dev, i) => {
        dev.status = i == devices.length - 1 ? "Offline":"Online";
        dev.lastRequest = "18/11/2020 18:44";
    })
    res.json(devices);
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
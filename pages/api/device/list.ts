import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import Device from "../../../src/models/device";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";
import { fetchJson } from '../../../src/restapi';

async function listRoute(req: NextApiRequest, res: NextApiResponse<Device[]>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    const buildingId = Array.isArray(req.query.buildingId) ? req.query.buildingId[0] : req.query.buildingId;
    if (!buildingId) {
        res.json([]);
        return;
    }
    const devices = await DataManagerAPI.devices(buildingId);
    try {
        const buildings = user.id ? await DataManagerAPI.buildings(user.id):[];
        const building = buildings.find(b => b.id == Number.parseInt(buildingId));
        const z_devices = await fetchJson<any>(`https://api.zdm.zerynth.com/v3/workspaces/${building?.id_zerynth}/devices`, {headers: {"X-API-KEY": user.apikey_zerynth}})
        devices.forEach((dev, i) => {
            const z_device = z_devices.devices.find((d: any) => d.id == dev.id_zerynth);
            const last_connected_at = (z_device.last_connected_at as string);
            dev.status = z_device.is_connected ? "Online" : "Offline";
            dev.lastRequest = last_connected_at.substring(0, last_connected_at.indexOf(".")).replace("T", " ");
        });
    } catch (e) {
        console.log(e)
        devices.forEach((dev, i) => {
            dev.status = "Offline";
            dev.lastRequest = "18-11-2020 18:44:08";
        });
    }
    res.json(devices);
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
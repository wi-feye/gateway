import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import Device from "../../../src/models/device";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";
import { fetchJson } from '../../../src/restapi';
import ZerynthAPI from '../../../src/restapi/gateway/zerynthapi';

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
        const buildings = user.id ? await DataManagerAPI.buildings(user.id) : [];
        const building = buildings.find(b => b.id == Number.parseInt(buildingId));
        const z_devices = await ZerynthAPI.zerynthDevices(user.apikey_zerynth, building?.id_zerynth || '');
        devices.forEach((dev, i) => {
            const z_device = z_devices.find((d: any) => d.id == dev.id_zerynth);
            if (z_device) {
                const last_connected_at = ((z_device.is_connected ? z_device.last_connected_at : z_device.last_disconnected_at) as string);
                dev.status = z_device.is_connected ? "Online" : "Offline";
                dev.lastRequest = new Date(last_connected_at).toLocaleString();
            }
        });
    } catch (e) {
        console.log(e)
        devices.forEach((dev, i) => {
            dev.status = "Offline";
            dev.lastRequest = new Date("18-11-2020T18:44:08Z").toLocaleString();
        });
    }
    res.json(devices);
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
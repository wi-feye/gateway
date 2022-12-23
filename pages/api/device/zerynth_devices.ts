import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import Device from "../../../src/models/device";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";
import ZerynthAPI from '../../../src/restapi/gateway/zerynthapi';
import ZerynthDevice from "../../../src/models/zerynth_device";

async function listRoute(req: NextApiRequest, res: NextApiResponse<ZerynthDevice[]>) {
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
    try {
        const buildings = user.id ? await DataManagerAPI.buildings(user.id) : [];
        const building = buildings.find(b => b.id == Number.parseInt(buildingId));
        const z_devices = await ZerynthAPI.zerynthDevices(user.apikey_zerynth, building?.id_zerynth || '');
        
        res.json(z_devices);

    } catch (e) {
        console.log(e)
    }
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
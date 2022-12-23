import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import Device from "../../../src/models/device";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";
import ZerynthAPI from '../../../src/restapi/gateway/zerynthapi';
import ZerynthDevice from "../../../src/models/zerynth_device";
import ZerynthBuilding from "../../../src/models/zerynth_building";

async function listRoute(req: NextApiRequest, res: NextApiResponse<ZerynthBuilding[]>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;

    try {
        const zerynthBuildings = await ZerynthAPI.zerynthBuildings(user.apikey_zerynth);
        
        res.json(zerynthBuildings);

    } catch (e) {
        console.log(e)
    }
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
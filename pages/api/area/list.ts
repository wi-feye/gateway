import { NextApiRequest, NextApiResponse } from 'next'
import Area from '../../../src/models/area';
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

async function listRoute(req: NextApiRequest, res: NextApiResponse<Area[]>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    if (!req.query.buildingId || !req.query.validOnly) {
        res.status(400).end();
        return;
    }

    const user = req.session.user;
    const buildingId = Array.isArray(req.query.buildingId) ? req.query.buildingId[0]:req.query.buildingId;
    const validOnly = Array.isArray(req.query.validOnly) ? req.query.validOnly[0]:req.query.validOnly;

    let areas = buildingId ? await DataManagerAPI.areas(buildingId):[];
    if (validOnly === "true") {
        areas = areas.filter(area => area.id !== -1);
    }

    res.json(areas);
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
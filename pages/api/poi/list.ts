import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import PointOfInterest from "../../../src/models/pointOfInterest";
import AIServerAPI from "../../../src/restapi/gateway/aiserverapi";

async function listRoute(req: NextApiRequest, res: NextApiResponse<PointOfInterest[]>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    const buildingId = Array.isArray(req.query.buildingId) ? req.query.buildingId[0] : req.query.buildingId;
    const k = Array.isArray(req.query.k) ? req.query.k[0] : req.query.k;
    const start = Array.isArray(req.query.start) ? req.query.start[0] : req.query.start;
    const end = Array.isArray(req.query.end) ? req.query.end[0] : req.query.end;
    if (!buildingId) {
        res.json([]);
        return;
    }
    const pointOfInterests = await AIServerAPI.poi(buildingId,start,end,k);

    res.json(pointOfInterests);
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
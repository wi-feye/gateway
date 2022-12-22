import { NextApiRequest, NextApiResponse } from 'next'
import Area from '../../../src/models/area';
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

async function updateRoute(req: NextApiRequest, res: NextApiResponse) {
    gateway_logger(req);

    if (req.method !== "POST") {
        res.status(405).end(); // method not allowed
    }

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    if (!req.query.buildingId) {
        res.status(400).end();
        return;
    }

    const user = req.session.user;
    const buildingId = Array.isArray(req.query.buildingId) ? req.query.buildingId[0]:req.query.buildingId;
    const areaId = Array.isArray(req.query.areaId) ? req.query.areaId[0]:req.query.areaId;
    const name = req.body.name;
    const description = req.body.description;
    const location = req.body.location;

    if (!buildingId || !areaId || !name || !description || !location) {
        res.status(400).end();
        return;
    }

    await DataManagerAPI.updateArea(
        buildingId,
        areaId,
        location,
        name,
        description
    );

    res.status(200).end();
}

export default withIronSessionApiRoute(updateRoute, sessionOptions);
import { NextApiRequest, NextApiResponse } from 'next'
import Area from '../../../src/models/area';
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

async function deleteRoute(req: NextApiRequest, res: NextApiResponse) {
    gateway_logger(req);

    if (req.method !== "DELETE") {
        res.status(405).end(); // method not allowed
    }

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    if (!req.query.areaId) {
        res.status(400).end();
        return;
    }

    const user = req.session.user;
    const areaId = Array.isArray(req.query.areaId) ? req.query.areaId[0]:req.query.areaId;

    await DataManagerAPI.deleteArea(areaId);

    res.status(200).end();
}

export default withIronSessionApiRoute(deleteRoute, sessionOptions);
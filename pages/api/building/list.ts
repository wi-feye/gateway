import { NextApiRequest, NextApiResponse } from 'next'
import Building from "../../../src/models/building";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

// GET /api/building
async function listRoute(req: NextApiRequest, res: NextApiResponse<Building[]>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    const buildings = user.id ? await DataManagerAPI.buildings(user.id):[];
    res.json(buildings);

    /*res.json([
        {
            name: "Polo Fibonacci",
            id: "1",
        },
        {
            name: "MIT",
            id: "2"
        }
    ]);*/
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
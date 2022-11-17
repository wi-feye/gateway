import { NextApiRequest, NextApiResponse } from 'next'
import Building from "../../../src/models/building";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import gateway_logger from "../../../src/restapi/gateway_logger";

// GET /api/building
async function listRoute(req: NextApiRequest, res: NextApiResponse<Building[]>) {
    gateway_logger(req);
    const user = req.session.user;

    if (!user || !user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    res.json([
        {
            name: "Polo Fibonacci",
            id: "1",
        },
        {
            name: "MIT",
            id: "2"
        }
    ]);
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
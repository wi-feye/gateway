import { NextApiRequest, NextApiResponse } from 'next'
import Area from '../../../src/models/area';
import gateway_logger from "../../../src/restapi/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";

async function listRoute(req: NextApiRequest, res: NextApiResponse<Area[]>) {
    gateway_logger(req);

    const user = req.session.user;

    if (!user || !user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const response: Area[] = [
        {
            id: "84564564",
            name: "Area 1",
            description: "Area description"
        },
        {
            id: "98764564",
            name: "Area 2",
            description: "Area description 2"
        },
        {
            id: "98756325",
            name: "Area 3",
            description: "Area description 3"
        }
    ]

    res.json(response);
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
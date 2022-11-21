import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import Attendance from "../../../src/models/attendance";

async function route(req: NextApiRequest, res: NextApiResponse<Attendance[]>) {
    gateway_logger(req);

    const { buildingId, from, to } = req.query;

    const user = req.session.user;

    if (!user || !user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    if (from == null || to == null) {
        res.status(400).end();
        return;
    }
    const fromDate = new Date(Array.isArray(from) ? from[0] : from);
    const toDate = new Date(Array.isArray(to) ? to[0] : to);

    const response: Attendance[] = [{
        from: new Date(2022, 11, 1, 0, 0, 0),
        to: new Date(2022, 11, 1, 23, 59, 59),
        data: 120
    }];

    res.json(response);
}

export default withIronSessionApiRoute(route, sessionOptions);
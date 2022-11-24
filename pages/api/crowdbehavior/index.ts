import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import CrowdBehavior from "../../../src/models/crowdbehavior";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";
import {splitByDuration} from "../../../src/restapi/gateway/gatewayUtils";

async function route(req: NextApiRequest, res: NextApiResponse<CrowdBehavior[]>) {
    gateway_logger(req);

    const { buildingId, from, to, minutesGap } = req.query;

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    if (from == null || to == null || buildingId == null) {
        res.status(400).end();
        return;
    }

    const user = req.session.user;
    const fromDate = new Date(Array.isArray(from) ? from[0] : from);
    const toDate = new Date(Array.isArray(to) ? to[0] : to);
    const crowdBehaviorResponse = await DataManagerAPI.crowdBehavior(
        Array.isArray(buildingId) ? buildingId[0] : buildingId,
        fromDate.toISOString(),
        toDate.toISOString()
    );
    const gap_in_minutes = minutesGap ? parseInt(Array.isArray(minutesGap) ? minutesGap[0] : minutesGap):1;

    const response = splitByDuration(crowdBehaviorResponse, gap_in_minutes);
    response.forEach(res => console.log(res.data.length, res.from, res.to))
    res.json(response);
}

export default withIronSessionApiRoute(route, sessionOptions);
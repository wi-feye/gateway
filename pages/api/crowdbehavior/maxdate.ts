import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

async function route(req: NextApiRequest, res: NextApiResponse<{ maxDate: Date }>) {
    gateway_logger(req);

    const { buildingId, from, to } = req.query;

    const user = req.session.user;

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    if (buildingId == null) {
        res.status(400).end();
        return;
    }

    const maxDate = await DataManagerAPI.maxDate(
        Array.isArray(buildingId) ? buildingId[0] : buildingId,
    );

    res.json({
        maxDate: maxDate
    });
}

export default withIronSessionApiRoute(route, sessionOptions);
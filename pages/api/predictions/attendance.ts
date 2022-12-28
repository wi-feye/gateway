import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import AIServerAPI from "../../../src/restapi/gateway/aiserverapi";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";
import Attendance from "../../../src/models/attendance";
import PredictedAttendance from "../../../src/models/predictedAttendance";

async function predictionsRoute(req: NextApiRequest, res: NextApiResponse<PredictedAttendance[]>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    const buildingId = Array.isArray(req.query.buildingId) ? req.query.buildingId[0] : req.query.buildingId;
    if (!buildingId) {
        res.json([]);
        return;
    }
    let fromStr = Array.isArray(req.query.from) ? req.query.from[0] : req.query.from;
    let from: Date;
    if (!fromStr) {
        const maxDate = await DataManagerAPI.maxDate(
            Array.isArray(buildingId) ? buildingId[0] : buildingId,
        );
        from = new Date(maxDate);
        console.log("Max date:", from);
    } else {
        from = new Date(fromStr);
    }
    const predictions = await AIServerAPI.predictions(buildingId, from);

    res.json(predictions);
}

export default withIronSessionApiRoute(predictionsRoute, sessionOptions);
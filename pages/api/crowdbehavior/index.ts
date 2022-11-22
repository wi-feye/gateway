import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import CrowdBehavior from "../../../src/models/crowdbehavior";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

function createDummyDatapoints(): number[][] {
    const heatmapPoints: number[][] = [];
    for (let i = 0; i < 100; i++) {
        const southWestLat = 43.72000507825915;
        const southWestLng = 10.404776930809023;
        const northEastLat = 43.721633397696806;
        const northEastLng = 10.41134834289551;
        const latitude = Math.random() * (northEastLat - southWestLat) + southWestLat;
        const longitude = Math.random() * (northEastLng - southWestLng) + southWestLng;
        heatmapPoints.push([latitude, longitude]);
    }

    return heatmapPoints;
}

let pointsList: number[][][] = [];
pointsList[0] = createDummyDatapoints();
for (let i = 1; i < 20; i++) {
    const newPoints: number[][] = pointsList[i-1].map((arr) => {
        return [
            arr[0] + Math.random() / 10000,
            arr[1] + Math.random() / 10000
        ];
    });
    pointsList.push(newPoints);
}

async function route(req: NextApiRequest, res: NextApiResponse<CrowdBehavior[]>) {
    gateway_logger(req);

    const { buildingId, from, to } = req.query;

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    if (from == null || to == null) {
        res.status(400).end();
        return;
    }

    const user = req.session.user;
    const fromDate = new Date(Array.isArray(from) ? from[0] : from);
    const toDate = new Date(Array.isArray(to) ? to[0] : to);

    //const response = buildingId ? await DataManagerAPI.crowdBehavior(buildingId, fromDate, toDate):[];

    const response: CrowdBehavior[] = [];
    pointsList.forEach(points => {
        response.push({
            from: new Date(2022, 11, 1, 0, 0, 0),
            to: new Date(2022, 11, 1, 23, 59, 59),
            data: points
        });
    });

    res.json(response);
}

export default withIronSessionApiRoute(route, sessionOptions);
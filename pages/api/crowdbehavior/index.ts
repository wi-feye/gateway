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

    if (from == null || to == null || buildingId == null) {
        res.status(400).end();
        return;
    }

    const user = req.session.user;
    const fromDate = new Date(Array.isArray(from) ? from[0] : from);
    const toDate = new Date(Array.isArray(to) ? to[0] : to);
    const positions = await DataManagerAPI.crowdBehavior(
        Array.isArray(buildingId) ? buildingId[0] : buildingId,
        fromDate,
        toDate
    );

    if (positions.length == 0) {
        res.json([]);
        return;
    }

    const sortedByTime = positions.sort(function(x, y){
        return x.timestamp < y.timestamp ? -1:1;
    })

    const response: CrowdBehavior[] = [];
    const minutesGap = 2;

    let startTime = new Date(sortedByTime[0].timestamp); // start from the oldest one
    startTime.setSeconds(0);
    let endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + minutesGap);
    endTime.setSeconds(59);
    if (endTime > toDate) endTime = new Date(endTime);

    let current: CrowdBehavior = {
        from: startTime.toISOString(),
        to: endTime.toISOString(),
        data: []
    };
    sortedByTime.forEach((pos) => {
        const posDate = new Date(pos.timestamp);
        if (posDate > endTime) {
            // start becomes end + 1 minute
            startTime = new Date(endTime);
            startTime.setMinutes(endTime.getMinutes() + 1);
            startTime.setSeconds(0);
            // end becomes new start + <minutesGap> minutes
            endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + minutesGap);
            endTime.setSeconds(59);
            //if (endTime > toDate) endTime = new Date(endTime);
            current = {
                from: startTime.toISOString(),
                to: endTime.toISOString(),
                data: [pos]
            }
            response.push(current);
            console.log("--- FROM:", current.from, ", TO:", current.to, "---");
        } else {
            current.data.push(pos);
        }
        console.log(pos.timestamp)
    });
    // OLDEST 2022-11-09T16:20:10Z
    // NEWEST 2022-11-09T17:16:40Z

    if (response.length == 1 && response[0].data.length == 0) {
        res.json([]);
        return;
    }

    res.json(response);
}

export default withIronSessionApiRoute(route, sessionOptions);
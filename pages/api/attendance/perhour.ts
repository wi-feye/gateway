import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import Attendance from "../../../src/models/attendance";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";
import { splitByDuration } from "../../../src/restapi/gateway/gatewayUtils";
import CrowdPosition from "../../../src/models/crowdposition";
import CrowdBehavior from "../../../src/models/crowdbehavior";

async function route(req: NextApiRequest, res: NextApiResponse<Attendance[]>) {
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
    const fromDate = from ? (Array.isArray(from) ? from[0] : from):undefined;
    const toDate = to ? (Array.isArray(to) ? to[0] : to): undefined;

    const crowdBehaviorResponse = await DataManagerAPI.crowdBehavior(
        Array.isArray(buildingId) ? buildingId[0] : buildingId,
        fromDate,
        toDate
    );

    // hashmap area id -> list of positions
    const positionsPerAreaHashMap: { [areaId: number] : CrowdPosition[]; }  = {};
    const areasId: number[] = [];
    crowdBehaviorResponse.forEach(pos => {
        if (pos.id_area !== -1) {
            if (pos.id_area in positionsPerAreaHashMap) {
                positionsPerAreaHashMap[pos.id_area].push(pos);
            } else {
                positionsPerAreaHashMap[pos.id_area] = [pos];
                areasId.push(pos.id_area);
            }
        }
    });

    // split positions in each area into chunks of 60 minutes
    const positionsChunksPerArea: { [areaId: number] : CrowdBehavior[]; }  = {};
    areasId.forEach(id => positionsChunksPerArea[id] = splitByDuration(positionsPerAreaHashMap[id], 60));

    const todayDate: Date = new Date(Date.now());

    const attendancePerAreaByHour: { [areaId: number] : Attendance[]; }  = {};
    areasId.forEach(id => {
        if (positionsChunksPerArea[id].length > 0) {
            positionsChunksPerArea[id][0].from
            attendancePerAreaByHour[id] = [];
            for (let i = 0; i < 24; i++) {
                const fromDate = new Date(todayDate);
                fromDate.setUTCHours(i, 0, 0, 0);
                const toDate = new Date(todayDate);
                toDate.setUTCHours(i, 59, 59, 999);
                attendancePerAreaByHour[id].push({
                    id_area: id,
                    from: fromDate.toISOString(),
                    to: toDate.toISOString(),
                    count: 0,
                })
            }
        }
    });

    areasId.forEach(id => {
        const positionsInsideArea = positionsChunksPerArea[id];
        positionsInsideArea.forEach(crowdBeh => {
            const timeIndex = new Date(crowdBeh.from).getUTCHours();
            if (timeIndex < attendancePerAreaByHour[id].length) {
                attendancePerAreaByHour[id][timeIndex].count += crowdBeh.data.length;
            }
        })
    });

    const response: Attendance[] = [];
    areasId.map( id => response.push(...attendancePerAreaByHour[id]) );

    res.json(response);
}

export default withIronSessionApiRoute(route, sessionOptions);
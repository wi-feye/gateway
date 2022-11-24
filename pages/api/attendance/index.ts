import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import Attendance from "../../../src/models/attendance";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";
import { splitByDuration } from "../../../src/restapi/gateway/gatewayUtils";

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

    const positions = splitByDuration(crowdBehaviorResponse, 60);

    const areaAttendanceHashMap: { [areaId: number] : Attendance; }  = {};
    const areasId: number[] = [];
    positions.forEach(crowd => {
        crowd.data.forEach(pos => {
            if (pos.id_area !== -1) {
                if (pos.id_area in areaAttendanceHashMap) {
                    //const index = new Date(pos.timestamp).getHours();
                    //areaAttendanceHashMap[pos.id_area][index].count += 1;
                    areaAttendanceHashMap[pos.id_area].count += 1;
                } else {
                    /*let areaAttendance: Attendance[] = [];
                    for (let i = 0; i < 24; i++) {
                        const fromDate = new Date();
                        fromDate.setHours(i);
                        const toDate = new Date();
                        toDate.setHours(i + 1);
                        areaAttendance.push({
                            id_area: pos.id_area,
                            from: fromDate.toISOString(),
                            to: toDate.toISOString(),
                            count: 0
                        })
                    }*/
                    areaAttendanceHashMap[pos.id_area] = {
                        id_area: pos.id_area,
                        from: crowd.from,
                        to: crowd.to,
                        count: 0
                    };
                    areasId.push(pos.id_area);
                }
            }
        });
    });

    res.json(areasId.map( id => areaAttendanceHashMap[id] ));
}

export default withIronSessionApiRoute(route, sessionOptions);
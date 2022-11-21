import { NextApiRequest, NextApiResponse } from 'next'
import Area from '../../../src/models/area';
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../src/auth/session";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

const MIT_AREAS: Area[] = [
    {
        id: 84564564,
        name: "Area MIT 1",
        description: "Area description"
    },
    {
        id: 98764564,
        name: "Area MIT 2",
        description: "Area description 2"
    },
    {
        id: 98756325,
        name: "Area MIT 3",
        description: "Area description 3"
    }
]

const FIB_AREAS: Area[] = [
    {
        id: 84564564,
        name: "Area FIB 1",
        description: "Area description"
    },
    {
        id: 98764564,
        name: "Area FIB 2",
        description: "Area description 2"
    },
    {
        id: 98756325,
        name: "Area FIB 3",
        description: "Area description 3"
    }
]

async function listRoute(req: NextApiRequest, res: NextApiResponse<Area[]>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    const buildingId = Array.isArray(req.query.buildingId) ? req.query.buildingId[0]:req.query.buildingId;
    if (!buildingId) {
        res.json([]);
        return;
    }
    const areas = buildingId ? await DataManagerAPI.areas(parseInt(buildingId)):[];
    res.json(areas);
}

export default withIronSessionApiRoute(listRoute, sessionOptions);
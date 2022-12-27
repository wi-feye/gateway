import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/auth/session'
import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {FetchError} from "../../../src/restapi";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

async function deleteBuildingRoute(req: NextApiRequest, res: NextApiResponse) {
    gateway_logger(req);
    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const idBuilding = Array.isArray(req.query.idBuilding) ? req.query.idBuilding[0] : req.query.idBuilding;
    if (!idBuilding) {
        res.status(400).end();
        return;
    }

    try {
        console.log( idBuilding)
        await DataManagerAPI.deleteBuilding(idBuilding);
        res.status(200).end()
    } catch (error) {
        if (error instanceof FetchError) {
            const fetchError = (error as FetchError);
            const errorCode = fetchError.response.status == 401 ? 401:500;
            const errorMsg = errorCode == 401 ? "Invalid credentials":fetchError.message;
            res.status(errorCode).json({ message: errorMsg });
        } else {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default withIronSessionApiRoute(deleteBuildingRoute, sessionOptions)
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/auth/session'
import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import {FetchError} from "../../../src/restapi";
import DataManagerAPI from "../../../src/restapi/gateway/datamanagerapi";

async function deleteSnifferRoute(req: NextApiRequest, res: NextApiResponse) {
    gateway_logger(req);
    const idSniffer = Array.isArray(req.query.idSniffer) ? req.query.idSniffer[0] : req.query.idSniffer;

    try {
        console.log( idSniffer)
        await DataManagerAPI.deleteSniffer(idSniffer);

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

export default withIronSessionApiRoute(deleteSnifferRoute, sessionOptions)
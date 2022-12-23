import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import DataManagerAPI from '../../../src/restapi/gateway/datamanagerapi';
import TmpCode from '../../../src/models/tmpcode';

async function genTmpCode(req: NextApiRequest, res: NextApiResponse<TmpCode>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    const tmpCode = await DataManagerAPI.genTmpCode(user.id);

    res.json(tmpCode);
}

export default withIronSessionApiRoute(genTmpCode, sessionOptions);
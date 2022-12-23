import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import DataManagerAPI from '../../../src/restapi/gateway/datamanagerapi';

async function userTelegramDelete(req: NextApiRequest, res: NextApiResponse) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    await DataManagerAPI.userTelegramDelete(user.id);

    res.status(200).end()
}

export default withIronSessionApiRoute(userTelegramDelete, sessionOptions);
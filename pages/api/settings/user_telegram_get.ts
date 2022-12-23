import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../src/auth/session";
import DataManagerAPI from '../../../src/restapi/gateway/datamanagerapi';
import UserTelegram from '../../../src/models/user_telegram';

async function userTelegramGet(req: NextApiRequest, res: NextApiResponse<UserTelegram>) {
    gateway_logger(req);

    if (!req.session.user || !req.session.user.isLoggedIn) {
        res.status(401).end();
        return;
    }

    const user = req.session.user;
    const userTelegram = await DataManagerAPI.userTelegramGet(user.id);

    res.json(userTelegram);
}

export default withIronSessionApiRoute(userTelegramGet, sessionOptions);
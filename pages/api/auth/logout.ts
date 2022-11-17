import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/auth/session'
import { NextApiRequest, NextApiResponse } from 'next'
import {User} from "../../../src/models/user";
import gateway_logger from "../../../src/restapi/gateway_logger";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    gateway_logger(req);
    req.session.destroy()
    res.json({ isLoggedIn: false, login: '', avatarUrl: '' })
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
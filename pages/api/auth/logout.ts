import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/auth/session'
import { NextApiRequest, NextApiResponse } from 'next'
import {User} from "../../../src/models/user";
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    gateway_logger(req);
    req.session.destroy();
    res.json({
        email: "",
        id: -1,
        zerynth_api_key: "",
        isLoggedIn: false,
        name: '',
        surname: '',
        avatarUrl: ''
    })
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions)
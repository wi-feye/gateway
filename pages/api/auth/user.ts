import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/auth/session'
import { NextApiRequest, NextApiResponse } from 'next'
import {User} from "../../../src/models/user";
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import UserManagerAPI from "../../../src/restapi/gateway/usermanagerapi";

async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
    gateway_logger(req);
    if (req.session.user) {
        // in a real world application you might read the user id from the session and then do a database request
        // to get more information on the user if needed
        const userWithInfo = req.session.user.id ? await UserManagerAPI.user(req.session.user.id):req.session.user;
        res.json({
            ...userWithInfo,
            isLoggedIn: true,
        })
    } else {
        res.json({
            email: "",
            id: -1,
            apikey_zerynth: "",
            isLoggedIn: false,
            name: '',
            surname: '',
        })
    }
}

export default withIronSessionApiRoute(userRoute, sessionOptions)
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/auth/session'
import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway/gateway_logger";
import UserManagerAPI from "../../../src/restapi/gateway/usermanagerapi";
import {FetchError} from "../../../src/restapi";

async function registerRoute(req: NextApiRequest, res: NextApiResponse) {
    gateway_logger(req);
    const { email, password, name, surname,apikey_zerynth} = await req.body

    try {
        /*const {
            data: { login, avatar_url },
        } = await octokit.rest.users.getByEmail({ email })

        const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User*/
        const userLoggedIn = await UserManagerAPI.register(email, password, name, surname,apikey_zerynth);
        userLoggedIn.isLoggedIn = true;
        userLoggedIn.avatarUrl = "/assets/images/avatar-2.png";
        req.session.user = userLoggedIn;
        await req.session.save();
        res.json(userLoggedIn);
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

export default withIronSessionApiRoute(registerRoute, sessionOptions)
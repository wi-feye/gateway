import {User} from "../../../src/models/user";

import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../src/auth/session'
import { NextApiRequest, NextApiResponse } from 'next'
import gateway_logger from "../../../src/restapi/gateway_logger";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    gateway_logger(req);
    const { email, password } = await req.body

    try {
        /*const {
            data: { login, avatar_url },
        } = await octokit.rest.users.getByEmail({ email })

        const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User*/
        const user = { isLoggedIn: true, login: "Gustavo Milan", avatarUrl: "/assets/images/avatar-2.png" } as User
        req.session.user = user
        await req.session.save()
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: (error as Error).message })
    }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)
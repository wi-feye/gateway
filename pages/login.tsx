import Head from 'next/head'
import Login from "../src/pages/login";
import {overviewRoute} from "../src/routes";
import {useUser} from "../src/restapi";

export default function LoginPage() {
    // just check if user is already logged in and redirect to profile
    const { mutateUser } = useUser({
        redirectTo: overviewRoute.url,
        redirectIfFound: true,
    })

    return (
        <>
            <Login/>
            <Head>
                <title>WiFeye | Login</title>
                <meta name="description" content="Crowd Behavior Analysis"/>
            </Head>
        </>
    )
}

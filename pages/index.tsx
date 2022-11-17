import {useEffect} from "react";
import Router from "next/router";
import {loginRoute, overviewRoute} from "../src/routes";
import LoadingSplashScreen from "../src/components/LoadingSplashScreen";
import {useUser} from "../src/restapi";

export default function HomePage() {
    const { user } = useUser({ redirectTo: loginRoute.url })
    useEffect(() => {
        if (!user || !user.isLoggedIn) {
            Router.push(loginRoute.url);
        } else {
            Router.push(overviewRoute.url);
        }
    }, []);

    return <LoadingSplashScreen />
}

import {loginRoute} from "../src/routes";
import LoadingSplashScreen from "../src/components/LoadingSplashScreen";
import MainLayout from "../src/layout";
import Head from "next/head";
import {useUser} from "../src/restapi";
import Areas from "../src/pages/areas";
import useAvailableBuildings from "../src/building/useAvailableBuildings";

export default function AreasPage() {
    const { user } = useUser({ redirectTo: loginRoute.url });
    const isLoadingBuildings = useAvailableBuildings(user);

    // Server-render loading state
    if (!user || !user.isLoggedIn || isLoadingBuildings) {
        return <LoadingSplashScreen />;
    }

    return (
        <MainLayout>
            <Areas />
            <Head>
                <title>WiFeye | Areas</title>
                <meta name="description" content="Crowd Behavior Analysis" />
            </Head>
        </MainLayout>
    )
}
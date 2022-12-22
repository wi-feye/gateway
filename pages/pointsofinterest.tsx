import {loginRoute} from "../src/routes";
import LoadingSplashScreen from "../src/components/LoadingSplashScreen";
import MainLayout from "../src/layout";
import Head from "next/head";
import {useUser} from "../src/restapi";
import useAvailableBuildings from "../src/building/useAvailableBuildings";
import PoiPageContent from "../src/pages/poi";

export default function POIPage() {
    const { user } = useUser({ redirectTo: loginRoute.url });
    const isLoadingBuildings = useAvailableBuildings(user);

    // Server-render loading state
    if (!user || !user.isLoggedIn || isLoadingBuildings) {
        return <LoadingSplashScreen />;
    }

    return (
        <MainLayout>
            <PoiPageContent />
            <Head>
                <title>WiFeye | Points of interest</title>
                <meta name="description" content="Crowd Behavior Analysis" />
            </Head>
        </MainLayout>
    )
}
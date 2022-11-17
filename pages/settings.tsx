import Head from 'next/head'
import MainLayout from "../src/layout";
import Overview from "../src/pages/overview";
import {loginRoute} from "../src/routes";
import LoadingSplashScreen from "../src/components/LoadingSplashScreen";
import {useUser} from "../src/restapi";
import useAvailableBuildings from "../src/building/useAvailableBuildings";

export default function SettingsPage() {
    // Fetch the user client-side
    const { user } = useUser({ redirectTo: loginRoute.url })
    const isLoadingBuildings = useAvailableBuildings(user);

    // Server-render loading state
    if (!user || !user.isLoggedIn || isLoadingBuildings) {
        return <LoadingSplashScreen />;
    }

    return (
        <MainLayout>
            <Overview />
            <Head>
                <title>WiFeye | Settings</title>
                <meta name="description" content="Crowd Behavior Analysis" />
            </Head>
        </MainLayout>
    )
}
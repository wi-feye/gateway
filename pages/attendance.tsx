import {loginRoute} from "../src/routes";
import LoadingSplashScreen from "../src/components/LoadingSplashScreen";
import MainLayout from "../src/layout";
import Overview from "../src/pages/overview";
import Head from "next/head";
import {useUser} from "../src/restapi";
import useAvailableBuildings from "../src/building/useAvailableBuildings";
import Attendance from "../src/pages/attendance";

export default function AttendancePage() {
    const { user } = useUser({ redirectTo: loginRoute.url })
    const isLoadingBuildings = useAvailableBuildings(user);

    // Server-render loading state
    if (!user || !user.isLoggedIn || isLoadingBuildings) {
        return <LoadingSplashScreen />;
    }

    return (
        <MainLayout>
            <Attendance />
            <Head>
                <title>WiFeye | Attendance</title>
                <meta name="description" content="Crowd Behavior Analysis" />
            </Head>
        </MainLayout>
    )
}
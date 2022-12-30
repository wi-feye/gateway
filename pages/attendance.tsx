import {loginRoute} from "../src/routes";
import LoadingSplashScreen from "../src/components/LoadingSplashScreen";
import MainLayout from "../src/layout";
import Head from "next/head";
import {useUser} from "../src/restapi";
import useAvailableBuildings from "../src/building/useAvailableBuildings";
import Attendance from "../src/pages/attendance";
import NoDataComponent from "../src/components/NoDataComponent";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../src/store";
import AddNewBuildingForm from "../src/components/AddNewBuildingForm";
import CreateFirstBuildingPageContent from "../src/components/CreateFirstBuildingPageContent";

export default function AttendancePage() {
    const { user } = useUser({ redirectTo: loginRoute.url })
    const isLoadingBuildings = useAvailableBuildings(user);
    const buildingState = useSelector((state: RootState) => state.building);

    // Server-render loading state
    if (!user || !user.isLoggedIn || isLoadingBuildings) {
        return <LoadingSplashScreen />;
    }

    if (buildingState.availableBuildings.length == 0) {
        return <CreateFirstBuildingPageContent />
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
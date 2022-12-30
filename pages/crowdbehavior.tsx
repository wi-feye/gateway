import {loginRoute} from "../src/routes";
import LoadingSplashScreen from "../src/components/LoadingSplashScreen";
import MainLayout from "../src/layout";
import Head from "next/head";
import {useUser} from "../src/restapi";
import useAvailableBuildings from "../src/building/useAvailableBuildings";
import CrowdBehaviorPageContent from "../src/pages/crowdbehavior";
import {useSelector} from "react-redux";
import {RootState} from "../src/store";
import CreateFirstBuildingPageContent from "../src/components/CreateFirstBuildingPageContent";
import React from "react";

export default function CrowdBehaviorPage() {
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
            <CrowdBehaviorPageContent />
            <Head>
                <title>WiFeye | Crowd Behavior</title>
                <meta name="description" content="Crowd Behavior Analysis" />
            </Head>
        </MainLayout>
    )
}
import MainLayout from "../src/layout";
import Head from "next/head";
import dynamic from "next/dynamic";
import {Box, Grid, Typography} from "@mui/material";
import MainCard from "../src/components/MainCard";
import {useEffect, useState} from "react";

const Map = dynamic(() => import('../src/components/Map'), {
    ssr: false
});

function createDummyHeatmap(): number[][] {
    const heatmapPoints: number[][] = [];
    for (let i = 0; i < 100; i++) {
        const southWestLat = 43.72167604356356;
        const southWestLng = 10.40532946586609;
        const northEastLat = 43.723304317587534;
        const northEastLng = 10.410007238388063;
        const latitude = Math.random() * (northEastLat - southWestLat) + southWestLat;
        const longitude = Math.random() * (northEastLng - southWestLng) + southWestLng;
        heatmapPoints.push([latitude, longitude]);
    }

    return heatmapPoints;
}

let pointsList: number[][][] = [];
pointsList[0] = createDummyHeatmap();
for (let i = 1; i < 30; i++) {
    const newPoints: number[][] = pointsList[i-1].map((arr) => {
        return [
            arr[0] + Math.random() / 10000,
            arr[1] + Math.random() / 10000
        ];
    });
    pointsList.push(newPoints);
}

export default function HeatmapPage() {
    const [pointsTime, setPointsTime] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPointsTime((pointsTime + 1) % pointsList.length);
        }, 500);
        return () => clearInterval(interval);
    }, [pointsTime]);

    return (
        <MainLayout>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12} md={7} lg={8}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Map</Typography>
                        </Grid>
                    </Grid>
                    <MainCard content={false} sx={{ mt: 1.5 }}>
                        <Box style={{ position: "relative" }}>
                            <Map
                                center={[43.72249, 10.40767, 10.40767]}
                                height={420}
                                heatmapPoints={pointsList[pointsTime]}
                            />
                        </Box>
                    </MainCard>
                </Grid>
            </Grid>
            <Head>
                <title>WiFeye | Heatmap</title>
                <meta name="description" content="Crowd Behavior Analysis" />
            </Head>
        </MainLayout>
    )
}
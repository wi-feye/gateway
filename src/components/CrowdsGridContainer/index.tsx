import {Box, Grid, IconButton, LinearProgress, Typography} from "@mui/material";
import {PauseCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";
import MainCard from "../MainCard";
import {useEffect, useState} from "react";
import CrowdBehavior from "../../models/crowdbehavior";
import dynamic from "next/dynamic";
import Area from "../../models/area";

const Map = dynamic(() => import('../../components/Map'), {
    ssr: false
});

type CrowdsGridContainerProps = {
    crowdBehavior: CrowdBehavior[] | undefined,
    isLoading: boolean,
    height: number,
    title: string,
    areas?: Area[]
}
export default function CrowdsGridContainer({ title, areas, crowdBehavior, isLoading, height }: CrowdsGridContainerProps) {
    const [mapProgress, setMapProgress] = useState<number>(0);
    const [index, setIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const milliseconds = 400;

    useEffect(() => {
        setIsPlaying(!isLoading && crowdBehavior ? crowdBehavior.length > 1:false);
    }, [isLoading, crowdBehavior]);

    useEffect(() => {
        if (!crowdBehavior || crowdBehavior.length < 1) return;
        if (!isPlaying) return;

        const interval = setInterval(() => {
            if (!isPlaying) return;

            const newIndex = (index + 1) % crowdBehavior.length;
            setMapProgress( () => {
                if (crowdBehavior && crowdBehavior?.length > 1)
                    return (newIndex * 100) / (crowdBehavior?.length-1);

                return 0;
            });
            setIndex(newIndex);

        }, milliseconds);

        return () => clearInterval(interval);
    }, [index, crowdBehavior, isPlaying]);

    const onPlayPause = () => {
        setIsPlaying(!isPlaying);
    }

    return (
        <>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">{title}</Typography>
                </Grid>
                <Grid item>
                    <IconButton
                        color="default"
                        aria-label="play/pause"
                        size="large"
                        onClick={onPlayPause}>
                        { isPlaying ? <PauseCircleOutlined />:<PlayCircleOutlined /> }
                    </IconButton>
                </Grid>
            </Grid>
            <MainCard content={false} sx={{mt: 2}}>
                <Box>
                    <div style={{ width: "100%" }}>
                        <LinearProgress
                            className="disable-bar-transition"
                            variant="determinate"
                            value={mapProgress} />
                    </div>
                </Box>
                <Box style={{position: "relative"}}>
                    <Map
                        height={height}
                        heatmapPoints={crowdBehavior ? crowdBehavior[index].data : []}
                        areas={areas ? areas:[]}
                        fitAreasBounds
                    />
                </Box>
            </MainCard>
        </>
    );
}
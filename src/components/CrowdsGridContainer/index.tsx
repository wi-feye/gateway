import { Box, Grid, IconButton, LinearProgress, Slider, Typography } from "@mui/material";
import { PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import MainCard from "../MainCard";
import { useEffect, useState } from "react";
import CrowdBehavior from "../../models/crowdbehavior";
import dynamic from "next/dynamic";
import Area from "../../models/area";

const Map = dynamic(() => import('../../components/Map'), {
    ssr: false
});

type CrowdsGridContainerProps = {
    crowdBehavior: CrowdBehavior[],
    isLoading: boolean,
    height: number,
    title: string,
    areas?: Area[],
    milliseconds: number,
}
export default function CrowdsGridContainer({ title, areas, crowdBehavior, isLoading, height, milliseconds }: CrowdsGridContainerProps) {
    const [mapProgress, setMapProgress] = useState<number>(0);
    const [index, setIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        setIsPlaying(!isLoading && crowdBehavior ? crowdBehavior.length > 1 : false);
    }, [isLoading, crowdBehavior]);

    useEffect(() => {
        if (!crowdBehavior || crowdBehavior.length < 1) return;
        if (!isPlaying) return;

        const interval = setInterval(() => {
            if (!isPlaying) return;

            const newIndex = (index + 1) % crowdBehavior.length;
            setMapProgress(() => {
                if (crowdBehavior && crowdBehavior?.length > 1)
                    return (newIndex * 100) / (crowdBehavior?.length - 1);

                return 0;
            });
            setIndex(newIndex);
        }, milliseconds);

        return () => clearInterval(interval);
    }, [index, crowdBehavior, isPlaying]);

    const onPlayPause = () => {
        setIsPlaying(!isPlaying);
    }

    const handleChangeMapProgress = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (newValue) {
            const value = Array.isArray(newValue) ? newValue[0] : newValue
            setMapProgress(value);
            setIndex(() => {
                if (crowdBehavior && crowdBehavior?.length > 1) {
                    const index = (value / 100) * (crowdBehavior?.length - 1);
                    return Math.round(index);
                }
                return 0;
            });
        }
    };

    const currentTimeStr = crowdBehavior && crowdBehavior.length > index ? new Date(crowdBehavior[index].to).toLocaleString() : "";

    return (
        <>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">{title}</Typography>
                </Grid>
                <Grid item alignItems="center">
                    <span style={{ marginTop: "auto" }}>
                        {currentTimeStr}
                    </span>
                    <IconButton
                        color="default"
                        aria-label="play/pause"
                        size="large"
                        onClick={onPlayPause}>
                        {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    </IconButton>
                </Grid>
            </Grid>
            <MainCard content={false} sx={{ mt: 2 }}>
                {(crowdBehavior && crowdBehavior.length > 0) && <Box>
                        <div style={{ width: "100%", padding: "10px" }}>
                            <Slider
                                value={mapProgress}
                                onChange={handleChangeMapProgress}
                                min={0}
                                max={100}
                            />
                        </div>
                    </Box>
                }
                <Box style={{ position: "relative" }}>
                    <Map
                        height={height}
                        heatmapPoints={crowdBehavior && crowdBehavior.length > index ? crowdBehavior[index].data : []}
                        areas={areas ? areas : []}
                        fitAreasBounds
                    />
                </Box>
            </MainCard>
        </>
    );
}
import {useEffect, useState} from 'react';

// material-ui
import {
    Box,
    Button,
    Grid,
    Stack,
    Typography
} from '@mui/material';

// project import
import {
    useAreas,
    useMaxDate,
    usePredictedAttendance
} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import ChartPredictionAreaAttendance from "./ChartPredictionAreaAttendance";
import MainCard from "../../components/MainCard";
import PredictedAttendance from "../../models/predictedAttendance";

function getPredictionByAreaId(predictions: PredictedAttendance[], areaId: number): (PredictedAttendance | undefined) {
    // R.I.P. EFFICIENZA :(
    const pred = predictions.find(pre => pre.id_area === areaId.toString());
    return pred;
}

const FutureAttendancePage = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { areas, isLoading: isLoadingAreas } = useAreas(selectedBuilding?.id);
    const { maxDate, isLoading: isLoadingMaxDate } = useMaxDate(selectedBuilding?.id);
    const { predictedAttendance, isLoading: isLoadingPredictedAttendance } = usePredictedAttendance(selectedBuilding?.id, maxDate);

    const [buildingAttendance, setBuildingAttendance] = useState<PredictedAttendance>();
    const [categories, setCategories] = useState<string[]>();

    useEffect(() => {
        if (!predictedAttendance) return;
        const newBuildingAttendance: PredictedAttendance = {
            id_area: "-1",
            minutesGap: 10,
            from: "",
            count: []
        }
        for (let i = 0; i < predictedAttendance.length; i++) {
            const prediction = predictedAttendance[i];
            newBuildingAttendance.from = prediction.from;
            newBuildingAttendance.minutesGap = prediction.minutesGap;
            for (let j = 0; j < prediction.count.length; j++) {
                if (newBuildingAttendance.count.length <= j) newBuildingAttendance.count.push(0);
                newBuildingAttendance.count[j] += prediction.count[j];
            }
        }
        setBuildingAttendance(newBuildingAttendance);
    }, [predictedAttendance]);

    useEffect(() => {
        const minutesGap = predictedAttendance && predictedAttendance.length > 0 ? predictedAttendance[0].minutesGap: 10;
        const newCategories: string[] = [];
        if (maxDate) {
            const fromDateCopy = new Date(maxDate);
            for (let i = 0; i < 12; i++) {
                newCategories.push((fromDateCopy.getHours()).toString() + ':' + (fromDateCopy.getMinutes() <= 9 ? '0' + fromDateCopy.getMinutes() : fromDateCopy.getMinutes()));
                fromDateCopy.setTime(fromDateCopy.getTime() + minutesGap * 60000);
            }
        }
        setCategories(newCategories);
    }, [maxDate, predictedAttendance]);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Building&apos;s predicted attendance</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <Button size="small" color='secondary' variant='text'>
                                Last update: { maxDate?.toLocaleString() }
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard sx={{mt: 2}} content={false}>
                    <ChartPredictionAreaAttendance
                        prediction={ predictedAttendance ? buildingAttendance:undefined}
                        isLoading={ isLoadingPredictedAttendance }
                        height={500}
                        categories={categories}
                    />
                </MainCard>
            </Grid>

            {/* row 2 */}
            { areas?.map((area, idx) =>
                <Grid item xs={12} md={4} lg={4} key={idx}>
                    <Grid item>
                        <Typography variant="h5">{ area.name }</Typography>
                    </Grid>
                    <MainCard sx={{mt: 2}} content={false}>
                        <Box sx={{p: 3, pb: 0}}>
                            <Stack spacing={2}>
                                <Typography variant="h6" color="textSecondary">
                                    Predicted attendance
                                </Typography>
                            </Stack>
                        </Box>
                        <ChartPredictionAreaAttendance
                            key={idx}
                            prediction={ predictedAttendance ? getPredictionByAreaId(predictedAttendance, area.id):undefined}
                            isLoading={isLoadingPredictedAttendance}
                            categories={categories}
                            height={450}
                        />
                    </MainCard>
                </Grid>
                )
            }
        </Grid>
    );
};

export default FutureAttendancePage;
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useState} from 'react';

// material-ui
import {
    Grid,
    TextField,
    Typography,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';

// assets
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider, MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import CrowdAreaChart from "./CrowdAreaChart";
import CrowdBarChart from "./CrowdBarChart";
import CrowdsGridContainer from "../../components/CrowdsGridContainer";
import {useAreas, useCrowdBehavior, usePointOfInterest} from "../../restapi";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const CrowdBehavior = () => {
    const [date, setDate] = useState<Date>(
        new Date("2022-11-09T16:20:10Z")
    );
    const [timeFrom, setTimeFrom] = useState<Date>(
        new Date("2022-11-09T16:20:10Z")
    );
    let [timeTo, setTimeTo] = useState<Date>(
        new Date("2022-11-09T17:16:40Z")
    );
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];

    const { crowdBehavior, isLoading: isLoadingCrowdBehavior } = useCrowdBehavior(selectedBuilding.id, timeFrom, timeTo);
    const { areas, isLoading: isLoadingAreas } = useAreas(selectedBuilding.id);

    const { pointOfInterest } = usePointOfInterest(selectedBuilding.id,timeFrom, timeTo);

    const handleChangeDate = (newValue: Date | null, keyboardInputValue?: string | undefined) => {
        if (newValue) setDate(newValue);
    };

    const handleChangeTimeFrom = (newValue: Date | null, keyboardInputValue?: string | undefined) => {
        if (newValue) setTimeFrom(newValue);
    };
    const handleChangeTimeTo = (newValue: Date | null, keyboardInputValue?: string | undefined) => {
        if (newValue) setTimeTo(newValue);
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{mb: -2.25}}>
                <Typography variant="h5">Crowd Behavior</Typography>
            </Grid>
            <Grid item xs={12} sx={{mb: -2.25}}>
                <Grid item xs={12} md={7} lg={8}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Date"
                            inputFormat="DD/MM/YYYY"
                            value={date}
                            onChange={handleChangeDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>
            <Grid item xs={12} mt={2} sm={6} md={4} lg={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                    label="Time From"
                    value={timeFrom}
                    onChange={handleChangeTimeFrom}
                    renderInput={(params) => <TextField {...params} />}
                />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12} mt={2} sm={6} md={4} lg={1}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                    label="Time To"
                    value={timeTo}
                    onChange={handleChangeTimeTo}
                    renderInput={(params) => <TextField {...params} />}
                />
                </LocalizationProvider>
            </Grid>
            {/* row 2 */}
            <Grid item xs={12}>
                <CrowdsGridContainer
                    title="Crowds"
                    crowdBehavior={crowdBehavior ? crowdBehavior:[]}
                    areas={areas}
                    isLoading={isLoadingCrowdBehavior}
                    height={480}
                />
            </Grid>

            {/* row 3 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Number of point of interest</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{mt: 2}} content={false}>
                    <CrowdAreaChart timeFrom={timeFrom} timeTo={timeTo} pointOfInterest={pointOfInterest ? pointOfInterest:[]} areas={areas? areas:[]}/>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Point of interest Area</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{mt: 2}} content={false}>
                    <CrowdBarChart pointOfInterest={pointOfInterest ? pointOfInterest:[]} areas={areas? areas:[]}/>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default CrowdBehavior;
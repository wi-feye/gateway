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

const Map = dynamic(() => import('../../components/Map'), {
    ssr: false
});

// assets
import dynamic from "next/dynamic";
import dayjs, {Dayjs} from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider, MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import CrowdAreaChart from "./CrowdAreaChart";
import CrowdBarChart from "./CrowdBarChart";
import CrowdsGridContainer from "../../components/CrowdsGridContainer";
import {useAreas, useCrowdBehavior, usePointOfInterest} from "../../restapi";


// ==============================|| DASHBOARD - DEFAULT ||============================== //

const CrowdBehavior = () => {
    const [date, setDate] = useState<Dayjs>(
        dayjs(),
    );
    const [timeFrom, setTimeFrom] = useState<Dayjs>(
        dayjs(),
    );
    const [timeTo, setTimeTo] = useState<Dayjs>(
        dayjs(),
    );
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];

    const { crowdBehavior, isLoading } = useCrowdBehavior(selectedBuilding.id,
        new Date(date.year(), date.month(), date.day(), timeFrom.hour(), timeFrom.minute(), timeFrom.second()),
        new Date(date.year(), date.month(), date.day(), timeTo.hour(), timeTo.minute(), timeTo.second()),
    );
    const { areas, isLoading: isLoadingAreas } = useAreas(selectedBuilding.id);

    const { pointOfInterest } = usePointOfInterest(selectedBuilding.id,
        new Date(date.year(), date.month(), date.day(), timeFrom.hour(), timeFrom.minute(), timeFrom.second()),
        new Date(date.year(), date.month(), date.day(), timeTo.hour(), timeTo.minute(), timeTo.second()),
    );

    const handleChangeDate = (newValue: Dayjs | null, keyboardInputValue?: string | undefined) => {
        if (newValue) setDate(newValue);
    };

    const handleChangeTimeFrom = (newValue: Dayjs | null, keyboardInputValue?: string | undefined) => {
        if (newValue) setTimeFrom(newValue);
    };
    const handleChangeTimeTo = (newValue: Dayjs | null, keyboardInputValue?: string | undefined) => {
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
                    crowdBehavior={crowdBehavior}
                    areas={areas}
                    isLoading={isLoading}
                    height={480}
                />
            </Grid>

            {/* row 3 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Number of crowds</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{mt: 2}} content={false}>
                    <CrowdAreaChart pointOfInterest={pointOfInterest ? pointOfInterest:[]} areas={areas? areas:[]}/>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Crowds per Area</Typography>
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
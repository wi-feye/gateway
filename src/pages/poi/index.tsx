// material-ui
import {
    Grid, Stack, TextField, Typography,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import {
    useAreas,
    useMaxDate,
    usePointOfInterest
} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dynamic from "next/dynamic";
import * as React from "react";
import {useEffect, useState} from "react";
import {LocalizationProvider, MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

const Map = dynamic(() => import('../../../src/components/Map'), {
    ssr: false
});
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const PoiPageContent = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];

    const { areas, isLoading: areasIsLoading } = useAreas(selectedBuilding?.id);
    const { maxDate, isLoading: isLoadingMaxDate } = useMaxDate(selectedBuilding?.id);

    const [date, setDate] = useState<Date>(new Date("2022-11-09T13:20:00Z"));
    const [timeFrom, setTimeFrom] = useState<Date>(new Date("2022-11-09T13:20:00Z"));
    const [timeTo, setTimeTo] = useState<Date>(new Date("2022-11-09T17:16:40Z"));
    const { pointOfInterest } = usePointOfInterest(selectedBuilding?.id, timeFrom, timeTo, 5);

    useEffect(() => {
        if (!isLoadingMaxDate) {
            if (maxDate) {
                const fromDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0);
                const toDate = new Date(maxDate);
                setDate(fromDate);
                setTimeFrom(fromDate);
                setTimeTo(toDate);
            }
        }
    }, [maxDate, isLoadingMaxDate]);

    const handleChangeDate = (newValue: Date | null, keyboardInputValue?: string | undefined) => {
        if (newValue) setDate(newValue);
    };

    const handleChangeTimeFrom = (newValue: Date | null, keyboardInputValue?: string | undefined) => {
        if (newValue) {
            newValue.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            setTimeFrom(newValue);
        }
    };
    const handleChangeTimeTo = (newValue: Date | null, keyboardInputValue?: string | undefined) => {
        if (newValue) {
            newValue.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            setTimeTo(newValue);
        }
    };

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <Typography variant="h5">Points of Interest</Typography>
            </Grid>
            {/* row 1 */}
            <Grid item xs={12}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            label="Date"
                            inputFormat="dd/MM/yyyy"
                            value={date}
                            onChange={handleChangeDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileTimePicker
                            label="From"
                            value={timeFrom}
                            onChange={handleChangeTimeFrom}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileTimePicker
                            label="To"
                            value={timeTo}
                            onChange={handleChangeTimeTo}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <MainCard content={false}>
                    <Map
                        height={420}
                        areas={areas || []}
                        pointOfInterest={pointOfInterest || []}
                        fitAreasBounds
                    />
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default PoiPageContent;
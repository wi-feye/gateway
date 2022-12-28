import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {useEffect, useState} from 'react';
import CrowdBehavior from "../../models/crowdbehavior";

// material-ui
import {
    Grid,
    Slider, Stack,
    TextField,
    Typography,
} from '@mui/material';

// assets
import { LocalizationProvider, MobileDatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import CrowdsGridContainer from "../../components/CrowdsGridContainer";
import {useAreas, useCrowdBehavior, useMaxDate} from "../../restapi";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import * as React from "react";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const CrowdBehaviorPageContent = () => {
    const DEFAULT_MILLISECONDS = 300;

    const [date, setDate] = useState<Date>(new Date("2022-11-09T13:20:00Z"));
    const [timeFrom, setTimeFrom] = useState<Date>(new Date("2022-11-09T13:20:00Z"));
    const [timeTo, setTimeTo] = useState<Date>(new Date("2022-11-09T17:16:40Z"));
    const [gap, setGap] = useState<number>(1);

    let [milliseconds, setMilliseconds] = useState<number>(DEFAULT_MILLISECONDS);
    let [index, setIndex] = useState<number>(2);
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];

    const { crowdBehavior, isLoading: isLoadingCrowdBehavior } = useCrowdBehavior(
        selectedBuilding.id,
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeFrom.getHours()+1, timeFrom.getMinutes(), timeFrom.getSeconds()),
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeTo.getHours()+1, timeTo.getMinutes(), timeTo.getSeconds()),
        gap
    );
    const { areas, isLoading: isLoadingAreas } = useAreas(selectedBuilding.id);
    const { maxDate, isLoading: isLoadingMaxDate } = useMaxDate(selectedBuilding.id);

    useEffect(() => {
        if (!isLoadingMaxDate) {
            if (maxDate) {
                const fromDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), timeFrom.getHours(), timeFrom.getMinutes(), timeFrom.getSeconds());
                const toDate = new Date(maxDate);
                setDate(fromDate);
                setTimeFrom(fromDate);
                setTimeTo(toDate);
            }
        }
    }, [maxDate, isLoadingMaxDate]);

    const handleChangeDate = (newValue: Date | null, keyboardInputValue?: string | undefined) => {
        if (newValue) {
            setDate(newValue);
        }
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
    const handleChangeGap = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (newValue) {
            setGap(Array.isArray(newValue) ? newValue[0] : newValue);
        }
    };
    const handleChangeMilliseconds = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (newValue) {
            const value = Array.isArray(newValue) ? newValue[0] : newValue;
            setIndex(value);
            setMilliseconds(Math.round(DEFAULT_MILLISECONDS / calculateMarksValue(value)));
        }
    };
    const calculateMarksValue = (value: number) => {
        switch (value) {
            case 1:
                return 0.5;
            case 2:
                return 1;
            case 3:
                return 2;
            case 4:
                return 4;
            case 5:
                return 8;
        }
        return 1;
    }

    const marks = [1, 2, 3, 4, 5].map((value) => ({
        value,
        label: `${calculateMarksValue(value)}X`
    }));

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12}>
                <Typography variant="h5">Crowd Behavior</Typography>
            </Grid>
            <Grid item xs={12} md={8} >
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
                            label="Time From"
                            value={timeFrom}
                            onChange={handleChangeTimeFrom}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileTimePicker
                            label="Time To"
                            value={timeTo}
                            onChange={handleChangeTimeTo}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Stack>
            </Grid>
            {/* <Grid item xs={12} lg={6}>
                <Typography id="non-linear-slider">
                    Gap: {gap} minutes
                </Typography>
                <Slider
                    defaultValue={1}
                    value={gap}
                    onChange={handleChangeGap}
                    step={1}
                    marks
                    valueLabelDisplay="auto"
                    min={1}
                    max={30}
                />
            </Grid> */}
            <Grid item xs={12} md={4} >
                <Typography id="non-linear-slider">
                    Speed: {calculateMarksValue(index)}X
                </Typography>
                <Slider
                    value={index}
                    onChange={handleChangeMilliseconds}
                    step={1}
                    marks={marks}
                    min={1}
                    max={marks.length}
                />
            </Grid>

            {/* row 2 */}
            <Grid item xs={12} sx={{ mt: -3.5 }}>
                <CrowdsGridContainer
                    title=""
                    crowdBehavior={crowdBehavior ? crowdBehavior : []}
                    areas={areas}
                    isLoading={isLoadingCrowdBehavior}
                    height={480}
                    milliseconds={milliseconds}
                />
            </Grid>

            {/* row 3 */}
            {/*<Grid item xs={12} md={7} lg={8}>
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
            </Grid>*/}
        </Grid>
    );
};

export default CrowdBehaviorPageContent;
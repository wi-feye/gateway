import {Box, Button, Grid, Stack, TextField, Typography} from "@mui/material";
import MainCard from "../MainCard";
import AreaChart from "../AreaChart";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useCrowdBehavior, useMaxDate} from "../../restapi";
import {LocalizationProvider, MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

function BuildingAttendance() {
    const [slot, setSlot] = useState('hours');

    const [date, setDate] = useState<Date>(new Date("2022-11-09T13:20:00Z"));
    const [timeFrom, setTimeFrom] = useState<Date>(new Date("2022-11-09T14:20:00Z"));
    const [timeTo, setTimeTo] = useState<Date>(new Date("2022-11-09T17:16:40Z"));

    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];

    const { crowdBehavior: crowdBehavior60Minute, isLoading:isLoading1} = useCrowdBehavior(
        selectedBuilding.id,
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeFrom.getHours()+1, timeFrom.getMinutes(), timeFrom.getSeconds()),
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeTo.getHours()+1, timeTo.getMinutes(), timeTo.getSeconds()),
        30
    );
    const { crowdBehavior: crowdBehavior1Minute, isLoading:isLoading2 } = useCrowdBehavior(
        selectedBuilding.id,
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeFrom.getHours()+1, timeFrom.getMinutes(), timeFrom.getSeconds()),
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), timeTo.getHours()+1, timeTo.getMinutes(), timeTo.getSeconds()),
        5
    );

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

    return (
        <>
            <Grid container>
                {/* row 1 */}
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Building&apos;s attendance</Typography>
                        </Grid>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button
                                size="small"
                                onClick={() => setSlot('hours')}
                                color={slot === 'hours' ? 'primary' : 'secondary'}
                                variant={slot === 'hours' ? 'outlined' : 'text'}
                            >
                                30 Minutes
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setSlot('minute')}
                                color={slot === 'minute' ? 'primary' : 'secondary'}
                                variant={slot === 'minute' ? 'outlined' : 'text'}
                            >
                                5 Minutes
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
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
            </Grid>
            <MainCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}>
                    <AreaChart crowdBehavior={slot === 'hours' ? crowdBehavior60Minute:crowdBehavior1Minute}/>
                </Box>
            </MainCard>
        </>
    );
}

export default BuildingAttendance;
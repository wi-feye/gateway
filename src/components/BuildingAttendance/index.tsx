import {Box, Button, Grid, Stack, TextField, Typography} from "@mui/material";
import MainCard from "../MainCard";
import AreaChart from "../AreaChart";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useAreas, useCrowdBehavior, useMaxDate} from "../../restapi";
import {LocalizationProvider, MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";

function BuildingAttendance() {
    const [slot, setSlot] = useState('hours');

    const [date, setDate] = useState<Date>(new Date("2022-11-09T13:20:00Z"));
    const [timeFrom, setTimeFrom] = useState<Date>(new Date("2022-11-09T14:20:00Z"));
    const [timeTo, setTimeTo] = useState<Date>(new Date("2022-11-09T17:16:40Z"));
    const [gap, setGap] = useState<number>(1);

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
    console.log(crowdBehavior60Minute)
    console.log(crowdBehavior1Minute)

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
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                {/* row 1 */}
                <Grid item xs={12} sx={{ mb: -2.25 }}>
                    <Typography variant="h5">Building&apos;s attendance</Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            label="Date"
                            inputFormat="dd/MM/yyyy"
                            value={date}
                            onChange={handleChangeDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileTimePicker
                            label="Time From"
                            value={timeFrom}
                            onChange={handleChangeTimeFrom}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileTimePicker
                            label="Time To"
                            value={timeTo}
                            onChange={handleChangeTimeTo}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item>
                    <Stack direction="row" alignItems="center" spacing={0}>
                        <Button
                            size="small"
                            onClick={() => setSlot('hours')}
                            color={slot === 'hours' ? 'primary' : 'secondary'}
                            variant={slot === 'hours' ? 'outlined' : 'text'}
                        >
                            30 Minute
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setSlot('minute')}
                            color={slot === 'minute' ? 'primary' : 'secondary'}
                            variant={slot === 'minute' ? 'outlined' : 'text'}
                        >
                            5 Minute
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <MainCard content={false} sx={{ mt: 1.5 }}>
                <Box sx={{ pt: 1, pr: 2 }}>
                    <AreaChart
                        data1={crowdBehavior60Minute}
                        data2={crowdBehavior1Minute}
                        isHours={slot== 'hours'}
                        isLoading1={isLoading1}
                        isLoading2={isLoading2}
                    />
                </Box>
            </MainCard>
        </>
    );
}

export default BuildingAttendance;
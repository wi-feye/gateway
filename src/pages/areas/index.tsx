// material-ui
import {
    Grid, TextField, Typography,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import AreasTableComponent from './AreasTableComponent';
import {useAreas, useDevices, useMaxDate, usePointOfInterest, createArea, deleteArea, updateArea} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dynamic from "next/dynamic";
import {LocalizationProvider, MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {useEffect, useState} from "react";
import Area from "../../models/area";
import {EditedArea} from "../../components/Map";

const Map = dynamic(() => import('../../../src/components/Map'), {
    ssr: false
});

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const AreasPageContent = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { devices, isLoading } = useDevices(selectedBuilding.id);
    const { areas, isLoading: areasIsLoading, mutate: mutateAreas } = useAreas(selectedBuilding.id);
    const { maxDate, isLoading: isLoadingMaxDate } = useMaxDate(selectedBuilding.id);

    const onCreateAreas = async (points: number[][][]) => {
        console.log("Created " + points.length + " areas");
        const promises = points.map(location => createArea(selectedBuilding.id, location));
        await Promise.all(promises)
        mutateAreas();
    }

    const onDeleteAreas = async (areas: Area[]) => {
        console.log("Deleted "+areas.length+" areas");
        const promises = areas.map(area => deleteArea(selectedBuilding.id, area));
        await Promise.all(promises)
        mutateAreas();
    }

    const onEditAreas = async (editedAreas: EditedArea[]) => {
        console.log("Edited "+editedAreas.length+" areas");
        const promises = editedAreas.map(editedArea => updateArea(
            selectedBuilding.id, editedArea.area.id,
            editedArea.area.name, editedArea.area.description,
            editedArea.newLocation)
        );
        await Promise.all(promises)
        mutateAreas();
    }

    const onCreateDevices = (points: number[][]) => {


    }

    const onEditDevices = (points: number[][]) => {

    }

    const [date, setDate] = useState<Date>(
        new Date("2022-11-09T13:20:00Z")
    );
    const [timeFrom, setTimeFrom] = useState<Date>(
        new Date("2022-11-09T13:20:00Z")
    );
    let [timeTo, setTimeTo] = useState<Date>(
        new Date("2022-11-09T17:16:40Z")
    );

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

    const { pointOfInterest } = usePointOfInterest(selectedBuilding.id,timeFrom, timeTo, 5);


    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{mb: -2.25}}>
                <Typography variant="h5">Areas</Typography>
            </Grid>
                {/* row 1 */}
                <Grid item xs={12} sx={{ mb: -2.25 }}>
                    <Typography variant="h6">Select date for point of interest:</Typography>
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
            <Grid item xs={12}>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Map
                        height={420}
                        devices={devices}
                        areas={areas ? areas:[]}
                        pointOfInterest={pointOfInterest}
                        fitAreasBounds
                        editable={{
                            areas: true, // allow areas editing
                            devices: false // devices are NOT editable
                        }}
                        onCreateAreas={onCreateAreas}
                        onDeleteAreas={onDeleteAreas}
                        onEditAreas={onEditAreas}
                        onCreateDevices={onCreateDevices}
                        onEditDevices={onEditDevices}
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard content={false}>
                    <AreasTableComponent areas={areas} loading={isLoading}/>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default AreasPageContent;
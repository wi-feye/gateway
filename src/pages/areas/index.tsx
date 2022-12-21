// material-ui
import {
    Grid, Typography,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import AreasTableComponent from './AreasTableComponent';
import {createArea, deleteArea, updateArea, useAreas, useDevices} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dynamic from "next/dynamic";
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

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{mb: -2.25}}>
                <Typography variant="h5">Areas</Typography>
            </Grid>
            <Grid item xs={12}>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Map
                        height={420}
                        devices={devices}
                        areas={areas ? areas:[]}
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
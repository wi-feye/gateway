// material-ui
import {
    Grid
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import AreasTableComponent from './AreasTableComponent';
import {useAreas, useDevices, createArea, deleteArea, updateArea} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dynamic from "next/dynamic";
import Area from "../../models/area";
import EditedArea from "../../components/Map/models/EditedArea";

const Map = dynamic(() => import('../../../src/components/Map'), {
    ssr: false
});

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const AreasPageContent = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { devices, isLoading } = useDevices(selectedBuilding?.id);
    const { areas, isLoading: areasIsLoading, mutate: mutateAreas } = useAreas(selectedBuilding?.id);

    const onCreateAreas = async (points: number[][][]) => {
        console.log("Created " + points.length + " areas");
        const promises = points.map(location => createArea(selectedBuilding?.id, location));
        await Promise.all(promises)
        mutateAreas();
    }

    const onDeleteAreas = async (areas: Area[]) => {
        console.log("Deleted "+areas.length+" areas");
        const promises = areas.map(area => deleteArea(selectedBuilding?.id, area));
        await Promise.all(promises)
        mutateAreas();
    }

    const onEditAreas = async (editedAreas: EditedArea[]) => {
        console.log("Edited "+editedAreas.length+" areas");
        const promises = editedAreas.map(editedArea => updateArea(
            selectedBuilding?.id, editedArea.area.id,
            editedArea.area.name, editedArea.area.description,
            editedArea.newLocation)
        );
        await Promise.all(promises)
        mutateAreas();
    }

    const onEditAreaFromTable = (id: number, name: string, descr: string, location: number[][]) => {
        updateArea(selectedBuilding.id, id, name, descr, location).then(() => mutateAreas());
    }

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
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
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard content={false}>
                    <AreasTableComponent areas={areas} loading={isLoading} onEditArea={onEditAreaFromTable}/>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default AreasPageContent;
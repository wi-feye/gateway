// material-ui
import {
    Grid, Typography,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import AreasTableComponent from './AreasTableComponent';
import {useAreas, useDevices} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../../../src/components/Map'), {
    ssr: false
});

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Areas = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { devices, isLoading } = useDevices(selectedBuilding.id);
    const { areas, isLoading: areasIsLoading } = useAreas(selectedBuilding.id);

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

export default Areas;
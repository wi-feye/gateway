// material-ui
import {
    Grid,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import AreasTableComponent from './AreasTableComponent';
import {useAreas} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Areas = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { areas, isLoading } = useAreas(selectedBuilding.id);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <AreasTableComponent areas={areas} loading={isLoading}/>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Areas;
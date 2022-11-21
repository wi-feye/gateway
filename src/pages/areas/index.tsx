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
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../../../src/components/Map'), {
    ssr: false
});

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Areas = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { areas, isLoading } = useAreas(selectedBuilding.id);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Map
                        center={[43.72082, 10.40806]}
                        height={420}
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
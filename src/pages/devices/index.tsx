// material-ui
import {
    Grid,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import DevicesTableComponent from './DevicesTableComponent';
import {useDevices} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../../../src/components/PointMap'), {
    ssr: false
});
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Devices = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { devices, isLoading } = useDevices(selectedBuilding.id);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12}>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Map center={[43.72082, 10.40806]}
                         height={420}
                         devices={devices}
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard content={false}>
                    <DevicesTableComponent devices={devices} loading={isLoading}/>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Devices;
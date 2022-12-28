import {useEffect, useState} from 'react';

// material-ui
import {
    AvatarGroup,
    Box,
    Button,
    Grid,
    Stack,
    Typography
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import AttendanceBarChart from './AttendanceBarChart';
import LittleCard from '../../components/cards/statistics/LittleCard';

// assets
import {useAreas, useAttendance, useDevices} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import Attendance from "../../models/attendance";
import Area from "../../models/area";
import DevicesTableComponent from "../devices/DevicesTableComponent";
import BuildingAttendance from "../../components/BuildingAttendance";

function getAreaNameById(areas: Area[], areaId: number): string {
    // R.I.P. EFFICIENZA
    const area = areas.find(area => area.id == areaId);
    return area ? area.name:"";
}

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Overview = () => {
    const [lessBusy, setLessBusy] = useState<{
        attendance: number,
        areaName: string
    }>();
    const [mostBusy, setMostBusy] = useState<{
        attendance: number,
        areaName: string
    }>();

    const buildingState = useSelector((state: RootState) => state.building);
    console.log(buildingState)
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    console.log(selectedBuilding)
    const { attendance, isLoading: isLoadingAttendance } = useAttendance(selectedBuilding.id);
    const { areas, isLoading: isLoadingAreas } = useAreas(selectedBuilding.id);
    const { devices, isLoading } = useDevices(selectedBuilding.id);

    useEffect(() => {
        if (!areas) return;

        let newLessBusy: Attendance;
        let newMostBusy: Attendance;
        if (attendance && attendance.length > 0) {
            newLessBusy = attendance[0];
            newMostBusy = attendance[0];
            for (let i = 1; i < attendance.length; i++) {
                const att = attendance[i];
                if (att.count < newLessBusy.count) newLessBusy = att;
                if (att.count > newMostBusy.count) newMostBusy = att;
            }

            const lessBusyArea = areas.find(area => area.id == newLessBusy?.id_area);
            setLessBusy({ attendance: newLessBusy?.count, areaName: lessBusyArea ? lessBusyArea.name: "N\\A"});

            const mostBusyArea = areas.find(area => area.id == newMostBusy?.id_area)
            setMostBusy({ attendance: newMostBusy?.count, areaName: mostBusyArea ? mostBusyArea.name: "N\\A"});
        }

    }, [attendance, areas]);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Overview</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <LittleCard title="Busiest area" content={ mostBusy ? mostBusy.areaName:"N\\A"} subtitle="This area is really busy right now" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <LittleCard title="Less busy area" content={ lessBusy ? lessBusy.areaName:"N\\A"} subtitle="This area is not so busy right now" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <LittleCard title="Areas" content={areas ? areas.length.toString(): "0"} color="warning" subtitle="Number of areas in the building" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <LittleCard title="Sniffers" content={devices ? devices.length.toString():  "0"} color="warning" subtitle="Powered by Zerynth" />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            {/* row 2 */}
            <Grid item xs={12} md={7} lg={8}>
                <BuildingAttendance />
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Attendance</Typography>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6" color="textSecondary">
                                Area&apos;s attendance
                            </Typography>
                            {/*<Typography variant="h3">$7,650</Typography>*/}
                        </Stack>
                    </Box>
                    { /* [0, 0, 0, 0, 0, 0, 0, 40, 95, 80, 75, 86, 35, 50, 80, 95, 70, 50, 30, 0, 0, 0, 0, 0] */ }
                    <AttendanceBarChart
                        data={ attendance ? attendance.map(att => att.count):[] }
                        height={470}
                        categories={ attendance && areas ? attendance.map(att => getAreaNameById(areas, att.id_area) ):[] }
                    />
                </MainCard>
            </Grid>

            {/* row 3 */}
            <Grid item xs={12} md={7} lg={8}>
                <Typography variant="h5">Sniffers</Typography>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DevicesTableComponent devices={devices} loading={isLoading} selectedBuildingId={selectedBuilding.id} editable={false}/>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Support</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2.5 }}>
                    <Stack spacing={3}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack>
                                    <Typography variant="h5" noWrap>
                                        Help & Support
                                    </Typography>
                                    <Typography variant="caption" color="secondary" noWrap>
                                        Typical replay within 5 min
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item>
                                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                                    {/*                                    <Avatar alt="Remy Sharp" src={avatar1} />
                                    <Avatar alt="Travis Howard" src={avatar2} />
                                    <Avatar alt="Cindy Baker" src={avatar3} />
                                    <Avatar alt="Agnes Walker" src={avatar4} />*/}
                                </AvatarGroup>
                            </Grid>
                        </Grid>
                        <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
                            Need Help?
                        </Button>
                    </Stack>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default Overview;
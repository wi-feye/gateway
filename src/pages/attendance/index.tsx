import {useState} from 'react';

// material-ui
import {
    Box,
    Button,
    Grid,
    Stack,
    Typography
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import {useAreas, useAttendance} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import AttendanceBarChart from "../overview/AttendanceBarChart";
import Area from "../../models/area";
import Attendance from "../../models/attendance";
import BuildingAttendance from "../../components/BuildingAttendance";

function getAreaNameById(areas: Area[], areaId: number): string {
    // R.I.P. EFFICIENZA
    const area = areas.find(area => area.id == areaId);
    return area ? area.name:"";
}

type AreaAttendanceProps = {
    slot: string,
    area: Area,
    attendance: Attendance[] | undefined
}
function AreaAttendance({ slot, area, attendance }: AreaAttendanceProps) {

    return (
        <Grid item xs={12} md={4} lg={4}>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">{ area ? area.name:"" }</Typography>
                </Grid>
                <Grid item>
                    <Stack direction="row" alignItems="center" spacing={0}>
                        <Button
                            size="small"
                            /*onClick={() => setSlot('month')}*/
                            color={slot === 'month' ? 'primary' : 'secondary'}
                            variant={slot === 'month' ? 'outlined' : 'text'}
                        >
                            Week
                        </Button>
                        <Button
                            size="small"
                            /*onClick={() => setSlot('week')}*/
                            color={slot === 'week' ? 'primary' : 'secondary'}
                            variant={slot === 'week' ? 'outlined' : 'text'}
                        >
                            Today
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <MainCard sx={{mt: 2}} content={false}>
                <Box sx={{p: 3, pb: 0}}>
                    <Stack spacing={2}>
                        <Typography variant="h6" color="textSecondary">
                            Attendance per hour
                        </Typography>
                    </Stack>
                </Box>
                <AttendanceBarChart
                    data={[0, 0, 0, 0, 0, 0, 0, 40, 95, 80, 75, 86, 35, 50, 80, 95, 70, 50, 30, 0, 0, 0, 0, 0] /*attendance ? attendance.map(att => att.count):[]*/}
                    height={410}
                    categories={['', '', '03', '', '', '06', '', '', '09', '', '', '12', '', '', '15', '', '', '18', '', '', '21', '', '', '']}
                />
            </MainCard>
        </Grid>
    );
}
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const AttendancePage = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { attendance, isLoading: isLoadingAttendance } = useAttendance(selectedBuilding.id);
    const { areas, isLoading: isLoadingAreas } = useAreas(selectedBuilding.id);

    /*const getAttendanceCategories = (idArea: number) => {
        if (!attendance || !areas) return [];

        attendance.forEach((att) => {
            if (att.id_area === idArea) {

            }
        });

        return [0, 0, 0, 0, 0, 0, 0, 40, 95, 80, 75, 86, 35, 50, 80, 95, 70, 50, 30, 0, 0, 0, 0, 0];
        //attendance && areas ? attendance.map(att => getAreaNameById(areas, att.id_area) ):[]
    }*/

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} md={7} lg={8}>
                <BuildingAttendance />
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Attendance</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6" color="textSecondary">
                                Today&apos;s attendance
                            </Typography>
                            {/*<Typography variant="h3">$7,650</Typography>*/}
                        </Stack>
                    </Box>
                    { /* [0, 0, 0, 0, 0, 0, 0, 40, 95, 80, 75, 86, 35, 50, 80, 95, 70, 50, 30, 0, 0, 0, 0, 0] */ }
                    <AttendanceBarChart
                        data={ attendance ? attendance.map(att => att.count):[] }
                        height={410}
                        categories={ attendance && areas ? attendance.map(att => getAreaNameById(areas, att.id_area) ):[] }
                    />
                </MainCard>
            </Grid>

            {/* row 2 */}
            { areas?.map(area => <AreaAttendance key={""} slot={"month"} area={area} attendance={attendance}/>) }
        </Grid>
    );
};

export default AttendancePage;
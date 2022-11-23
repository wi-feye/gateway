import {useEffect, useState} from 'react';

// material-ui
import {
    AvatarGroup,
    Box,
    Button,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import AttendanceBarChart from './AttendanceBarChart';
import IncomeAreaChart from './IncomeAreaChart';
import LittleCard from '../../components/cards/statistics/LittleCard';

// assets
import {useAreas, useAttendance, useDevices} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import Attendance from "../../models/attendance";
import Area from "../../models/area";
import DevicesTableComponent from "../devices/DevicesTableComponent";

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

function getAreaNameById(areas: Area[], areaId: number): string {
    // R.I.P. EFFICIENZA
    const area = areas.find(area => area.id == areaId);
    return area ? area.name:"";
}

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Overview = () => {
    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');
    const [lessBusy, setLessBusy] = useState<{
        attendance: number,
        areaName: string
    }>();
    const [mostBusy, setMostBusy] = useState<{
        attendance: number,
        areaName: string
    }>();

    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
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
                <LittleCard title="Busiest area" content={ mostBusy ? mostBusy.areaName:"N\\A"} percentage={59.3} subtitle="This area is really busy right now" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <LittleCard title="Less busy area" content={ lessBusy ? lessBusy.areaName:"N\\A"} percentage={70.5} subtitle="This area is not so busy right now" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <LittleCard title="Total Order" content="18,800" percentage={27.4} isLoss color="warning" subtitle="" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <LittleCard title="Total Sales" content="$35,078" percentage={27.4} isLoss color="warning" subtitle="" />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

            {/* row 2 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="ce  nter" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Attendance over time</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <Button
                                size="small"
                                onClick={() => setSlot('month')}
                                color={slot === 'month' ? 'primary' : 'secondary'}
                                variant={slot === 'month' ? 'outlined' : 'text'}
                            >
                                Month
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setSlot('week')}
                                color={slot === 'week' ? 'primary' : 'secondary'}
                                variant={slot === 'week' ? 'outlined' : 'text'}
                            >
                                Week
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        <IncomeAreaChart slot={slot} />
                    </Box>
                </MainCard>
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
                                Area&apos;s attendance
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

            {/* row 3 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Devices</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            id="standard-select-currency"
                            size="small"
                            select
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
                        >
                            {status.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DevicesTableComponent devices={devices} loading={isLoading}/>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Support</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                {/*
                <MainCard sx={{ mt: 2 }} content={false}>
                    <List
                        component="nav"
                        sx={{
                            px: 0,
                            py: 0,
                            '& .MuiListItemButton-root': {
                                py: 1.5,
                                '& .MuiAvatar-root': avatarSX,
                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                            }
                        }}
                    >
                        <ListItemButton divider>
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        color: 'success.main',
                                        bgcolor: 'success.lighter'
                                    }}
                                >
                                    <GiftOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
                            <ListItemSecondaryAction>
                                <Stack alignItems="flex-end">
                                    <Typography variant="subtitle1" noWrap>
                                        + $1,430
                                    </Typography>
                                    <Typography variant="h6" color="secondary" noWrap>
                                        78%
                                    </Typography>
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <ListItemButton divider>
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        color: 'primary.main',
                                        bgcolor: 'primary.lighter'
                                    }}
                                >
                                    <MessageOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Order #984947</Typography>}
                                secondary="5 August, 1:45 PM"
                            />
                            <ListItemSecondaryAction>
                                <Stack alignItems="flex-end">
                                    <Typography variant="subtitle1" noWrap>
                                        + $302
                                    </Typography>
                                    <Typography variant="h6" color="secondary" noWrap>
                                        8%
                                    </Typography>
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        color: 'error.main',
                                        bgcolor: 'error.lighter'
                                    }}
                                >
                                    <SettingOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
                            <ListItemSecondaryAction>
                                <Stack alignItems="flex-end">
                                    <Typography variant="subtitle1" noWrap>
                                        + $682
                                    </Typography>
                                    <Typography variant="h6" color="secondary" noWrap>
                                        16%
                                    </Typography>
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    </List>
                </MainCard>*/}
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
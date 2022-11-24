import {Box, Button, Grid, Stack, Typography} from "@mui/material";
import MainCard from "../MainCard";
import AreaChart from "../AreaChart";
import {useState} from "react";

function BuildingAttendance() {
    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');

    return (
        <>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h5">Building&apos;s attendance</Typography>
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
                    <AreaChart
                        isMonth={slot === 'month'}
                        categories={slot === 'month'
                        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                    />
                </Box>
            </MainCard>
        </>
    );
}

export default BuildingAttendance;
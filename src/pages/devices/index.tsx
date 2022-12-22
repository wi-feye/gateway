// material-ui
import {
    Alert,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, TableCell, TableRow, TextField, Typography,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import DevicesTableComponent from './DevicesTableComponent';
import {createSniffer, modifySniffer, useDevices} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dynamic from "next/dynamic";
import * as React from "react";
import {useState} from "react";

const Map = dynamic(() => import('../../../src/components/Map'), {
    ssr: false
});
// ==============================|| DASHBOARD - DEFAULT ||============================== //

const Devices = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { devices, isLoading } = useDevices(selectedBuilding.id);

    const [open, setOpen] = useState(false);
    const [nameSniffer, setNameSniffer] = useState('');
    const [xPosition, setxPosition] = useState('');
    const [yPosition, setyPosition] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirm = () => {
        createSniffer(selectedBuilding.id.toString(), nameSniffer, xPosition.toString(), yPosition.toString())
        setOpen(false);
    };
    const handleNameSniffer = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNameSniffer(event.target.value);
    };
    return (
        <>
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            <Grid item xs={12} sx={{mb: -2.25}}>
                <Typography variant="h5">Sniffers</Typography>
            </Grid>
            <Grid item xs={12}>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Map
                        center={[43.72082, 10.40806]}
                        height={420}
                        mapUrl='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
                <MainCard content={false}>
                    <DevicesTableComponent devices={devices} loading={isLoading} selectedBuildingId={selectedBuilding.id}/>
                </MainCard>
            </Grid>
            <Grid item xs={12}>
            <Button variant="contained" color="success" onClick={handleClickOpen}>Add sniffer</Button>
            </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Sniffer</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the values:
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    variant="outlined"
                    onChange={handleNameSniffer}/>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Position X"
                    type="text"
                    variant="outlined"/>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Position Y"
                    type="text"
                    variant="outlined"/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleConfirm}>Confirm</Button>
            </DialogActions>
        </Dialog>
    </>
    );
};

export default Devices;
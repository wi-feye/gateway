// material-ui
import {
    Alert, Autocomplete,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, TableCell, TableRow, TextField, Typography,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import DevicesTableComponent from './DevicesTableComponent';
import {createSniffer, modifySniffer, useDevices, useIdZer} from "../../restapi";
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
    const { devices, isLoading,mutate } = useDevices(selectedBuilding.id);
    const { idZer } = useIdZer(selectedBuilding.id);
    console.log(idZer)
    const [open, setOpen] = useState(false);
    const [nameSniffer, setNameSniffer] = useState('');
    const [xPosition, setxPosition] = useState('');
    const [yPosition, setyPosition] = useState('');
    const [idZerynt, setidZerynt] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirm = async () => {
        setOpen(false);
        await createSniffer(selectedBuilding.id.toString(),idZerynt, nameSniffer, xPosition.toString(), yPosition.toString())
        mutate();
    };
    const handleNameSniffer = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNameSniffer(event.target.value);
    };
    const handleXPosition = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setxPosition(event.target.value);
    };
    const handleYPosition = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setyPosition(event.target.value);
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
                    <DevicesTableComponent devices={devices} loading={isLoading} selectedBuildingId={selectedBuilding.id} mutate={mutate}/>
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
                <Autocomplete
                    value={idZerynt}
                    onChange={(event: any, newValue: string | null) => {
                        setidZerynt(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                        setidZerynt(newInputValue);
                    }}
                    id="controllable-states-demo"
                    options={idZer}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="ID ZERYNTH" />}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Position X"
                    type="text"
                    variant="outlined"
                    onChange={handleXPosition}/>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Position Y"
                    type="text"
                    variant="outlined"
                    onChange={handleYPosition}/>
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
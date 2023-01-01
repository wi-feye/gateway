// material-ui
import {
    Autocomplete,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, TextField, Typography,
} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import DevicesTableComponent from './DevicesTableComponent';
import {createSniffer, deleteSniffer, modifySniffer, useAreas, useDevices, useZerynthDevices} from "../../restapi";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import dynamic from "next/dynamic";
import * as React from "react";
import {useState} from "react";
import EditedDevice from "../../components/Map/models/EditedDevice";
import Device from "../../models/device";

const Map = dynamic(() => import('../../../src/components/Map'), {
    ssr: false
});

const Devices = () => {
    const buildingState = useSelector((state: RootState) => state.building);
    const selectedBuilding = buildingState.availableBuildings[buildingState.selectedBuildingIndex];
    const { devices, isLoading: isLoadingDevices, mutate } = useDevices(selectedBuilding?.id);
    const { areas, isLoading: isLoadingAreas } = useAreas(selectedBuilding?.id);
    const { zerynthDevices } = useZerynthDevices(selectedBuilding?.id);
    const [open, setOpen] = useState(false);
    const [idZDevice, setIdZDevice] = useState('');
    const [deviceName, setDeviceName] = useState("");
    const [deviceXLocation, setDeviceXLocation] = useState(0);
    const [deviceYLocation, setDeviceYLocation] = useState(0);
    const DEFAULT_DEVICE = {
        id: "-1",
        id_zerynth: "",
        lastRequest: "",
        name: "",
        status: "",
        x: 0,
        y: 0,
    };
    const [editableDevices, setEditableDevices] = useState([DEFAULT_DEVICE]);

    const handleClickOpen = () => {
        setDeviceName("");
        setDeviceXLocation(0);
        setDeviceYLocation(0);
        setEditableDevices([DEFAULT_DEVICE]);

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

        setDeviceName("");
        setDeviceXLocation(0);
        setDeviceYLocation(0);
        setEditableDevices([DEFAULT_DEVICE]);
    };

    const handleConfirm = async () => {
        if (!idZDevice || !deviceName || !deviceName.trim()) return;

        setOpen(false);
        await createSniffer(selectedBuilding?.id.toString(), idZDevice, deviceName.trim(), deviceXLocation.toString(), deviceYLocation.toString())
            .then(() => mutate());
    };

    const onChangeSnifferName = (event: { target: { value: string; }; }) => {
        setDeviceName(event.target.value.trim());
    };

    const onEditDevicesLocation = (editedDevices: EditedDevice[]) => {
        const editedDev = editedDevices[0];
        setDeviceXLocation(editedDev.newLocationX);
        setDeviceYLocation(editedDev.newLocationY);
    }

    const onModifySniffer = (id: string, name: string, x: number, y: number) => {
        modifySniffer(
            id,
            selectedBuilding.id.toString(),
            name,
            x.toString(),
            y.toString()
        ).then(() => mutate());

        setOpen(false);
    };

    const onDeleteSniffer = (device: Device) => {
        if (!device) return;

        deleteSniffer(device.id).then(() => mutate());
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
                    <DevicesTableComponent
                        devices={devices ? devices:[]}
                        areas={areas ? areas:[]}
                        loading={isLoadingDevices || isLoadingAreas}
                        onDeleteDevice={onDeleteSniffer}
                        onEditDevice={onModifySniffer}
                        editable
                    />
                </MainCard>
            </Grid>
            <Grid item xs={12}>
            <Button variant="contained" color="success" onClick={handleClickOpen}>Add sniffer</Button>
            </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle fontWeight="bold">Create Sniffer</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Place your sniffer on the map
                </DialogContentText>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Map
                        height={420}
                        devices={devices ? devices:[]}
                        areas={areas ? areas:[]}
                        fitAreasBounds
                        editable={{
                            areas: false, // areas are NOT editable
                            devices: true // devices editable
                        }}
                        editableDevices={editableDevices}
                        onEditDevices={onEditDevicesLocation}
                    />
                </MainCard>
                <DialogContentText sx={{ mt: 4 }}>
                    Enter the values
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    variant="outlined"
                    sx={{ width: 300 }}
                    value={deviceName}
                    onChange={onChangeSnifferName}/>
                <Autocomplete
                    id="controllable-states-demo"
                    value={idZDevice}
                    onChange={(event: any, newValue: string | null, reason) => {
                        if (newValue) setIdZDevice(newValue)
                    }}
                    onInputChange={(event, newInputValue: string, reason) => {
                        const filtered = zerynthDevices?.filter(zd => zd.name.includes(newInputValue));
                        if(filtered?.length == 1) setIdZDevice(filtered[0].id);
                    }}
                    getOptionLabel={option => zerynthDevices?.find(zd => zd.id == option) ? `${zerynthDevices?.find(zd => zd.id == option)?.name} [${option}]` : ''}
                    options={zerynthDevices?.map(zd => zd.id) || []}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="ID ZERYNTH" />}
                />
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
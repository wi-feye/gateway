// material-ui
import {
    Alert,
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

// project
import {TableCellProps} from "@mui/material/TableCell/TableCell";
import * as React from "react";
import Device from "../../models/device";
import {useEffect, useState} from "react";
import EditableText from "../../components/EditableText";
import MainCard from "../../components/MainCard";
import Area from "../../models/area";
import EditedDevice from "../../components/Map/models/EditedDevice";
import dynamic from "next/dynamic";

const Map = dynamic(() => import('../../../src/components/Map'), {
    ssr: false
});

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
    {
        id: 'name',
        padding: 'normal',
        label: 'Name'
    },
    {
        id: 'status',
        padding: 'normal',
        label: 'Status'
    },
    {
        id: 'lastRequest',
        padding: 'normal',
        label: 'Last Request'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //
function DevicesTableHead() {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, idx) => {
                        let tableProps: TableCellProps = headCell as TableCellProps;
                        return (
                            <TableCell
                                key={headCell.id}
                                align={"center"}
                                padding={tableProps.padding}
                            >
                                {headCell.label}
                            </TableCell>
                        );
                    }
                )}
            </TableRow>
        </TableHead>
    );
}

type DeviceRowProps = {
    device: Device,
    onClickModify: (device: Device) => void,
    editable: boolean,
    onEditDevice?: (id: string, name: string, x: number, y: number) => void,
    onDeleteDevice?: (deletedDevice: Device) => void
}
function DeviceRow({device, onClickModify, onEditDevice, onDeleteDevice, editable}: DeviceRowProps) {
    const onNameEdit = (newName: string) => {
        if (onEditDevice) onEditDevice(device.id, newName, device.x, device.y);
    }

    return (
        <>
            <TableRow hover role="checkbox" tabIndex={-1}>
                <TableCell align="center">
                    { editable ? <EditableText content={device.name} onContentEdit={onNameEdit}/> : device.name }
                </TableCell>
                <TableCell align="center">
                    <Alert
                        sx={{justifyContent: "center"}}
                        severity={device.status == "Online" ? "success" : "error"}
                    >
                        {device.status}
                    </Alert>
                </TableCell>
                <TableCell align="center">{device.lastRequest}</TableCell>
                {editable && <TableCell align="center"><Button variant="contained" onClick={()=>onClickModify(device)}>Modify</Button> {" "}
                    <Button variant="contained" color="error" onClick={() => {if (onDeleteDevice) onDeleteDevice(device)}}>Delete</Button>
                </TableCell>
                }
            </TableRow>

        </>
    );
}

export type DevicesTableComponentType = {
    devices: Device[],
    areas?: Area[],
    editable: boolean,
    loading: boolean,
    onEditDevice?: (id: string, name: string, x: number, y: number) => void,
    onDeleteDevice?: (deletedDevice: Device) => void
}
export default function DevicesTableComponent({ devices, areas, loading, editable, onEditDevice, onDeleteDevice }: DevicesTableComponentType) {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [dialogDevice, setDialogDevice] = useState<Device>({
        id: "-1",
        id_zerynth: "",
        lastRequest: "",
        name: "New Sniffer",
        status: "",
        x: 0,
        y: 0,
    });
    const [uneditableDevices, setUneditableDevices] = useState<Device[]>([]);
    const [editableDevices, setEditableDevices] = useState<Device[]>([dialogDevice]);

    useEffect(() => {
        const newUneditableDevices = devices.filter(d => d.id != dialogDevice.id);
        setUneditableDevices(newUneditableDevices);
    }, [devices]);

    const onClickModify = (device: Device) => {
        setDialogDevice(device);
        setEditableDevices([device]);
        if (devices) {
            const newUneditableDevices = devices.filter(d => d.id != device.id);
            setUneditableDevices(newUneditableDevices);
        }
        setOpen(true);
    };

    const onEditDevicesLocation = (editedDevices: EditedDevice[]) => {
        const editedDev = editedDevices[0];
        if (dialogDevice) {
            dialogDevice.x = editedDev.newLocationX;
            dialogDevice.y = editedDev.newLocationY;
        }
    }

    const onClickDeleteDevice = (device: Device) => {
        if (!device) return;

        setDialogDevice(device)
        setOpenDelete(true);
    };

    const handleCancelDeleteDialog = () => {
        setOpenDelete(false);
    };

    const handleConfirmDeleteDialog = () => {
        if (onDeleteDevice && dialogDevice) onDeleteDevice(dialogDevice);
        setOpenDelete(false);
    };

    const handleConfirmModifySniffer = () => {
        if (dialogDevice && onEditDevice) onEditDevice(dialogDevice.id, dialogDevice.name, dialogDevice.x, dialogDevice.y);
        setOpen(false);
    }

    const handleCancelModifySnifferDialog = () => {
        setOpen(false);
    };

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': {whiteSpace: 'nowrap'}
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-child': {
                            pl: 8
                        },
                        '& .MuiTableCell-root:last-child': {
                            pr: 8
                        }
                    }}
                >
                    {/*@ts-ignore*/}
                    <DevicesTableHead/>
                    <TableBody>
                        {
                            loading ? (
                                <TableCell align="center" colSpan={headCells.length}>
                                    <LinearProgress/>
                                </TableCell>
                            ) : (devices && devices.length > 0 ? devices.map((device, idx) => {
                                    return (
                                        <DeviceRow
                                            key={idx}
                                            device={device}
                                            onEditDevice={onEditDevice}
                                            onDeleteDevice={onClickDeleteDevice}
                                            editable={editable}
                                            onClickModify={onClickModify}
                                        />
                                    );
                                })
                                : <TableCell align="center" colSpan={headCells.length}></TableCell>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            { editable && <>
                <Dialog open={open}>
                    <DialogTitle fontWeight="bold">Modify sniffer location</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Place your sniffer on the map
                        </DialogContentText>
                        <MainCard sx={{ mt: 2 }} content={false}>
                            <Map
                                height={420}
                                devices={uneditableDevices}
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelModifySnifferDialog}>Cancel</Button>
                        <Button onClick={handleConfirmModifySniffer}>Confirm</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={openDelete}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to continue?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            By clicking on continue you will eliminate the sniffer.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDeleteDialog}>Cancel</Button>
                        <Button onClick={handleConfirmDeleteDialog} autoFocus>
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
            }
        </Box>
    );
}
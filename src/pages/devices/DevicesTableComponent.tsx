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
    TableRow, TextField,
} from '@mui/material';

// project
import {TableCellProps} from "@mui/material/TableCell/TableCell";
import * as React from "react";
import Device from "../../models/device";
import {deleteSniffer, modifySniffer} from "../../restapi";
import {useState} from "react";

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

// ==============================|| TABLE ||============================== //

function BuildDeviceRow(key: number, device: Device, handleClickOpen:any, handleEliminaSniffer:any) {
    return (
        <>
            <TableRow hover role="checkbox" tabIndex={-1} key={key}>
                <TableCell align="center">{device.name}</TableCell>
                <TableCell align="center"><Alert sx={{justifyContent: "center"}}
                                                 severity={device.status == "Online" ? "success" : "error"}>
                    {device.status}
                </Alert></TableCell>
                <TableCell align="center">{device.lastRequest}</TableCell>
                <TableCell align="center"><Button variant="contained" onClick={()=>handleClickOpen(device)}>Modify</Button> {" "}
                    <Button variant="contained" color="error" onClick={() => handleEliminaSniffer(device)}>Delete</Button>
                </TableCell>
            </TableRow>

        </>
    );
}

export type DevicesTableComponentType = {
    devices: Device[] | undefined,
    loading: boolean,
    selectedBuildingId: number
    mutate?: any
}
export default function DevicesTableComponent({devices, loading, selectedBuildingId, mutate}: DevicesTableComponentType) {

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [device, setDevice] = useState<Device|null>(null);
    const [nameSniffer, setNameSniffer] = useState('');
    const [dev, setDev] = useState<Device>();
    const [xPosition, setxPosition] = useState('');
    const [yPosition, setyPosition] = useState('');

    const handleClickOpen = (device:Device) => {
        setDev(device)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirm = async () => {
        if (!dev) return;
        await modifySniffer(dev.id, selectedBuildingId.toString(), nameSniffer,xPosition == '' ? dev.x.toString(): xPosition, yPosition==''? dev.y.toString(): yPosition)
        if (mutate) mutate();
        setOpen(false);
    };
    const handlexPosition = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setxPosition(event.target.value);
    };
    const handleyPosition = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setyPosition(event.target.value);
    };
    const handleNameSniffer = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNameSniffer(event.target.value);
    };

    const handleEliminaSniffer = async () => {
        if(device) {
            await deleteSniffer(device.id);
            if (mutate) mutate();
            setOpenDelete(false);
        }
    };

    const handleClickOpenDelete = (device:Device) => {
        setDevice(device)
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
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
                                    return BuildDeviceRow(idx, device, handleClickOpen, handleClickOpenDelete);
                                })
                                : <TableCell align="center" colSpan={headCells.length}></TableCell>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Modify Sniffer</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the values you want to change:
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
                        variant="outlined"
                        onChange={handlexPosition}/>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Position Y"
                        type="text"
                        variant="outlined"
                        onChange={handleyPosition}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
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
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={handleEliminaSniffer} autoFocus>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
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
import {createSniffer, deleteSniffer, modifySniffer} from "../../restapi";
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

function buildDeviceRow(key: number, device: Device, selectedBuilding: string) {

    const [open, setOpen] = useState(false);
    const [nameSniffer, setNameSniffer] = useState('');
    const [xPosition, setxPosition] = useState(device.x);
    const [yPosition, setyPosition] = useState(device.y);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirm = () => {
        modifySniffer(device.id, selectedBuilding, nameSniffer, xPosition.toString(), yPosition.toString())
        setOpen(false);
    };
    const handleNameSniffer = (event) => {
        setNameSniffer(event.target.value);
    };

    const handleEliminaSniffer = () => {
       deleteSniffer(device.id)
    };

    return (
        <>
            <TableRow hover role="checkbox" tabIndex={-1} key={key}>
                <TableCell align="center">{device.name}</TableCell>
                <TableCell align="center"><Alert sx={{justifyContent: "center"}}
                                                 severity={device.status == "Online" ? "success" : "error"}>
                    {device.status}
                </Alert></TableCell>
                <TableCell align="center">{device.lastRequest}</TableCell>
                <TableCell align="center"><Button variant="contained" onClick={handleClickOpen}>Modify</Button> {" "}
                    <Button variant="contained" color="error" onClick={handleEliminaSniffer}>Delete</Button></TableCell>
            </TableRow>
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
}

export type DevicesTableComponentType = {
    devices: Device[] | undefined,
    loading: boolean,
    selectedBuilding: number
}
export default function DevicesTableComponent({devices, loading, selectedBuilding}: DevicesTableComponentType) {


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
                                        return buildDeviceRow(idx, device, selectedBuilding.toString())
                                    })
                                    : <TableCell align="center" colSpan={headCells.length}></TableCell>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    );
}
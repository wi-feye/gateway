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

function buildDeviceRow(key: number, device:Device, handleClickOpen: React.MouseEventHandler<HTMLButtonElement> | undefined) {


    return (
        <TableRow hover role="checkbox" tabIndex={-1} key={key}>
            <TableCell align="center">{device.name}</TableCell>
            <TableCell align="center"><Alert sx={{ justifyContent: "center" }} severity={device.status == "Online" ? "success" : "error"}>
                {device.status}
            </Alert></TableCell>
            <TableCell align="center">{device.lastRequest}</TableCell>
            <TableCell align="center"><Button variant="contained" onClick={handleClickOpen}>Modifica</Button> {" "} <Button variant="contained" color="error">Elimina</Button></TableCell>
        </TableRow>
    );
}

export type DevicesTableComponentType = {
    devices: Device[] | undefined,
    loading: boolean
}
export default function DevicesTableComponent({ devices, loading }: DevicesTableComponentType) {
    const [open, setOpen] = React.useState(false);
    const [nameSniffer, setNameSniffer] = React.useState(false);
    const [xPosition, setxPosition] = React.useState(false);
    const [yPosition, setyPosition] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirm = () => {
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
                                    <LinearProgress />
                                </TableCell>
                            ) : ( devices && devices.length > 0 ? devices.map((device, idx) => {
                                    return buildDeviceRow(idx, device, handleClickOpen)
                                })
                                : <TableCell align="center" colSpan={headCells.length}></TableCell>
                            )
                        }
                    </TableBody>
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
                                value={nameSniffer}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Position X"
                                type="text"
                                variant="outlined"
                                value={xPosition}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Position Y"
                                type="text"
                                variant="outlined"
                                value={yPosition}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button onClick={handleConfirm}>Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </Table>
            </TableContainer>
        </Box>
    );
}
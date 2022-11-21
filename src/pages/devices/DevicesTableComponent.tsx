// material-ui
import {
    Alert,
    AlertTitle,
    Box, Button, Chip, Grid, LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

// project
import {TableCellProps} from "@mui/material/TableCell/TableCell";
import {FallOutlined, RightSquareOutlined, RiseOutlined} from "@ant-design/icons";
import * as React from "react";
import Router from "next/router";
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

function buildDeviceRow(key: number, device:Device) {
    return (
        <TableRow hover role="checkbox" tabIndex={-1} key={key}>
            <TableCell align="center">{device.name}</TableCell>
            <TableCell align="center"><Alert sx={{ justifyContent: "center" }} severity={device.status == "Online" ? "success" : "error"}>
                {device.status}
            </Alert></TableCell>
            <TableCell align="center">{device.lastRequest}</TableCell>
        </TableRow>
    );
}

export type DevicesTableComponentType = {
    devices: Device[] | undefined,
    loading: boolean
}
export default function DevicesTableComponent({ devices, loading }: DevicesTableComponentType) {

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
                                    return buildDeviceRow(idx, device)
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
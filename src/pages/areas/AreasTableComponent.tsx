// material-ui
import {
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
import Area from "../../models/area";

const busy = true

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //
const headCells = [
    {
        id: 'name',
        padding: 'normal',
        label: 'Name'
    },
    {
        id: 'description',
        padding: 'normal',
        label: 'Description'
    },
    {
        id: 'attendance',
        padding: 'normal',
        label: 'Attendance'
    },
    {
        id: 'toArea',
        padding: 'normal',
        label: 'More'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //
function AreasTableHead() {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, idx) => {
                        let tableProps: TableCellProps = headCell as TableCellProps;
                        return (
                            <TableCell
                                key={headCell.id}
                                align={ idx == 0 ? "left":"right"}
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

function buildAreaRow(key: number, area:Area, onClick: (a: Area) => void) {
    return (
        <TableRow hover role="checkbox" tabIndex={-1} key={key}>
            <TableCell>{area.name}</TableCell>
            <TableCell align="right">{area.description}</TableCell>
            <TableCell align="right">
                <Grid item>
                    <Chip
                        variant="filled"
                        color={busy == true ? "warning" : "success"}
                        icon={
                            <>
                                {!busy && <RiseOutlined/>}
                                {busy && <FallOutlined
                                    style={{fontSize: '1.3rem', color: 'inherit'}}/>}
                            </>
                        }
                        sx={{ml: 2, pl: 2 }}
                        size="small"
                    />
                </Grid>
            </TableCell>
            <TableCell align="right">
                <Button variant="contained" endIcon={<RightSquareOutlined/>}
                        onClick={() => onClick ? onClick(area) :{}}>
                    Go to Detail
                </Button>
            </TableCell>
        </TableRow>
    );
}

export type AreasTableComponentType = {
    areas: Area[] | undefined,
    loading: boolean
}
export default function AreasTableComponent({ areas, loading }: AreasTableComponentType) {
    const routeChange = (area: Area) => {
        let path = `/attendance?areaid=${area.id}`;
        Router.push(path);
    }

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
                    <AreasTableHead/>
                    <TableBody>
                        {
                            loading ? (
                                <TableCell align="center" colSpan={headCells.length}>
                                    <LinearProgress />
                                </TableCell>
                            ) : ( areas && areas.length > 0 ? areas.map((area, idx) => {
                                    return buildAreaRow(idx, area, routeChange)
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
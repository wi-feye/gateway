// material-ui
import {
    Box, Button, Chip, FormControl, Grid, IconButton, Input, InputAdornment, LinearProgress, OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography,
} from '@mui/material';

// project
import {TableCellProps} from "@mui/material/TableCell/TableCell";
import {
    CheckCircleFilled, CheckOutlined,
    CloseCircleFilled, CloseOutlined,
    EditFilled,
    FallOutlined,
    RightSquareOutlined,
    RiseOutlined
} from "@ant-design/icons";
import * as React from "react";
import Router from "next/router";
import Area from "../../models/area";
import {useRef, useState} from "react";
import EditableText from "../../components/EditableText";
import {updateArea} from "../../restapi";
import {KeyedMutator} from "swr";

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
type AreaRowProps = {
    area: Area,
    onClick: (a: Area) => void,
    onEditArea: (id: number, name: string, descr: string, location: number[][]) => void
}
function AreaRow({area, onClick, onEditArea}: AreaRowProps) {
    const onNameEdit = (newName: string) => {
        onEditArea(area.id, newName, area.description, area.location);
    }

    const onDescriptionEdit = (newDescr: string) => {
        onEditArea(area.id, area.name, newDescr, area.location);
    }

    return (
        <TableRow hover role="checkbox" tabIndex={-1}>
            <TableCell>
                <EditableText content={area.name} onContentEdit={onNameEdit}/>
            </TableCell>
            <TableCell align="right">
                <EditableText content={area.description} onContentEdit={onDescriptionEdit}/>
            </TableCell>
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
    loading: boolean,
    onEditArea: (id: number, name: string, descr: string, location: number[][]) => void,
}
export default function AreasTableComponent({ areas, loading, onEditArea }: AreasTableComponentType) {
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
                                    return <AreaRow key={idx} area={area} onClick={routeChange} onEditArea={onEditArea} />
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
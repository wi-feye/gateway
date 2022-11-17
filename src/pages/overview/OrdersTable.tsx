import { useState } from 'react';
import Link from "next/link";

// material-ui
import { Box, Link as MuiLink, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import { NumericFormat } from 'react-number-format';

// project
import Dot from "../../components/Dot";
import {TableCellProps} from "@mui/material/TableCell/TableCell";

function createData(trackingNo: number, name: string, fat: number, carbs: number, protein: number) {
    return { trackingNo, name, fat, carbs, protein };
}

const rows = [
    createData(84564564, 'Camera Lens', 40, 2, 40570),
    createData(98764564, 'Laptop', 300, 0, 180139),
    createData(98756325, 'Mobile', 355, 1, 90989),
    createData(98652366, 'Handset', 50, 1, 10239),
    createData(13286564, 'Computer Accessories', 100, 1, 83348),
    createData(86739658, 'TV', 99, 0, 410780),
    createData(13256498, 'Keyboard', 125, 2, 70999),
    createData(98753263, 'Mouse', 89, 2, 10570),
    createData(98753275, 'Desktop', 185, 1, 98063),
    createData(98753291, 'Chair', 100, 0, 14001)
];

function descendingComparator(a: { [x: string]: number; }, b: { [x: string]: number; }, orderBy: string | number) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order: string, orderBy: string) {
    //@ts-ignore
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: any[], comparator: { (a: any, b: any): number; (arg0: any, arg1: any): any; }) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'trackingNo',
        align: 'left',
        padding: 'none',
        label: 'Tracking No.'
    },
    {
        id: 'name',
        align: 'left',
        padding: 'normal',
        label: 'Product Name'
    },
    {
        id: 'fat',
        align: 'right',
        padding: 'none',
        label: 'Total Order'
    },
    {
        id: 'carbs',
        align: 'left',
        padding: 'none',
        label: 'Status'
    },
    {
        id: 'protein',
        align: 'right',
        padding: 'none',
        label: 'Total Amount'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //
type OrderTableHeadType = {
    order: "asc" | "desc" | false,
    orderBy: string
};
function OrderTableHead({ order, orderBy }: OrderTableHeadType) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => {
                    let tableProps:TableCellProps = headCell as TableCellProps;
                    return (
                            <TableCell
                                key={headCell.id}
                                align={tableProps.align}
                                padding={tableProps.padding}
                                sortDirection={orderBy === headCell.id ? order : false}
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

// ==============================|| ORDER TABLE - STATUS ||============================== //
type OrderStatusType = {
    status: number;
}
const OrderStatus = ({ status }: OrderStatusType) => {
    let color;
    let title;

    switch (status) {
        case 0:
            color = 'warning';
            title = 'Pending';
            break;
        case 1:
            color = 'success';
            title = 'Approved';
            break;
        case 2:
            color = 'error';
            title = 'Rejected';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable() {
    const [order] = useState('asc');
    const [orderBy] = useState('trackingNo');
    const [selected] = useState([]);

    // @ts-ignore
    const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-child': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-child': {
                            pr: 3
                        }
                    }}
                >
                    {/*@ts-ignore*/}
                    <OrderTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                            const isItemSelected = isSelected(row.trackingNo);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.trackingNo}
                                    selected={isItemSelected}
                                >
                                    <TableCell component="th" id={labelId} scope="row" align="left">
                                        <MuiLink color="secondary" component={Link} href="">
                                            {row.trackingNo}
                                        </MuiLink>
                                    </TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="left">
                                        <OrderStatus status={row.carbs} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <NumericFormat value={row.protein} displayType="text" thousandSeparator prefix="$" />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
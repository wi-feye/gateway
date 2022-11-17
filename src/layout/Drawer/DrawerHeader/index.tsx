// project import
import Logo from '../../../components/Logo';
import {Box, ButtonBase, Typography} from "@mui/material";
import Link from "next/link";
import {overviewRoute} from "../../../routes";

// ==============================|| DRAWER HEADER ||============================== //
type DrawerHeaderProps = {
    open: boolean
};

const DrawerHeader = ({ open }: DrawerHeaderProps) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 2,
            paddingBottom: 0}}
        >
            <ButtonBase disableRipple component={Link} href={overviewRoute.url}>
                <Logo />
                <Typography variant="h5" sx={{ ml: 2 }}>WiFeye</Typography>
            </ButtonBase>
        </Box>
    );
};

export default DrawerHeader;
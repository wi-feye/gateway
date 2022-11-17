// material-ui
import { Box, Typography } from '@mui/material';

// project import
import NavGroup from './NavGroup';
import menuItem from '../../../../menu-items';
import BuildingItem from "./BuildingItem";

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
    const navGroups = menuItem.items.map((item, index) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} showDivider={index > 0}/>;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Fix - Navigation Group
                    </Typography>
                );
        }
    });

    return (
        <Box sx={{ pt: 2 }}>
            <BuildingItem />
            {navGroups}
        </Box>
    );
};

export default Navigation;
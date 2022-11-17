import React, { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// project import
import DrawerHeader from './DrawerHeader';
//import DrawerContent from './DrawerContent';
import Navigation from "./DrawerContent/Navigation";
import MiniDrawerStyled from './MiniDrawerStyled';
import { drawerWidth } from '../../config';

// ==============================|| MAIN LAYOUT - DRAWER ||============================== //

// @ts-ignore
const MainDrawer = ({ open, handleDrawerToggle }) => {
    const theme = useTheme();
    const matchDownXS = useMediaQuery(theme.breakpoints.down('md'));

    // header content
    const drawerContent = useMemo(() => <Navigation />, []);
    const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open]);

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }} aria-label="mailbox folders">
            {!matchDownXS ? (
                <MiniDrawerStyled variant="permanent" open={open}>
                    {drawerHeader}
                    {drawerContent}
                </MiniDrawerStyled>
            ) : (
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: `0px solid ${theme.palette.divider}`,
                            backgroundImage: 'none',
                            boxShadow: 'inherit'
                        }
                    }}
                >
                    {open && drawerHeader}
                    {open && drawerContent}
                </Drawer>
            )}
        </Box>
    );
};

export default MainDrawer;
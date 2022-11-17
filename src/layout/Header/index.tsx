import React from "react";

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, useMediaQuery } from '@mui/material';

// project import
import HeaderContent from './HeaderContent';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {drawerWidth} from "../../config";

// ==============================|| MAIN LAYOUT - HEADER ||============================== //
type HeaderTypes = {
    open?: boolean;
    handleDrawerToggle: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const Header = ({ open, handleDrawerToggle }:HeaderTypes) => {
    const theme = useTheme();
    const matchDownXS = useMediaQuery(theme.breakpoints.down('md'));

    const iconBackColor = 'grey.100';
    const iconBackColorOpen = 'grey.200';

    // common header
    const mainHeader = (
        <Toolbar>
            <IconButton
                disableRipple
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                color="secondary"
                sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
            >
                {!open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </IconButton>
            <HeaderContent />
        </Toolbar>
    );

    return (
        <>
            {!matchDownXS ? (
                <AppBar
                    position="fixed"
                    elevation={0}
                    color="default"
                    sx={{
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        zIndex: theme.zIndex.drawer + 1,
                        transition: theme.transitions.create(['width', 'margin'], {
                            easing: theme.transitions.easing.sharp,
                            duration: open ? theme.transitions.duration.enteringScreen:theme.transitions.duration.leavingScreen
                        }),
                        width: open ? `calc(100% - ${drawerWidth}px)`:"100%",
                        marginLeft: open ? drawerWidth:0,
                    }}
                >
                    {mainHeader}
                </AppBar>
            ) : (
                <AppBar
                    position="fixed"
                    elevation={0}
                    color="default"
                    sx={{
                        bgColor: theme.palette.background.default,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    {mainHeader}
                </AppBar>
            )}
        </>
    );
};

export default Header;
import {ReactNode, useEffect, useState} from 'react';
//import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import Drawer from './Drawer';
import Header from './Header';
import navigation from '../menu-items';
//import Breadcrumbs from 'components/@extended/Breadcrumbs';

// types
import { openDrawer } from '../store/reducers/menu';
import { RootState } from "../store";
import {useUser} from "../restapi";

// ==============================|| MAIN LAYOUT ||============================== //

type MainLayoutProps = {
    children: ReactNode
}

const MainLayout = ({ children }:MainLayoutProps) => {
    const { user } = useUser();
    const theme = useTheme();
    const matchDownXS = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();

    const { drawerOpen } = useSelector((state: RootState) => state.menu);

    // drawer toggler
    const [open, setOpen] = useState(drawerOpen);
    const handleDrawerToggle = () => {
        setOpen(!open);
        console.log("handleDrawerToggle")
        dispatch(openDrawer({ drawerOpen: !open }));
    };

    // set media wise responsive drawer
    useEffect(() => {
        setOpen(!matchDownXS);
        dispatch(openDrawer({ drawerOpen: !matchDownXS }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownXS]);

    useEffect(() => {
        if (open !== drawerOpen) setOpen(drawerOpen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerOpen]);

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Header user={user} open={open} handleDrawerToggle={handleDrawerToggle} />
            <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
            <Box component="main" sx={{ width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Toolbar />
                {/*<Breadcrumbs navigation={navigation} title titleBottom card={false} divider={false} />*/}
                {/*<Outlet />*/}
                { children }
            </Box>
        </Box>
    );
};

export default MainLayout;
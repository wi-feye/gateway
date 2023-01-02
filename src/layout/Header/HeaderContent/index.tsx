// material-ui
import {Box, IconButton, useMediaQuery} from '@mui/material';
import {Theme} from "@mui/material/styles";

// project import
import Profile from './Profile';
import Search from './Search';
import {LogoutOutlined} from "@ant-design/icons";
import React from "react";
import {authLogout} from "../../../restapi";
import {loginRoute} from "../../../routes";
import Router from "next/router";
import user from "../../../../pages/api/auth/user";
import {User} from "../../../models/user";

// ==============================|| HEADER - CONTENT ||============================== //

const LogOutButton = () => {
    return (
        <IconButton
            disableRipple
            aria-label="logout"
            onClick={(event) => {
                authLogout().then(() => {
                    window.location.reload();
                    Router.push(loginRoute.url);
                }).catch(error => {
                    console.log(error);
                    window.location.reload();
                    Router.push(loginRoute.url);
                })
            }}
            edge="start"
            color="secondary"
            sx={{ color: 'text.primary', bgcolor: 'grey.200', ml: 2, mr: { xs: 0, lg: -2 } }}
        >
            <LogoutOutlined />
        </IconButton>
    );
}

type HeaderContentProps = {
    user?: User
}
const HeaderContent = ({ user }: HeaderContentProps) => {
    const matchesXs = useMediaQuery((theme:Theme) => theme.breakpoints.down('md'));
    
    return (
        <>
            {!matchesXs && <Search />}
            {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
            {!matchesXs && user && <Profile name={user.name} surname={user.surname} />}
            <LogOutButton />
{/*            <Notification />
            {matchesXs && <MobileSection />}*/}
        </>
    );
};

export default HeaderContent;
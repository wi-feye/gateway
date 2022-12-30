import NoDataComponent from "../NoDataComponent";
import React from "react";
import {AvatarGroup, Button, Grid, Stack, Typography} from "@mui/material";
import Router from "next/router";
import {areasRoute} from "../../routes";

const NoContent = () => {
    const redirectToAreaCreation = () => {
        Router.push(areasRoute.url)
    }

    return (
        <NoDataComponent minHeight="100vh">
            <Grid container justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={8}>
                    <Stack spacing={3} alignItems="center">
                        <img
                            width={600}
                            src="assets/images/create-first-area-illustration.png"
                        />
                        <Typography variant="h4" sx={{ pb: 2 }}>Create your first areas</Typography>
                        <Button
                            disableElevation
                            onClick={redirectToAreaCreation}
                            size="large"
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ width: 200}}
                        >
                            Create
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </NoDataComponent>
    );
}

export default NoContent;
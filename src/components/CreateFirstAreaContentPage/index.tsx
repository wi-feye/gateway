import NoDataComponent from "../NoDataComponent";
import React from "react";
import {Button, Grid, Typography} from "@mui/material";
import Router from "next/router";
import {areasRoute} from "../../routes";

const NoContent = () => {
    const redirectToAreaCreation = () => {
        Router.push(areasRoute.url)
    }

    return (
        <NoDataComponent maxHeight="100vh">
            <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={12} md={3} alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                        <Typography variant="h4">Let&apos;s create your first area!</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            disableElevation
                            onClick={redirectToAreaCreation}
                            size="large"
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </NoDataComponent>
    );
}

export default NoContent;
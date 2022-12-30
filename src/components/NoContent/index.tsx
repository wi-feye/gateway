import {Box, CircularProgress, Grid} from "@mui/material";
import NoDataComponent from "../NoDataComponent";
import React from "react";

const NoContent = () => {
    return (
        <Box sx={{ minHeight: '100vh' }}>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{minHeight: '100vh'}}
            ><Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{minHeight: '100vh'}}
            >
                <NoDataComponent>Not enough data to predict attendance</NoDataComponent>
            </Grid>
            </Grid>
        </Box>
    );
}

export default NoContent;
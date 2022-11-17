import {Box, CircularProgress, Grid} from "@mui/material";

const LoadingSplashScreen = () => {
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
              <CircularProgress />
            </Grid>
          </Grid>
      </Box>
  );
}

export default LoadingSplashScreen;
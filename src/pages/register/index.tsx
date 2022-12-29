// material-ui
import {Grid, Link, Stack, Typography} from '@mui/material';

// project import
import AuthLogin from './AuthLogin';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //

const SignIn = () => (
    <AuthWrapper>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                    <Typography variant="h3">Sign In</Typography>
                    <Typography component={Link} href="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                        Login
                    </Typography>
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <AuthLogin />
            </Grid>
        </Grid>
    </AuthWrapper>
);

export default SignIn;
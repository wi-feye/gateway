// material-ui
import {Box, Grid, Typography} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';
import {ReactNode} from "react";
import Logo from "../../components/Logo";

// ==============================|| AUTHENTICATION - CARD WRAPPER ||============================== //
type AuthCardProps = {
    children: ReactNode;
}
const AuthCard = ({ children, ...other }: AuthCardProps) => (
    <MainCard
        sx={{
            maxWidth: { xs: 400, lg: 475 },
            margin: { xs: 2.5, md: 3 },
            '& > *': {
                flexGrow: 1,
                flexBasis: '50%'
            }
        }}
        content={false}
        {...other}
        border={false}
        boxShadow
        /*shadow={(theme: Theme) => theme.palette.grey[900]}*/
    >
        <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>
            <Grid item xs={12} sx={{ mt: 0, mb: 5 }}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center">
                <Logo size={65} />
                <Typography variant="h3" sx={{ ml: 2 }}>WiFeye</Typography>
            </Grid>
            {children}
        </Box>
    </MainCard>
);

export default AuthCard;
// material-ui
import {
    Avatar,
    Box,
    ButtonBase,
    Stack,
    Typography
} from '@mui/material';

// assets
const avatar2Src = '/assets/images/avatar-2.png';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
    const profileOnClick = () => {
        console.log("profileOnClick")
    };

    return (
        <Box sx={{ flexShrink: 0, mr: 0.75 }}>
            <ButtonBase
                sx={{
                    p: 0.25,
                    bgcolor: 'transparent',
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'secondary.lighter' }
                }}
                aria-label="open profile"
                aria-haspopup="true"
                onClick={profileOnClick}
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 0.5 }}>
                    <Avatar alt="profile user" src={avatar2Src} sx={{ width: 32, height: 32 }} />
                    <Typography variant="subtitle1">Gustavo Milan</Typography>
                </Stack>
            </ButtonBase>
        </Box>
    );
};

export default Profile;
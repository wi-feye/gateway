// material-ui
import {
    Avatar,
    Box,
    ButtonBase,
    Stack,
    Typography
} from '@mui/material';

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

type ProfileProps = {
    name: string,
    surname: string
}
const Profile = ({ name, surname }: ProfileProps) => {
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
                    <Typography variant="subtitle1">{name} {surname}</Typography>
                </Stack>
            </ButtonBase>
        </Box>
    );
};

export default Profile;
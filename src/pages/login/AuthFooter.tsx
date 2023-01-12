// material-ui
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';
import {Theme} from "@mui/material/styles";
// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
    const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="xl">
            <Stack
                direction={matchDownSM ? 'column' : 'row'}
                justifyContent={matchDownSM ? 'center' : 'space-between'}
                spacing={2}
                textAlign={matchDownSM ? 'center' : 'inherit'}
            >
                <Typography variant="subtitle2" color="secondary" component="span">
                    &copy; WiFeye {/*By&nbsp;
                    <Typography component={Link} variant="subtitle2" href="https://codedthemes.com" target="_blank" underline="hover">
                        CodedThemes
                    </Typography>*/}
                </Typography>
                <Typography
                    variant="subtitle2"
                    color="secondary"
                    component={Link}
                    href="https://drive.google.com/drive/folders/16SWBH5mJZg-kmSeUdGp9fFJoTwlxP9d4?usp=share_link"
                    target="_blank"
                    underline="hover"
                >
                    <i className="fa fa-android"></i> Google Play
                </Typography>
                <Typography
                    variant="subtitle2"
                    color="secondary"
                    component={Link}
                    href="https://testflight.apple.com/join/HOgsw3lZ"
                    target="_blank"
                    underline="hover"
                >
                    <i className="fa fa-apple" aria-hidden="true"></i> Apple Store
                </Typography>

                <Stack
                    direction={matchDownSM ? 'column' : 'row'}
                    spacing={matchDownSM ? 1 : 3}
                    textAlign={matchDownSM ? 'center' : 'inherit'}
                >
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href=""
                        target="_blank"
                        underline="hover"
                    >
                        Privacy Policy
                    </Typography>
                    <Typography
                        variant="subtitle2"
                        color="secondary"
                        component={Link}
                        href=""
                        target="_blank"
                        underline="hover"
                    >
                        Support
                    </Typography>
                </Stack>
            </Stack>
        </Container>
    );
};

export default AuthFooter;
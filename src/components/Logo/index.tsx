import {Avatar} from "@mui/material";

const logoSrc = "assets/images/logo.png"

// ==============================|| LOGO SVG ||============================== //

const Logo = ({ size = 42 }) => {
    return <Avatar
        alt="WiFeye"
        src={ logoSrc }
        sx={{ width: size, height: size }}
    />
};

export default Logo;
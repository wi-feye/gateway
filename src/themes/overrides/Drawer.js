// ==============================|| OVERRIDES - DRAWER ||============================== //

export default function Drawer(theme) {
    return {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: theme.palette.common.black,
                    color: "#A4A6B3",
                },
            }
        }
    };
}

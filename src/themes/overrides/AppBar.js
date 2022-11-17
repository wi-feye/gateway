// ==============================|| OVERRIDES - APPBAR ||============================== //

export default function AppBar(theme) {

    return {
        MuiAppBar: {
            styleOverrides: {
                colorDefault: {
                    backgroundColor: theme.palette.background.default
                },
            }
        }
    };
}

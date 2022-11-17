import { ReactNode, useMemo } from 'react';

// material-ui
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import {createTheme, CustomThemeOptions, Theme, ThemeOptions, ThemeProvider} from '@mui/material/styles';
declare module '@mui/material/styles' {
    interface CustomTheme extends Theme {
        customShadows: {
            button: string;
            text: string;
            z1: string;
        };
    }
    // allow configuration using `createTheme`
    interface CustomThemeOptions extends ThemeOptions {
        customShadows?: {
            button?: string;
            text?: string;
            z1?: string;
        };
    }
}

// project import
import Palette from './palette';
import Typography from './typography';
import CustomShadows from './shadows';
import componentsOverride from './overrides';

// ==============================|| DEFAULT THEME - MAIN  ||============================== //

type ThemeCustomizationProps = {
    children: ReactNode
}
export default function ThemeCustomization({ children }:ThemeCustomizationProps) {
    const theme = Palette('light'); //Palette('light', 'default');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const themeTypography = Typography(`'Public Sans', sans-serif`);
    const themeCustomShadows = useMemo(() => CustomShadows(theme), [theme]);

    const themeOptions = useMemo(
        () => ({
            breakpoints: {
                values: {
                    xs: 0,
                    sm: 768,
                    md: 1024,
                    lg: 1266,
                    xl: 1536
                }
            },
            direction: 'ltr',
            mixins: {
                toolbar: {
                    minHeight: 60,
                    paddingTop: 8,
                    paddingBottom: 8
                }
            },
            palette: theme.palette,
            customShadows: themeCustomShadows,
            typography: themeTypography,
        }),
        [theme, themeTypography, themeCustomShadows]
    );

    const themes = createTheme(themeOptions as CustomThemeOptions);
    themes.components = componentsOverride(themes);
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes}>
                <CssBaseline />
                { children }
            </ThemeProvider>
        </StyledEngineProvider>
    );
}
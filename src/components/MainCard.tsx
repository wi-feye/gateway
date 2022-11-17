import {forwardRef, ReactNode} from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

// header style
const headerSX = {
    p: 2.5,
    '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

// ==============================|| CUSTOM - MAIN CARD ||============================== //
type Props = {
    border?: boolean,
    boxShadow?: boolean,
    contentSX?: object,
    darkTitle?: boolean,
    divider?: boolean,
    elevation?: number,
    secondary?: ReactNode,
    shadow?: string,
    sx?: object,
    title?: string,
    codeHighlight?: boolean,
    content?: boolean,
    children?: ReactNode
};

const MainCard = forwardRef(
    (
        {
            border = true,
            boxShadow,
            children,
            content = true,
            contentSX = {},
            darkTitle,
            divider = true,
            elevation,
            secondary,
            shadow,
            sx = {},
            title,
            codeHighlight,
            ...others
        }: Props,
        ref
    ) => {
        const theme = useTheme();
        boxShadow = theme.palette.mode === 'dark' ? boxShadow || true : boxShadow;

        return (
            <Card
                elevation={elevation || 0}
                /*ref={ref}*/
                {...others}
                sx={{
                    ...sx,
                    border: border ? '1px solid' : 'none',
                    borderRadius: 2,
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey["300"],
                    boxShadow: boxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.shadows[1] : 'inherit',
/*                    borderColor: theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey.A800,*/
                    /*boxShadow: boxShadow && (!border || theme.palette.mode === 'dark') ? shadow || theme.customShadows.z1 : 'inherit',*/
                    ':hover': {
                        boxShadow: boxShadow ? shadow || theme.palette.grey["900"] : 'inherit'
                        /*boxShadow: boxShadow ? shadow || theme.customShadows.z1 : 'inherit'*/
                    },
                    '& pre': {
                        m: 0,
                        p: '16px !important',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.75rem'
                    }
                }}
            >
                {/* card header and action */}
                {!darkTitle && title && (
                    <CardHeader sx={headerSX} titleTypographyProps={{ variant: 'subtitle1' }} title={title} action={secondary} />
                )}
                {darkTitle && title && (
                    <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />
                )}

                {/* content & header divider */}
                {title && divider && <Divider />}

                {/* card content */}
                {content && <CardContent sx={contentSX}>{children}</CardContent>}
                {!content && children}

                {/* card footer - clipboard & highlighter  */}
                {codeHighlight && (
                    <>
                        <Divider sx={{ borderStyle: 'dashed' }} />+
                        {children}
                    </>
                )}
            </Card>
        );
    }
);

export default MainCard;
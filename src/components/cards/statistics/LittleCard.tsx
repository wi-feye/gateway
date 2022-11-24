// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from '../../MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import {OverridableStringUnion} from "@mui/types";
import {ChipPropsColorOverrides} from "@mui/material/Chip/Chip";
import * as React from "react";

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //
type AnalyticEcommerceType = {
    color: OverridableStringUnion<
        'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
        ChipPropsColorOverrides>,
    title: string,
    subtitle: string,
    content: string,
    percentage?: number,
    isLoss?: boolean
};
const LittleCard = ({ color, title, content, percentage, isLoss, subtitle }: AnalyticEcommerceType) => (
    <MainCard contentSX={{ p: 2.25 }}>
        <Stack spacing={0.5}>
            <Typography variant="h6" color="textSecondary">
                {title}
            </Typography>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h4" color="inherit">
                        {content}
                    </Typography>
                </Grid>
                {percentage && (
                    <Grid item>
                        <Chip
                            variant="filled"
                            color={color}
                            icon={
                                <>
                                    {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                    {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                </>
                            }
                            label={`${percentage}%`}
                            sx={{ ml: 1.25, pl: 1 }}
                            size="small"
                        />
                    </Grid>
                )}
            </Grid>
        </Stack>
        <Box sx={{ pt: 2.25 }}>
            <Typography variant="caption" color="textSecondary">
                { subtitle}
            </Typography>
        </Box>
    </MainCard>
);

LittleCard.defaultProps = {
    color: 'primary'
};

export default LittleCard;
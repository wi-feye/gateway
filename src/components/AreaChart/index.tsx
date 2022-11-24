import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import dynamic from "next/dynamic";

// third-party
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// chart options
const areaChartOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| INCOME AREA CHART ||============================== //
type IncomeAreaChartType = {
    isMonth: boolean,
    categories: string[]
};

const AreaChart = ({ categories, isMonth }: IncomeAreaChartType) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);
    // @ts-ignore
    const darkerPrimary = theme.palette.primary[700]
    useEffect(() => {

        // @ts-ignore
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, darkerPrimary],
            xaxis: {
                categories: categories,
                labels: {
                    style: {
                        colors: [
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary
                        ]
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: isMonth ? 11 : 5
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light'
            }
        }));
    }, [primary, secondary, line, theme, isMonth]);

    const [series, setSeries] = useState([
        {
            data: [0, 86, 28, 115, 48, 210, 136]
        }
    ]);

    useEffect(() => {
        setSeries([
            {
                data: isMonth ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35] : [105, 119, 123, 109, 99]
            }
        ]);
    }, [isMonth]);

    // @ts-ignore
    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

export default AreaChart;
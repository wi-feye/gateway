import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import dynamic from "next/dynamic";

// third-party
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// chart options
const barChartOptions = {
    chart: {
        type: 'bar',
        height: 365,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '45%',
            borderRadius: 4
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: false
    },
    grid: {
        show: false
    }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const MonthlyBarChart = () => {
    const theme = useTheme();

    const { secondary } = theme.palette.text;
    const info = theme.palette.info.light;

    const [series] = useState([
        {
            data: [80, 95, 70, 42, 65, 55, 78]
        }
    ]);

    const [options, setOptions] = useState(barChartOptions);

    useEffect(() => {
        // @ts-ignore
        setOptions((prevState) => ({
            ...prevState,
            colors: [info],
            xaxis: {
                labels: {
                    style: {
                        colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
                    }
                }
            },
            tooltip: {
                theme: 'light'
            }
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info, secondary]);

    // @ts-ignore
    const chartDOM = <ReactApexChart options={options} series={series} type="bar" height={365} />
    return (
        <div id="chart">
            { chartDOM }
        </div>
    );
};

export default MonthlyBarChart;
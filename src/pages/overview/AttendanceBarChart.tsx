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
            /*columnWidth: '45%',*/
            borderRadius: 4
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

type AttendanceBarChartProps = {
    data: number[],
    categories: string[], //['', '', '03', '', '', '06', '', '', '09', '', '', '12', '', '', '15', '', '', '18', '', '', '21','','',''],
    height: number
}
const AttendanceBarChart = ({ data, height, categories }: AttendanceBarChartProps) => {
    const theme = useTheme();

    const { secondary } = theme.palette.text;
    const info = theme.palette.info.light;

    const [series, setSeries] = useState([{ name: "Attendance", data: data }]);

    useEffect(() => {
        setSeries([{ name: "Attendance", data: data }]);
    }, [data]);

    const [options, setOptions] = useState(barChartOptions);

    useEffect(() => {
        // @ts-ignore
        setOptions((prevState) => ({
            ...prevState,
            colors: [info],
            xaxis: {
                categories: categories,
                labels: {
                    style: {
                        colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary, secondary]
                    }
                }
            },
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [info, secondary, categories]);

    // @ts-ignore
    const chartDOM = <ReactApexChart options={options} series={series} type="bar" height={height} />
    return (
        <div id="chart">
            { chartDOM }
        </div>
    );
};

export default AttendanceBarChart;

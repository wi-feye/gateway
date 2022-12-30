import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import dynamic from "next/dynamic";
import PredictedAttendance from "../../models/predictedAttendance";
import LoadingComponent from "../../components/LoadingComponent";
import NoDataComponent from "../../components/NoDataComponent";

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

type PredictionAreaAttendanceChartProps = {
    prediction?: PredictedAttendance,
    categories?: string[],
    height?: number,
    isLoading: boolean
};
const ChartPredictionAreaAttendance = ({ prediction, height, isLoading, categories }: PredictionAreaAttendanceChartProps) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [series, setSeries] = useState<{ name: string, data: number[] }[]>([{ name: 'Attendance', data: [0,0,0,0,0,0] }]);
    const [noData, setNoData] = useState(false);
    const [options, setOptions] = useState(areaChartOptions);

    // @ts-ignore
    const darkerPrimary = theme.palette.primary[700]
    useEffect(() => {
        const colors = categories ? categories.map(c => secondary):[];

        // @ts-ignore
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, darkerPrimary],
            xaxis: {
                categories: categories,
                labels: {
                    style: {
                        colors: colors
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                }
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
    }, [primary, secondary, line, theme, categories]);

    useEffect(() => {
        if (!prediction) {
            setSeries([{ name: series[0].name, data: [0, 0, 0, 0, 0, 0]}]);
            setNoData(true);
            return;
        }

        console.log(prediction);

        setNoData(false);
        setSeries([{ name: series[0].name, data: prediction.count }]);
    }, [prediction, isLoading]);

    // @ts-ignore
    const chartDom = <ReactApexChart options={options} series={series} type="area" height={ height? height:450} />;
    return (
        <div style={{ position: "relative" }}>
            { chartDom }
            { isLoading && <LoadingComponent /> }
            { noData && !isLoading && <NoDataComponent>Not enough data to predict attendance</NoDataComponent> }
        </div>
    );
};

export default ChartPredictionAreaAttendance;
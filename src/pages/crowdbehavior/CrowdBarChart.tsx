import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import dynamic from "next/dynamic";
import PointOfInterest from "../../models/pointOfInterest";
import Area from "../../models/area";

// third-party
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// chart options
const barChartOptions = {
    chart: {
        type: "bar",
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
        categories: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    }
};

// ==============================|| MONTHLY BAR CHART ||============================== //
type CrowdBarChartType = {
    pointOfInterest: PointOfInterest[],
    areas: Area[]
};

const p: PointOfInterest[]= [{id: 1233,idArea:1332,pointOfInterest:[{x:12,y:22}]}, {id: 123,idArea:1332,pointOfInterest:[{x:4,y:5}]}]
const a = [1332, 1245, 1478]

const CrowdBarChart = ({ pointOfInterest, areas }: CrowdBarChartType) => {
    const theme = useTheme();

    const { secondary } = theme.palette.text;
    const info = theme.palette.info.light;


    const [series] = useState([
        {
            name: "Number of crowds",
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
                categories: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],

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

    }, [info, secondary]);


    return (
        <div id="chart">
            {/* @ts-ignore */}
            { <ReactApexChart options={options} series={series} type="bar" height={450} /> }
        </div>
    );
};

export default CrowdBarChart;
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import dynamic from "next/dynamic";
import PointOfInterest from "../../models/pointOfInterest";
import Area from "../../models/area";
import area from "../../models/area";

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

const p: PointOfInterest[] = [{
    id: 1233,
    idArea: 100001,
    time: "2022-11-09T17:40:40Z",
    pointOfInterest: [{x: 12, y: 22}]
}, {
    id: 123,
    idArea: 100001,
    time: "2022-11-09T17:50:40Z",
    pointOfInterest: [{x: 4, y: 5}]
}, {
    id: 123,
    idArea: 100002,
    time: "2022-11-09T17:50:40Z",
    pointOfInterest: [{x: 4, y: 5}]
}]
const CrowdBarChart = ({ pointOfInterest, areas }: CrowdBarChartType) => {
    const theme = useTheme();

    const { secondary } = theme.palette.text;
    const info = theme.palette.info.light;
    pointOfInterest=p; //da eliminare
    const association = {}
    areas.map(a =>{
        let i = 0
        console.log(a.id)
        pointOfInterest.map(p=>{
            console.log(p.idArea)
            if (a.id == p.idArea){
                i+=1
            }
        })
        // @ts-ignore
        association[a.name] = i
        i = 0
    })
    console.log(Object.keys(association))
    console.log("valori"+Object.values(association))
    const [series] = useState([
        {
            name: "Number of crowds",
            data: Object.values(association)
        }
    ]);

    const [options, setOptions] = useState(barChartOptions);

    useEffect(() => {
        // @ts-ignore
        setOptions((prevState) => ({
            ...prevState,
            colors: [info],
            xaxis: {
                categories:Object.keys(association),
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
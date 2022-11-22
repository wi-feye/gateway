import {useState, useEffect} from 'react';

// material-ui
import {useTheme} from '@mui/material/styles';
import dynamic from "next/dynamic";
import PointOfInterest from "../../models/pointOfInterest";
import Area from "../../models/area";
import {Dayjs} from "dayjs";

// third-party
const ReactApexChart = dynamic(() => import('react-apexcharts'), {ssr: false});

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

type CrowdAreaChartType = {
    timeFrom: Date
    timeTo: Date
    pointOfInterest: PointOfInterest[],
    areas: Area[]
};
const d = new Date
const p: PointOfInterest[] = [{
    id: 1233,
    idArea: 1332,
    time: new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 5),
    pointOfInterest: [{x: 12, y: 22}]
}, {
    id: 123,
    idArea: 1332,
    time: new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 20),
    pointOfInterest: [{x: 4, y: 5}]
}]
const a = [1332, 1245, 1478]
const CrowdAreaChart = ({timeFrom, timeTo, pointOfInterest, areas}: CrowdAreaChartType) => {
    const theme = useTheme();
    const diff = Math.round((((timeTo - timeFrom) % 86400000) % 3600000) / 60000)
    const {primary, secondary} = theme.palette.text;
    const line = theme.palette.divider;
    console.log(timeTo.getTime())
    let arr: string[] = [];
    let values = []
    for (let n = 0; n <= diff; n += 5) {
        const time = new Date(timeFrom.getFullYear(), timeFrom.getMonth(), timeFrom.getDate(), timeFrom.getHours(), timeFrom.getMinutes() + n)
        let i = 0;
        p.map(poi => {
            if (timeFrom.getTime() <= poi.time.getTime() &&  poi.time.getTime() <= time.getTime()) {
                i += 1
            }
        })
        values.push(i)
        arr.push(time.getHours().toString() + ":" + time.getMinutes().toString());
    }
    console.log(arr)
    console.log(values)
    const [options, setOptions] = useState(areaChartOptions);
    // @ts-ignore
    const darkerPrimary = theme.palette.primary[700]
    useEffect(() => {

        // @ts-ignore
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, darkerPrimary],
            xaxis: {
                categories: arr,

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
    }, [primary, secondary, line, theme]);

    const [series, setSeries] = useState([
        {
            name: 'Page Views',
            data: values
        }
    ]);



    // @ts-ignore
    return <ReactApexChart options={options} series={series} type="area" height={450}/>;
};

export default CrowdAreaChart;
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import dynamic from "next/dynamic";
import CrowdBehavior from "../../models/crowdbehavior";

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

};

// ==============================|| INCOME AREA CHART ||============================== //
type IncomeAreaChartType = {
    data1: CrowdBehavior[],
    data2: CrowdBehavior[],
    isHours: boolean,
    isLoading1: boolean,
    isLoading2: boolean,
};

const AreaChart = ({ data1,data2, isHours, isLoading1, isLoading2 }: IncomeAreaChartType) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);

    const categories1: any[] = [];
    const cardinality1: any[] = [];

    const categories2: any[] = [];
    const cardinality2: any[] = [];
    console.log(isHours)


    data1?.forEach(d=>{
        const date = new Date(d.from)
        categories1.push((date.getHours()).toString()+':'+ (date.getMinutes() == 0 ? '00': date.getMinutes()))
        cardinality1.push(d.data.length)
    })
    data2?.forEach(d=>{
        const date = new Date(d.from)
        categories2.push((date.getHours()).toString()+':'+ (date.getMinutes() == 0 ? '00': date.getMinutes()))
        cardinality2.push(d.data.length)
    })

    // @ts-ignore
    const darkerPrimary = theme.palette.primary[700]
    useEffect(() => {

        // @ts-ignore
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, darkerPrimary],
            xaxis: {
                categories: isHours ? categories1:categories2,
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
            },

        }));
    }, [primary, secondary, line, theme, isHours, isLoading1, isLoading2]);

    const [series, setSeries] = useState([
        {
            data: cardinality1
        }
    ]);

    useEffect(() => {
        setSeries([
            {
                data: isHours ? cardinality1 : cardinality2
            }
        ]);
    }, [isHours, isLoading1,isLoading2]);

    // @ts-ignore
    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

export default AreaChart;
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
type AreaChartProps = {
    crowdBehavior?: CrowdBehavior[]
};

const AreaChart = ({ crowdBehavior }: AreaChartProps) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);
    const [series, setSeries] = useState<{ name: string, data: number[] }[]>([{ name: "Attendance", data:[] }]);

    // @ts-ignore
    const darkerPrimary = theme.palette.primary[700]
    useEffect(() => {
        const colors: string[] = [];
        const categories: string[] = [];
        const cardinality: number[] = [];
        if (crowdBehavior) {
            crowdBehavior.forEach(d => {
                const date = new Date(d.from)
                categories.push((date.getHours()).toString() + ':' + (date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes()))
                cardinality.push(d.data.length)
                colors.push(secondary)
            });
            setSeries([{ name: "Attendance", data: cardinality }])
        }

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
            },

        }));
    }, [primary, secondary, line, theme, crowdBehavior]);

    // @ts-ignore
    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

export default AreaChart;
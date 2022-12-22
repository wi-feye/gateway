// assets
import {
    DashboardOutlined,
    SettingOutlined,
    TeamOutlined,
    LineChartOutlined,
    ProfileOutlined,
    ShakeOutlined,
    FundOutlined,
    RadarChartOutlined,
    AreaChartOutlined,
    FlagOutlined
} from '@ant-design/icons';
import { MenuGroupType } from "./index";
import { overviewRoute, attendanceRoute, crowdBehaviorRoute, areasRoute, devicesRoute, poiRoute } from "../routes";

// icons
const icons = {
    DashboardOutlined,
    SettingOutlined,
    TeamOutlined,
    LineChartOutlined,
    ProfileOutlined,
    ShakeOutlined,
    RadarChartOutlined,
    FundOutlined,
    AreaChartOutlined,
    FlagOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages: MenuGroupType = {
    id: 'main',
    title: '',
    type: 'group',
    children: [
        {
            id: 'overview',
            title: overviewRoute.title,
            type: 'item',
            url: overviewRoute.url,
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'attendance',
            title: attendanceRoute.title,
            type: 'item',
            url: attendanceRoute.url,
            icon: icons.AreaChartOutlined,
            breadcrumbs: false
        },
        {
            id: 'crowdbehavior',
            title: crowdBehaviorRoute.title,
            type: 'item',
            url: crowdBehaviorRoute.url,
            icon: icons.TeamOutlined,
            breadcrumbs: false
        },
        {
            id: 'areas',
            title: areasRoute.title,
            type: 'item',
            url: areasRoute.url,
            icon: icons.RadarChartOutlined,
            breadcrumbs: false
        },
        {
            id: 'pointsofinterest',
            title: poiRoute.title,
            type: 'item',
            url: poiRoute.url,
            icon: icons.FlagOutlined,
            breadcrumbs: false
        },
        {
            id: 'devices',
            title: devicesRoute.title,
            type: 'item',
            url: devicesRoute.url,
            icon: icons.ShakeOutlined,
            breadcrumbs: false
        }
    ]
};

export default pages;
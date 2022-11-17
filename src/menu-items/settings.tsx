// assets
import { SettingOutlined } from '@ant-design/icons';
import { MenuGroupType } from "./index";
import { settingsRoute } from "../routes";

// icons
const icons = {
    SettingOutlined,
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages: MenuGroupType = {
    id: 'main',
    title: '',
    type: 'group',
    children: [
        {
            id: 'settings',
            title: settingsRoute.title,
            type: 'item',
            url: settingsRoute.url,
            icon: icons.SettingOutlined,
            breadcrumbs: false
        },
    ]
};

export default pages;
// project import
import settings from './settings';
import mainItems from './main-items';

// ==============================|| MENU ITEMS ||============================== //

export type MenuItemType = {
    id: string;
    title: string;
    type: string;
    url: string;
    icon: object
    target?: boolean;
    external?: boolean;
    disabled?: boolean;
    breadcrumbs?: boolean;
};

export type MenuGroupType = {
    id: string;
    title: string;
    type: string;
    children: MenuItemType[];
};

const menuGroupItems = {
    items: [mainItems, settings]
};

export default menuGroupItems;
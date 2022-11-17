import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// material-ui
import {Box, Divider, List, Typography} from '@mui/material';

// project import
import NavItem from './NavItem';
import { MenuGroupType, MenuItemType } from "../../../../menu-items";
import {RootState} from "../../../../store";

// ==============================|| NAVIGATION - LIST GROUP ||============================== //
type NavGroupType = {
    item: MenuGroupType;
    showDivider: boolean;
}
const NavGroup = ({ item, showDivider = false }: NavGroupType) => {
    const navCollapse = item.children?.map((menuItem: MenuItemType) => {
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
    });

    return (
        <List
            subheader={
                item.title &&
                    <Box sx={{ pl: 3, mb: 1.5 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            {item.title}
                        </Typography>
                    </Box>
            }
            sx={{ mb: 1.5, py: 0, zIndex: 0 }}
        >
            {showDivider && <Divider sx={{ borderColor: "#84858F" }} variant="middle" />}
            {navCollapse}
        </List>
    );
};

export default NavGroup;
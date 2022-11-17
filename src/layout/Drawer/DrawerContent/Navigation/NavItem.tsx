import { forwardRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project import
import { activeItem } from '../../../../store/reducers/menu';
import Link from "next/link";
import { MenuItemType } from "../../../../menu-items";
import {RootState} from "../../../../store";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //
type NavItemProps = {
    item: MenuItemType;
    level: number
};
const NavItem = ({ item, level }: NavItemProps) => {
    const dispatch = useDispatch();
    const menu = useSelector((state: RootState) => state.menu);
    const { openItem } = menu;

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    // @ts-ignore
    let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} href={item.url} target={itemTarget} />) };
    if (item?.external) {
        // @ts-ignore
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }

    const itemHandler = (id: string) => {
        dispatch(activeItem({ openItem: [id] }));
    };

    const Icon = item.icon;
    // @ts-ignore
    const itemIcon = item.icon ? <Icon style={{ fontSize: '1.25rem' }} /> : false;

    const isSelected = openItem.findIndex((id: string) => id === item.id) > -1;

    // active menu item on page load
    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch(activeItem({ openItem: [item.id] }));
        }
        // eslint-disable-next-line
    }, []);

    const textColor = '#A4A6B3';
    const iconSelectedColor = '#DDE2FF';

    return (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
            onClick={() => itemHandler(item.id)}
            selected={isSelected}
            sx={{
                zIndex: 1201,
                pl: isSelected ? `${level * 28}px`:`${(level * 28) + 4}px`,
                py: 1.25,
                /*pl: drawerOpen ? `${level * 28}px` : 1.5,*/
                /*py: !drawerOpen && level === 1 ? 1.25 : 1,*/
                ...({
                    '&:hover': {
                        bgcolor: '#3E4049'
                    },
                    '&.Mui-selected': {
                        bgcolor: '#3E4049',
                        borderLeft: `4px solid #DDE2FF`,
                        color: iconSelectedColor,
                        '&:hover': {
                            color: iconSelectedColor,
                            bgcolor: '#3E4049'
                        }
                    }
                }),
                /*...(drawerOpen && {
                    '&:hover': {
                        bgcolor: 'primary.lighter'
                    },
                    '&.Mui-selected': {
                        bgcolor: 'primary.lighter',
                        borderRight: `2px solid ${theme.palette.primary.main}`,
                        color: iconSelectedColor,
                        '&:hover': {
                            color: iconSelectedColor,
                            bgcolor: 'primary.lighter'
                        }
                    }
                }),
                ...(!drawerOpen && {
                    '&:hover': {
                        bgcolor: 'transparent'
                    },
                    '&.Mui-selected': {
                        '&:hover': {
                            bgcolor: 'transparent'
                        },
                        bgcolor: 'transparent'
                    }
                })*/
            }}
        >
            {itemIcon && (
                <ListItemIcon
                    sx={{
                        mr: 2,
                        minWidth: 36,
                        color: isSelected ? iconSelectedColor : textColor,
                        /*...(!drawerOpen && {
                            borderRadius: 1.5,
                            width: 36,
                            height: 36,
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                bgcolor: 'secondary.lighter'
                            }
                        }),*/
                        borderRadius: 1.5,
                        width: 36,
                        height: 36,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...(isSelected && {
                                bgcolor: '#9FA2B4',
                                '&:hover': {
                                    bgcolor: '#9FA2B4'
                                }
                            })
/*                        ...(!drawerOpen &&
                            isSelected && {
                                bgcolor: 'primary.lighter',
                                '&:hover': {
                                    bgcolor: 'primary.lighter'
                                }
                            })*/
                    }}
                >
                    {itemIcon}
                </ListItemIcon>
            )}
            {/*{(drawerOpen || (!drawerOpen && level !== 1)) && (*/}
                <ListItemText
                    primary={
                        <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                            {item.title}
                        </Typography>
                    }
                />
            {/*)}*/}
        </ListItemButton>
    );
};

export default NavItem;
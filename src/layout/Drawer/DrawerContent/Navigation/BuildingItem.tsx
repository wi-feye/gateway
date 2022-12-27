// material-ui
import {
    Autocomplete,
    Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Fade,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem, TextField,
    Typography,
} from '@mui/material';

// project import
import {CaretDownOutlined, HomeOutlined} from "@ant-design/icons";
import {drawerWidth} from "../../../../config";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../store";
import {selectBuilding} from "../../../../store/reducers/building";
import * as React from "react";
import {createBuilding, createSniffer, useDevices, useZerynthBuildings, useZerynthDevices} from "../../../../restapi";
import {TimePicker} from "@mui/x-date-pickers";
import {Time} from "@mui/x-date-pickers/internals/components/icons";
import {DateTime} from "asn1js";
// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const BuildingItem = () => {
    const dispatch = useDispatch();
    const building = useSelector((state: RootState) => state.building);
    const selectedBuilding = building.selectedBuildingIndex == -1 ?
        {name: "", id: -1} : building.availableBuildings[building.selectedBuildingIndex]

    const textColor = '#0E4949';

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    //@ts-ignore
    const handleClickListItem = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        //@ts-ignore
        event: MouseEvent<HTMLElement>,
        index: number,
    ) => {
        dispatch(selectBuilding({selectedBuildingIndex: index}));
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { zerynthBuildings,mutate } = useZerynthBuildings();
    const [openDialog, setOpenDialog] = useState(false);
    const [nameBuilding, setNameBuilding] = useState('');
    const [openTime, setOpenTime] = useState("08:30");
    const [closeTime, setCloseTime] = useState("18:30");
    const [idZDevice, setIdZDevice] = useState('');

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleConfirmDialog = async () => {
        if(idZDevice) {
            setOpenDialog(false);

            await createBuilding(nameBuilding,idZDevice, openTime, closeTime)
            mutate();
        }
    };
    const handleNameBuilding = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNameBuilding(event.target.value);
    };
    const handleOpenTime = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setOpenTime(event.target.value);
    };
    const handleCloseTime = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setCloseTime(event.target.value);
    };

    return (
        <>
            <div>
                <ListItemButton
                    id="select-building-button"
                    onClick={handleClickListItem}
                    sx={{
                        zIndex: 1201,
                        pl: `32px`,
                        py: 2,
                        mb: 3,
                        mt: 1,
                        bgcolor: "#F6EFDC",
                        ...({
                            '&:hover': {
                                bgcolor: '#F6EFDC'
                            }
                        }),
                    }}
                >
                    <ListItemIcon
                        sx={{
                            mr: 2,
                            minWidth: 36,
                            color: textColor,
                            borderRadius: 1.5,
                            width: 36,
                            height: 36,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <HomeOutlined style={{fontSize: '1.25rem'}}/>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Typography variant="h6" sx={{color: textColor}}>
                                {selectedBuilding.name}
                            </Typography>
                        }
                    />
                    <ListItemIcon
                        sx={{
                            minWidth: 36,
                            color: textColor,
                            borderRadius: 1.5,
                            width: 36,
                            height: 36,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CaretDownOutlined style={{fontSize: '1rem'}}/>
                    </ListItemIcon>
                </ListItemButton>
                <Menu
                    anchorEl={anchorEl}
                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                    TransitionComponent={Fade}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    PaperProps={{
                        sx: {
                            ml: -2,
                            borderRadius: 0,
                            bgcolor: "#F6EFDC",
                            filter: 'drop-shadow(0px 4px 0px rgba(0,0,0,0.32))',
                        },
                        elevation: 0,
                        style: {
                            width: drawerWidth,
                        },
                    }}
                >
                    {building.availableBuildings.map((build, index) => (
                        <MenuItem
                            key={build.id}
                            selected={index === building.selectedBuildingIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                        >
                            {build.name}
                        </MenuItem>
                    ))}
                    <MenuItem onClick={handleClickOpen} disableRipple>

                        <Button variant="text">ADD BUILDING</Button>
                    </MenuItem>
                </Menu>
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Create Building</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the values:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        variant="outlined"
                        sx={{width: 300}}
                        onChange={handleNameBuilding}/>
                    <Autocomplete
                        id="controllable-states-demo"
                        value={idZDevice}
                        onChange={(event: any, newValue: string | null, reason) => {
                            if (newValue) setIdZDevice(newValue);
                        }}
                        onInputChange={(event, newInputValue: string, reason) => {
                            const filtered = zerynthBuildings?.filter(zd => zd.name.includes(newInputValue));
                            if (filtered?.length == 1) {
                                setIdZDevice(filtered[0].id);
                            }
                        }}
                        getOptionLabel={option => zerynthBuildings?.find(zd => zd.id == option) ? `${zerynthBuildings?.find(zd => zd.id == option)?.name} [${option}]` : ''}
                        options={zerynthBuildings?.map(zd => zd.id) || []}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="ID ZERYNTH"/>}
                    />
                    <TextField
                        id="time"
                        label="Open Time"
                        type="time"
                        defaultValue="07:30"
                        onChange={handleOpenTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        sx={{ width: 150 }}
                    />
                    <TextField
                        id="time"
                        label="Close Time"
                        type="time"
                        defaultValue="18:30"
                        onChange={handleCloseTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        sx={{ width: 150 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDialog}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default BuildingItem;
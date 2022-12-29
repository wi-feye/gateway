import {useEffect, useState} from 'react';

// material-ui
import {
    CardMedia, Switch,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, Typography, TableHead, TableRow, TableCell, Table, TableBody, DialogContentText, TextField,
} from '@mui/material';
import MainCard from '../../components/MainCard';
import {
    genTmpCode,
    userTelegramGet,
    userTelegramToggle,
    userTelegramDel,
    modifySniffer,
    deleteSniffer, modifyBuilding, deleteBuilding
} from '../../restapi';
import UserTelegram from '../../models/user_telegram';
import * as React from "react";
import Device from "../../models/device";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import Building from "../../models/building";
import {selectBuilding} from "../../store/reducers/building";
import Router from "next/router";
import {overviewRoute} from "../../routes";


// ==============================|| SETTINGS - DEFAULT ||============================== //

const Settings = () => {
    const urlBotTelegram = "https://t.me/wifeye_bot";
    const qrUrlBotTelegram = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${urlBotTelegram}`;

    const [openGenTmpCodeDialog, setOpenGenTmpCodeDialog] = useState(false);
    const [tmpCode, setTmpCode] = useState('');
    const [userTelegram, setUserTelegram] = useState<UserTelegram>();
    const [timer, setTimer] = useState(new Date());

    const handleClose = () => setOpenGenTmpCodeDialog(false);

    const timerLabel = () => {
        const gt = new Date(userTelegram?.gencode_timestamp ?? '');
        timer.setHours(timer.getHours() + timer.getTimezoneOffset());
        const diff = 600000 - (timer.getTime() - gt.getTime());
        if (diff <= 0) {
            return "00:00";
        }
        const diffDate = new Date(diff);
        return `${diffDate.getMinutes().toString().padStart(2, '0')}:${diffDate.getSeconds().toString().padStart(2, '0')}`;
    }

    const genTmpCodeCallback = async () => {
        const tmpCodObj = await genTmpCode();
        const userTelegramRes = await userTelegramGet();
        const tmpcodeStr = tmpCodObj.tmpcode.toString();
        const finalTmpCodeLabel = `${tmpcodeStr.substring(0, 3)} ${tmpcodeStr.substring(3)}`;
        setUserTelegram(userTelegramRes);
        setTmpCode(finalTmpCodeLabel);
        setOpenGenTmpCodeDialog(true);
    }

    const handleChange = () => userTelegramToggle();

    const handleRemove = () => {
        userTelegramDel();
        setUserTelegram(undefined);
    };

    const isPaired = () => userTelegram && userTelegram.chatid;

    useEffect(() => {
        if (isPaired()) return;
        const interval = setInterval(async () => {
            if (isPaired()) return;
            const userTelegramRes = await userTelegramGet();
            if (userTelegramRes && userTelegramRes.chatid) {
                setUserTelegram(userTelegramRes);
                setOpenGenTmpCodeDialog(false);
            }
            setTimer(new Date());
        }, 200);

        return () => clearInterval(interval);
    }, [setUserTelegram]);

    const building = useSelector((state: RootState) => state.building);
    const selectedBuilding: Building = building.selectedBuildingIndex == -1 ?
        {name: "", id: -1} : building.availableBuildings[building.selectedBuildingIndex]

    const [openModify, setopenModify] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [nameBuilding, setnameBuilding] = useState(selectedBuilding?.name);
    const [openTime, setopenTime] = useState(selectedBuilding?.open_time);
    const [closeTime, setcloseTime] = useState(selectedBuilding?.close_time);
    const handleClickOpenModify = () => {
        setopenModify(true);
    };
    const handleCloseModify = () => {
        setopenModify(false);
    };

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleConfirm = async () => {
        if(selectedBuilding && selectedBuilding.id_zerynth && openTime && closeTime) {
            await modifyBuilding(selectedBuilding?.id.toString(), nameBuilding, selectedBuilding?.id_zerynth, openTime, closeTime)
            // if (mutate) mutate();
            setopenModify(false);
            window.location.reload();
        }
    };
    const handleOpenTime = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setopenTime(event.target.value.toString());
    };
    const handleCloseTime = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setcloseTime(event.target.value.toString());
    };
    const handlenameBuilding = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setnameBuilding(event.target.value);
    };

    const handleEliminaBuilding = async () => {
        if(selectedBuilding) {
            await deleteBuilding(selectedBuilding?.id.toString());
            window.location.reload();

            // if (mutate) mutate();
        }
    };

    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12} sx={{mb: -2.25}}>
                    <Typography variant="h5">Telegram bot</Typography>
                </Grid>
                <Grid item xs={12}>
                    <MainCard sx={{mt: 2}}>
                        {isPaired()
                            ?
                            <Table>
                                <TableHead>
                                    <TableCell align={"center"}>
                                        Chat ID
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        Enabled notification
                                    </TableCell>
                                    <TableCell align={"center"}>

                                    </TableCell>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align={"center"}>
                                            {userTelegram?.chatid}
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <Switch
                                                checked={userTelegram?.enabled}
                                                onChange={handleChange}
                                                inputProps={{'aria-label': 'controlled'}}
                                            />
                                        </TableCell>
                                        <TableCell align={"center"}>
                                            <Button color='error' onClick={handleRemove}>Remove telegram pair</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            : <Button onClick={genTmpCodeCallback}>Pair telegram</Button>}
                    </MainCard>
                </Grid>
                <Grid item xs={12} sx={{mb: -2.25}}>
                    <Typography variant="h5">Settings building</Typography>
                </Grid>
                {selectedBuilding ? <Grid item xs={12}>
                    <MainCard sx={{mt: 2}}>
                        <Button variant="contained" color="info" onClick={handleClickOpenModify}
                                sx={{margin: 3}}>Modify</Button>

                        <Button variant="contained" color="error" onClick={handleClickOpenDelete}>Delete</Button>
                    </MainCard>
                </Grid> : ''}
            </Grid>

            <Dialog open={openGenTmpCodeDialog} onClose={handleClose}>
                <Grid container direction="column" alignItems="center">
                    <DialogTitle fontWeight={"bold"} fontSize={30}>{tmpCode}</DialogTitle>
                    <a href={urlBotTelegram}>
                        <CardMedia
                            sx={{height: 150, width: 150}}
                            image={qrUrlBotTelegram}
                            title="bot telegram"
                        />
                    </a>
                    {timerLabel()}
                    <DialogContent>
                        <p style={{textAlign: "center"}}>
                            Write this temporal code on telegram bot accessible through the qr-code to associate your
                            WiFeye account to a telegram account.
                        </p>
                    </DialogContent>
                </Grid>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openModify} onClose={handleCloseModify}>
                <DialogTitle>Modify Building</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the values you want to change:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        type="text"
                        variant="outlined"
                        onChange={handlenameBuilding}/>
                    <TextField
                        id="time"
                        label="Open Time"
                        type="time"
                        margin="dense"
                        defaultValue="07:30"
                        onChange={handleOpenTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        sx={{width: 150}}
                    />
                    <TextField
                        id="time"
                        label="Close Time"
                        type="time"
                        margin="dense"
                        defaultValue="18:30"
                        onChange={handleCloseTime}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                        sx={{width: 150}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModify}>Cancel</Button>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDelete}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to continue?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        By clicking on continue you will eliminate the building.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button onClick={handleEliminaBuilding} autoFocus>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Settings;
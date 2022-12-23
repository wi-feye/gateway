import {useEffect, useState} from 'react';

// material-ui
import {
    CardMedia, Switch,
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, Typography, TableHead, TableRow, TableCell, Table, TableBody,
} from '@mui/material';
import MainCard from '../../components/MainCard';
import { genTmpCode, userTelegramGet, userTelegramToggle, userTelegramDel } from '../../restapi';
import UserTelegram from '../../models/user_telegram';


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
        const diff =  600000 - (timer.getTime() - gt.getTime());
        if(diff <= 0) {
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
        if(isPaired()) return;
        const interval = setInterval(async () => {
            if(isPaired()) return;
            const userTelegramRes = await userTelegramGet();
            if(userTelegramRes && userTelegramRes.chatid) {
                setUserTelegram(userTelegramRes);
                setOpenGenTmpCodeDialog(false);
            }
            setTimer(new Date());
        }, 200);

        return () => clearInterval(interval);
    }, [setUserTelegram]);

    return (
        <>
            <Grid container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12} sx={{mb: -2.25}}>
                    <Typography variant="h5">Telegram bot</Typography>
                </Grid>
                <Grid item xs={12}>
                    <MainCard sx={{ mt: 2 }}>
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
                                            inputProps={{ 'aria-label': 'controlled' }}
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
            </Grid>

        <Dialog open={openGenTmpCodeDialog} onClose={handleClose}>
            <Grid container direction="column" alignItems="center">
                <DialogTitle fontWeight={"bold"} fontSize={30}>{tmpCode}</DialogTitle>
                <a href={urlBotTelegram}>
                    <CardMedia
                        sx={{ height: 150, width: 150 }}
                        image={qrUrlBotTelegram}
                        title="bot telegram"
                    />
                </a>
                {timerLabel()}
                <DialogContent>
                    <p style={{textAlign: "center"}}>
                    Write this temporal code on telegram bot accessible through the qr-code to associate your WiFeye account to a telegram account.
                    </p>
                </DialogContent>
            </Grid>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default Settings;
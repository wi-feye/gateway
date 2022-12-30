import AddNewBuildingForm from "../AddNewBuildingForm";
import React, {useState} from "react";
import {createBuilding, useZerynthBuildings} from "../../restapi";
import {Button, Grid, Typography} from "@mui/material";
import AuthWrapper from "../../pages/login/AuthWrapper";

function CreateFirstBuildingPageContent() {
    const { zerynthBuildings, mutate } = useZerynthBuildings();
    const [nameBuilding, setNameBuilding] = useState('');
    const [openTime, setOpenTime] = useState("08:30");
    const [closeTime, setCloseTime] = useState("18:30");
    const [idZDevice, setIdZDevice] = useState('');

    const onChangeBuildingName = (newName: string) => {
        setNameBuilding(newName);
    }
    const onChangeOpeningHour = (newOpeningHour: string) => {
        setOpenTime(newOpeningHour);
    }
    const onChangeClosingHour = (newClosingHour: string) => {
        setCloseTime(newClosingHour);
    }

    const onChangeZerynthId = (newId: string) => {
        setIdZDevice(newId);
    };

    const handleConfirm = async () => {
        if (!idZDevice || !nameBuilding || !openTime || !closeTime) return;

        await createBuilding(nameBuilding,idZDevice, openTime, closeTime)
        mutate();
        window.location.reload();
    };

    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h5">Let's start! Create your first building</Typography>
                </Grid>
                <Grid item xs={12}>
                    <AddNewBuildingForm
                        onChangeBuildingName={onChangeBuildingName}
                        onChangeOpeningHour={onChangeOpeningHour}
                        onChangeClosingHour={onChangeClosingHour}
                        onChangeZerynthId={onChangeZerynthId}
                        zerynthBuildings={zerynthBuildings}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        onClick={handleConfirm}
                        disableElevation
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Confirm
                    </Button>
                </Grid>
            </Grid>

        </AuthWrapper>
    )
}

export default CreateFirstBuildingPageContent;
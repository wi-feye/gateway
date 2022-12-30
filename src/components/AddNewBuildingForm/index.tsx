import {Autocomplete, Stack, TextField} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import ZerynthBuilding from "../../models/zerynth_building";

type AddNewBuildingFormProps = {
    onChangeBuildingName: (newName: string) => void,
    onChangeOpeningHour: (newOpeningHour: string) => void,
    onChangeClosingHour: (newClosingHour: string) => void,
    onChangeZerynthId: (newId: string) => void,
    zerynthBuildings?: ZerynthBuilding[],
    fullWidth?: boolean
}
function AddNewBuildingForm({ onChangeBuildingName, onChangeOpeningHour, onChangeClosingHour, onChangeZerynthId, zerynthBuildings, fullWidth }: AddNewBuildingFormProps) {
    const [idZDevice, setIdZDevice] = useState('');

    return (
        <Stack direction="column" alignItems={fullWidth ? "left":"center"} spacing={2}>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Building name"
                type="text"
                variant="outlined"
                sx={{minWidth: 300}}
                fullWidth={fullWidth}
                onChange={(e) => onChangeBuildingName(e.target.value)}
            />
            <Autocomplete
                id="controllable-states-demo"
                value={idZDevice}
                onChange={(event: any, newValue: string | null, reason) => {
                    if (newValue) {
                        setIdZDevice(newValue);
                        onChangeZerynthId(newValue);
                    }
                }}
                onInputChange={(event, newInputValue: string, reason) => {
                    const filtered = zerynthBuildings?.filter(zd => zd.name.includes(newInputValue));
                    if (filtered?.length == 1) {
                        onChangeZerynthId(filtered[0].id);
                        setIdZDevice(filtered[0].id);
                    }
                }}
                getOptionLabel={option => zerynthBuildings?.find(zd => zd.id == option) ? `${zerynthBuildings?.find(zd => zd.id == option)?.name} [${option}]` : ''}
                options={zerynthBuildings?.map(zd => zd.id) || []}
                sx={{minWidth: 300}}
                fullWidth={fullWidth}
                renderInput={(params) => <TextField {...params} label="Zerynth ID"/>}
            />
            <Stack direction={fullWidth ? "column":"row"} alignItems="center" spacing={2}>
                <TextField
                    id="time"
                    label="Opening hour"
                    type="time"
                    defaultValue="07:30"
                    onChange={(e) => onChangeOpeningHour(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                    sx={{minWidth: 142}}
                    fullWidth={fullWidth}
                />
                <TextField
                    id="time"
                    label="Closing hour"
                    type="time"
                    defaultValue="18:30"
                    onChange={(e) => onChangeClosingHour(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                    sx={{minWidth: 142}}
                    fullWidth={fullWidth}
                />
            </Stack>
        </Stack>
    );
}

export default AddNewBuildingForm;
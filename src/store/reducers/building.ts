// types
import { createSlice } from '@reduxjs/toolkit';
import { Building } from "../../models/building";
// initial state
const initialState: {selectedBuildingIndex: number, availableBuildings: Building[]} = {
    selectedBuildingIndex: -1,
    availableBuildings: []
};

// ==============================|| SLICE - MENU ||============================== //

const building = createSlice({
    name: 'building',
    initialState,
    reducers: {
        selectBuilding(state, action) {
            state.selectedBuildingIndex = action.payload.selectedBuildingIndex;
        },
        setAvailableBuildings(state, action) {
            state.availableBuildings = action.payload.availableBuildings;
            state.selectedBuildingIndex = 0;
        }
    }
});

export default building.reducer;

export const { selectBuilding, setAvailableBuildings } = building.actions;
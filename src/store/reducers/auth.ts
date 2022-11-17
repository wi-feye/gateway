// types
import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    isLoggedIn: false,
    openComponent: 'buttons',
    drawerOpen: false,
    componentDrawerOpen: true
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
        }
    }
});

export default menu.reducer;

export const { setIsLoggedIn } = menu.actions;
// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import auth from './auth';
import building from './building';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu: menu,
    authentication: auth,
    building: building
});

export default reducers;
import {useSelector} from "react-redux";
import {dispatch, RootState} from "../store";
import {useBuildings} from "../restapi";
import {User} from "../models/user";
import {setAvailableBuildings} from "../store/reducers/building";

export default function useAvailableBuildings(user?: User): boolean {
    const buildingState = useSelector((state: RootState) => state.building);
    const { buildings, isLoading, isError } = useBuildings(user);

    if (buildings && !isLoading && !isError) {
        if (buildingState.availableBuildings.length == 0)
            dispatch(setAvailableBuildings({availableBuildings: buildings}))
    }

    return isLoading && !isError;
}
import Area from "../../../../models/area";

export type EditedArea = {
    area: Area,
    newLocation: number[][]
}

export default EditedArea;
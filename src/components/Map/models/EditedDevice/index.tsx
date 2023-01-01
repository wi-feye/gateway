import Device from "../../../../models/device";

export type EditedDevice = {
    device: Device,
    newLocationX: number,
    newLocationY: number,
}

export default EditedDevice;
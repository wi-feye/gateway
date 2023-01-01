import {LatLngExpression, Marker, MarkerOptions} from "leaflet";
import Device from "../../../../models/device";

class MarkerDevice extends Marker {
    device: Device

    constructor(latlng: LatLngExpression, options: MarkerOptions, device: Device) {
        super(latlng, options);
        this.device = device;
    }
}

export default MarkerDevice;
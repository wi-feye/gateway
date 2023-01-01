import {LatLngExpression, Polygon, PolylineOptions} from "leaflet";
import Area from "../../../../models/area";

class PolygonArea extends Polygon {
    area: Area

    constructor(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options: PolylineOptions, area: Area) {
        super(latlngs, options);
        this.area = area;
    }
}

export default PolygonArea;
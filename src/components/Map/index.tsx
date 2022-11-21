import {useCallback, useEffect, useState} from "react";

import {
    HeatMapOptions,
    LatLng,
    Map as LeafletMap, Marker,
    TileLayer
} from "leaflet";
import * as Leaflet from 'leaflet'; // this is needed to call Leaflet.heatLayer() function
import "leaflet/dist/leaflet.css"; // style for leaflet
import "leaflet.heat"; // add heatLayer function to leaflet
import LoadingComponent from "../LoadingComponent";

// Function to convert xy coordinates into yx leaflet coordinates with latitude and longitude
function xy(x: any, y: any) {
    if (Leaflet.Util.isArray(x)) {    // When doing xy([x, y]);
        return new LatLng(x[1], x[0]);
    }
    return new LatLng(y, x);  // When doing xy(x, y);
}

type HeatmapPropType = {
    center: number[],
    height: number,
    whenReady?: () => void,
    heatmapPoints?: number[][]
}
export default function Map({ center, height, whenReady, heatmapPoints }: HeatmapPropType) {
    const [map, setMap] = useState<LeafletMap>();
    const [heatmapLayer, setHeatmapLayer] = useState<Leaflet.HeatLayer>();

    const [isLoading, setIsLoading] = useState(true);
    const onMapReady = () => {
        setIsLoading(false);
        if (whenReady != null) whenReady();
    }

    const zoom = 18; // max zoom is 18
    const mapRef = useCallback((node: HTMLDivElement | null) => { // fix per "map already created"
        if (node !== null && map == null) {
            let newMap = new LeafletMap(node, {
                scrollWheelZoom: false, // avoid zoomming while scrolling on the page
                zoomControl: true,
            });

            newMap = newMap.whenReady(onMapReady); //Runs when the map gets initialized with a view (center and zoom) and at least one layer
            const tileLayer = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png')
            newMap = newMap.addLayer(tileLayer);
            //tileLayer.on("load", () => setIsLoading(false))
            if (center != null && zoom != null) {
                newMap.setView(new LatLng(center[0], center[1]), zoom)
            } else {
                newMap.fitWorld();
            }
            setMap(newMap);
            console.log(newMap.getBounds())
        }
    }, []);

    const buildHeatmap = (map: LeafletMap, points: number[][]): LeafletMap => {
        const heatmapOptions: HeatMapOptions = {
            maxZoom: 10,
            radius: 16
        }

        const pointsLatLng = points.map(x => new LatLng(x[0], x[1]));
        if (!heatmapLayer) { // build layer if it is the first time
            const heatmapLayer = Leaflet.heatLayer(pointsLatLng, heatmapOptions);
            const newMap = map.addLayer(heatmapLayer);
            setMap(newMap);
            setHeatmapLayer(heatmapLayer);
            console.log("Build layer and change heatmap points");
        } else {   // update the layer otherwise
            let newHeatmapLayer = heatmapLayer.setLatLngs(pointsLatLng);
            setHeatmapLayer(newHeatmapLayer);
            console.log("Change heatmap points");
        }

        return map;
    };

    useEffect(() => {
        if (heatmapPoints && map) {
            const newMap = buildHeatmap(map, heatmapPoints);
            setMap(newMap);
        }
    }, [heatmapPoints, map]);

    return (
        <div style={{ height: `${height}px` }}>
            { isLoading ? <LoadingComponent />:null }
            <div
                ref={mapRef}
                className="leaflet-map"
                style={{ height: `${height}px` }}>
            </div>
        </div>
    )
}
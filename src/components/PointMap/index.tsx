import {useCallback, useEffect, useState} from "react";

import {
    Icon,
    LatLng,
    Map as LeafletMap, Marker, Point, PointExpression, Popup,
    TileLayer
} from "leaflet";
import * as Leaflet from 'leaflet'; // this is needed to call Leaflet.heatLayer() function
import "leaflet/dist/leaflet.css"; // style for leaflet
import "leaflet.heat";
import LoadingComponent from "../LoadingComponent";
import Device from "../../models/device";
import {Typography} from "@mui/material";
import * as React from "react";
import {renderToString} from "react-dom/server";
import {CheckCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons";

// Function to convert xy coordinates into yx leaflet coordinates with latitude and longitude
function xy(x: any, y: any) {
    if (Leaflet.Util.isArray(x)) {    // When doing xy([x, y]);
        return new LatLng(x[1], x[0]);
    }
    return new LatLng(y, x);  // When doing xy(x, y);
}

function buildDeviceMarkerPopup(device: Device) {
    return (
        <div style={{ display: "flex", alignItems: "center"}}>
            {device.status == "Online" ?
                <CheckCircleOutlined style={{ fontSize: "24px", marginRight: "10px" }}/>
                :
                <ExclamationCircleOutlined style={{ fontSize: "24px", marginRight: "10px" }}/>
            }
            <Typography variant="h3" sx={{ mt: 0 }}>
                { device.name }
            </Typography>
        </div>
    );
}

type HeatmapPropType = {
    center: number[],
    height: number,
    whenReady?: () => void,
    devices?: Device[]
}
export default function Map({ center, height, whenReady, devices }: HeatmapPropType) {
    const [map, setMap] = useState<LeafletMap>();
    const [markers, setDevicesMarkers] = useState<Marker[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const onMapReady = () => {
        setIsLoading(false);
        if (whenReady != null) whenReady();
    }

    const iconSize: PointExpression = [50, 50];
    const deviceMarkerIcon = new Icon({
        iconSize: iconSize,
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Chromecast_cast_button_icon.svg/2048px-Chromecast_cast_button_icon.svg.png'
    });
    const zoom = 18; // max zoom is 18
    const mapRef = useCallback((node: HTMLDivElement | null) => { // fix per "map already created"

        if (node !== null && map == null) {
            let newMap = new LeafletMap(node, {
                scrollWheelZoom: false, // avoid zoomming while scrolling on the page
                zoomControl: true
            });

            const tileLayer = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png')
            newMap = newMap.addLayer(tileLayer);
            newMap = newMap.whenReady(onMapReady);
            if (center != null && zoom != null) {
                newMap.setView(new LatLng(center[0], center[1]), zoom)
            }

            if (devices) {
                devices?.forEach((d: Device) => {
                    newMap = addMarkerDevice(newMap, d, deviceMarkerIcon, iconSize[1]);
                });
            }
            setMap(newMap);
        }
    }, []);

    const addMarkerDevice = (map: LeafletMap, device: Device, icon: Icon, iconYSize: number): LeafletMap => {
        const markerLayer = new Marker(xy(device.x, device.y), {
            icon: icon,
            title: device.name,
        });
        const markerPopup = buildDeviceMarkerPopup(device);
        markerLayer.bindPopup(renderToString(markerPopup), { // some options for the bind popup
            offset: new Point(0, -iconYSize / 4),
            minWidth: 80
        });
        markers.push(markerLayer);
        setDevicesMarkers(markers);

        return map.addLayer(markerLayer);
    }


    useEffect(() => {
        if (devices && map) {
            markers.forEach((marker) => marker.remove());
            setDevicesMarkers([]);

            let mapObj = map;
            devices?.forEach((d: Device) => {
                mapObj = addMarkerDevice(mapObj, d, deviceMarkerIcon, iconSize[1]);
            });
            setMap(mapObj);
        }
    }, [devices])

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
import {useCallback, useEffect, useState} from "react";

import {
    HeatMapOptions, Icon,
    LatLng, LatLngBounds,
    Map as LeafletMap, Marker, Point, PointExpression, Polygon, polygon,
    TileLayer
} from "leaflet";
import * as Leaflet from 'leaflet'; // this is needed to call Leaflet.heatLayer() function
import "leaflet/dist/leaflet.css"; // style for leaflet
import "leaflet.heat"; // add heatLayer function to leaflet
import LoadingComponent from "../LoadingComponent";
import Area from "../../models/area";
import Device from "../../models/device";
import {renderToString} from "react-dom/server";
import {CheckCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {Box, CircularProgress, Typography} from "@mui/material";
import * as React from "react";
import CrowdPosition from "../../models/crowdposition";
import PointOfInterest from "../../models/pointOfInterest";

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

function buildPOIMarkerPopup(poi: PointOfInterest) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Typography variant="h3" sx={{ mt: 0 }}>
                Point of Interest affidability: {poi.likelihood*100}%
            </Typography>
        </Box>
    );
}

// Function to convert xy coordinates into yx leaflet coordinates with latitude and longitude
function xy(x: any, y: any) {
    if (Leaflet.Util.isArray(x)) {    // When doing xy([x, y]);
        return new LatLng(x[1], x[0]);
    }
    return new LatLng(y, x);  // When doing xy(x, y);
}

type MapPropType = {
    height: number,
    center?: number[],
    zoomSnap?: number,
    mapUrl?: string,
    whenReady?: () => void,
    heatmapPoints?: CrowdPosition[],
    areas?: Area[],
    fitAreasBounds?: boolean,
    devices?: Device[]
    pointOfInterest?: PointOfInterest[]
}
export default function Map({ center, zoomSnap, height, whenReady, mapUrl, heatmapPoints, areas, fitAreasBounds, devices, pointOfInterest }: MapPropType) {
    const [map, setMap] = useState<LeafletMap>();
    const [heatmapLayer, setHeatmapLayer] = useState<Leaflet.HeatLayer>();
    const [polygons, setPolygons] = useState<Polygon[]>([]);
    const [devicesMarkers, setDevicesMarkers] = useState<Marker[]>([]);
    const [pointsMarkers, setPointsMarkers] = useState<Marker[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const onMapReady = () => {
        setIsLoading(false);
        if (whenReady != null) whenReady();
    }

    console.log("MAAAAPPP",pointOfInterest)
    const POLYGON_PANE = "heatmap_pane";
    const DEVICES_PANE = "devices_pane";
    const DEVICES_SHADOW_PANE = "devices_shadow_pane";
    const zoom = 18; // max zoom is 18
    const mapRef = useCallback((node: HTMLDivElement | null) => { // fix per "map already created"
        if (node !== null && map == null) {
            let newMap = new LeafletMap(node, {
                scrollWheelZoom: false, // avoid zoomming while scrolling on the page
                zoomControl: true,
                zoomSnap: zoomSnap
            });

            newMap = newMap.whenReady(onMapReady); //Runs when the map gets initialized with a view (center and zoom) and at least one layer

            if (mapUrl) {
                const tileLayer = new TileLayer(mapUrl)
                newMap = newMap.addLayer(tileLayer);
            }

            if (center != null && zoom != null) {
                newMap = newMap.setView(new LatLng(center[0], center[1]), zoom);
            } /* else {
                newMap = newMap.fitWorld();
            }*/

            newMap.createPane(POLYGON_PANE).style.zIndex = "390"; // polygon is below everything
            // heatmap goes here. It has zIndex 400
            newMap.createPane(DEVICES_SHADOW_PANE).style.zIndex = "404"; // on top of heatmap, behind device icon
            newMap.createPane(DEVICES_PANE).style.zIndex = "405"; // on top of everything

            setMap(newMap);
        }
    }, []);

    const buildHeatmap = (map: LeafletMap, positions: CrowdPosition[]): LeafletMap => {
        const heatmapOptions: HeatMapOptions = {
            maxZoom: 6,
            radius: 13
        }

        let retMap = map;
        const pointsLatLng = positions.map(pos => xy(pos.x, pos.y));
        if (!heatmapLayer) { // build layer if it is the first time
            const heatmapLayer = Leaflet.heatLayer(pointsLatLng, heatmapOptions);
            const newMap = map.addLayer(heatmapLayer);
            setMap(newMap);
            setHeatmapLayer(heatmapLayer);

            retMap = newMap;
        } else {   // update the layer otherwise
            let newHeatmapLayer = heatmapLayer.setLatLngs(pointsLatLng);
            setHeatmapLayer(newHeatmapLayer);
        }

        return retMap;
    };

    useEffect(() => {
        if (heatmapPoints && map) {
            const newMap = buildHeatmap(map, heatmapPoints);
            setMap(newMap);
        }
    }, [heatmapPoints, map]);

    const buildPolygons = (map: LeafletMap, areas: Area[]): LeafletMap => {
        let retMap = map;
        areas.forEach(area => {
            const pointsLatLng = area.location.map(coord => xy(coord[0], coord[1]));
            const poly = new Polygon(pointsLatLng, {
                // polygon options
                color: "#dcdee2",
                fillColor: "#f1f3f4",
                fillOpacity: 1,
                weight: 2,
                pane: POLYGON_PANE
            });
            poly.bindTooltip(area.name,{
                permanent: true,
                direction: "center",
                className: "leaflet-area-tooltip"
            }).openTooltip();

            polygons.push(poly);
            setPolygons(polygons);

            retMap = map.addLayer(poly);
        });

        return retMap;
    }

    const computeAreasBounds = (areas: Area[]) => {
        let newBounds: number[] = [];
        if (areas && areas.length > 0) {
            // min x, min y, max x, max y
            newBounds = [areas[0].location[0][0], areas[0].location[0][1], areas[0].location[0][0], areas[0].location[0][1]];
            areas?.forEach(area => {
                area.location.forEach(loc => {
                    if (loc[0] < newBounds[0]) newBounds[0] = loc[0]; // min x
                    if (loc[1] < newBounds[1]) newBounds[1] = loc[1]; // min y
                    if (loc[0] > newBounds[2]) newBounds[2] = loc[0]; // max x
                    if (loc[1] > newBounds[3]) newBounds[3] = loc[1]; // max y
                })
            });
        }

        return newBounds;
    }

    const boundsGap = 1;
    useEffect(() => {
        if (areas && map) {
            polygons.forEach((poly) => poly.remove());
            setPolygons([]);

            let newMap = buildPolygons(map, areas);
            if (fitAreasBounds && areas.length > 0) {
                // min x, min y, max x, max y
                const newBounds = computeAreasBounds(areas);
                console.log(newBounds);
                const centerXY = xy(
                    (newBounds[0] + newBounds[2]) / 2,
                    (newBounds[1] + newBounds[3]) / 2,
                );
                newMap = newMap.setView(centerXY).fitBounds(new LatLngBounds(
                    xy(newBounds[0] - boundsGap, newBounds[1] - boundsGap),
                    xy(newBounds[2] + boundsGap, newBounds[3] + boundsGap),
                ));
            }

            setMap(newMap);
        }
    }, [areas, map]);

    const iconSize: PointExpression = [28, 40];
    const shadowSize: PointExpression = [20, 20];
    const deviceMarkerIcon = new Icon({
        iconSize: iconSize, // size of the icon
        iconAnchor: [iconSize[0]/2, iconSize[1]], // point of the icon which will correspond to marker's location
        iconUrl: '/assets/images/device_icon.png',
        shadowUrl: '/assets/images/device_icon_shadow.png',
        shadowSize: shadowSize, // size of the shadow
        shadowAnchor: [shadowSize[0]/2, shadowSize[1]/2],  // point of the icon which will correspond to shadow's location
    });


    const addMarkerDevice = (map: LeafletMap, device: Device, icon: Icon, iconYSize: number): LeafletMap => {
        const markerLayer = new Marker(xy(device.x, device.y), {
            icon: icon,
            title: device.name,
            pane: DEVICES_PANE,
            shadowPane: DEVICES_SHADOW_PANE,
        });
        const markerPopup = buildDeviceMarkerPopup(device);
        markerLayer.bindPopup(renderToString(markerPopup), { // some options for the bind popup
            offset: new Point(0, -iconYSize / 4),
            minWidth: 80
        });
        devicesMarkers.push(markerLayer);
        setDevicesMarkers(devicesMarkers);

        return map.addLayer(markerLayer);
    }

    const interestPointMarkerIcon = new Icon({
        iconSize: iconSize, // size of the icon
        iconAnchor: [iconSize[0]/2, iconSize[1]], // point of the icon which will correspond to marker's location
        iconUrl: '/assets/images/point_of_interest.png',
        shadowUrl: '/assets/images/device_icon_shadow.png',
        shadowSize: shadowSize, // size of the shadow
        shadowAnchor: [shadowSize[0]/2, shadowSize[1]/2],  // point of the icon which will correspond to shadow's location
    });

    const addMarkerInterestPoint = (map: LeafletMap, point: PointOfInterest, icon: Icon, iconYSize: number): LeafletMap => {
        const markerLayer = new Marker(xy(point.x, point.y), {
            icon: icon,
            pane: DEVICES_PANE,
            shadowPane: DEVICES_SHADOW_PANE,
        });
        const markerPopup = buildPOIMarkerPopup(point);
        markerLayer.bindPopup(renderToString(markerPopup), { // some options for the bind popup
            offset: new Point(0, -iconYSize / 4),
            minWidth: 80
        });
        pointsMarkers.push(markerLayer);
        setPointsMarkers(pointsMarkers);

        return map.addLayer(markerLayer);
    }

    useEffect(() => {
        if (devices && map && pointOfInterest) {
            devicesMarkers.forEach((marker) => marker.remove());
            pointsMarkers.forEach((marker) => marker.remove());
            setDevicesMarkers([]);
            setPointsMarkers([]);

            let mapObj = map;
            devices?.forEach((d: Device) => {
                mapObj = addMarkerDevice(mapObj, d, deviceMarkerIcon, iconSize[1]);
            });

            pointOfInterest?.forEach((p: PointOfInterest) => {
                mapObj = addMarkerInterestPoint(mapObj, p, interestPointMarkerIcon, iconSize[1]);
            });

            setMap(mapObj);
        }
    }, [devices, map]);

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
import {useCallback, useEffect, useState} from "react";

import {
    FeatureGroup,
    HeatMapOptions, Icon,
    LatLng, LatLngBounds, Layer,
    Map as LeafletMap, Marker, Point, PointExpression, Polygon, Polyline, Rectangle,
    TileLayer
} from "leaflet";
import * as Leaflet from 'leaflet'; // this is needed to call Leaflet.heatLayer() function
import "leaflet/dist/leaflet.css"; // style for leaflet
import "leaflet.heat"; // add heatLayer function to leaflet
import "leaflet-draw"; // add draw plugin
import "leaflet-draw/dist/leaflet.draw-src.css"
import "leaflet-draw/dist/leaflet.draw.css"
import LoadingComponent from "../LoadingComponent";
import Area from "../../models/area";
import Device from "../../models/device";
import {renderToString} from "react-dom/server";
import {CheckCircleOutlined, ExclamationCircleOutlined} from "@ant-design/icons";
import {Box, Typography} from "@mui/material";
import * as React from "react";
import CrowdPosition from "../../models/crowdposition";
import PointOfInterest from "../../models/pointOfInterest";
import EditedArea from "./models/EditedArea";
import EditedDevice from "./models/EditedDevice";
import MarkerDevice from "./models/MarkerDevice";
import PolygonArea from "./models/PolygonArea";

const BUTTON_TITLE_CREATE_AREA = "Create areas";
const BUTTON_TITLE_CREATE_SNIFFER = "Create sniffer";
const BUTTON_TITLE_EDIT_AREA = "Edit areas";
const BUTTON_TITLE_EDIT_SNIFFER = "Edit sniffers";
const BUTTON_TITLE_EDIT_AREA_AND_SNIFFER = "Create areas and sniffers";
const BUTTON_TITLE_REMOVE_AREA = "Delete areas";
const BUTTON_TITLE_REMOVE_SNIFFER = "Delete sniffers";
const BUTTON_TITLE_REMOVE_AREA_AND_SNIFFER = "Delete areas and sniffers";

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

function getPolygonXYCoords(poly: Polygon): number[][] {
    const result: number[][] = [];

    poly.getLatLngs().forEach(latlng => {
        if (latlng instanceof LatLng) {
            result.push([latlng.lng, latlng.lat]);
        } else {
            latlng.forEach(latlng => {
                if (latlng instanceof LatLng) {
                    result.push([latlng.lng, latlng.lat]);
                } else {
                    latlng.forEach(latlng => result.push([latlng.lng, latlng.lat]));
                }
            });
        }
    });

    return result;
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
    devices?: Device[],
    editableDevices?: Device[],
    pointOfInterest?: PointOfInterest[],
    editable?: {
        devices?: boolean,
        areas?: boolean
    },
    onCreateAreas?: (points: number[][][]) => void,
    //onCreateDevices?: (points: number[][]) => void,
    onEditAreas?: (editedAreas: EditedArea[]) => void,
    onDeleteAreas?: (areas: Area[]) => void,
    onEditDevices?: (editedDevices: EditedDevice[]) => void,
    //onDeleteDevices?: (points: number[][]) => void,
}
export default function Map({ center, zoomSnap, height, whenReady, mapUrl, heatmapPoints, areas, fitAreasBounds, devices, pointOfInterest, editable, onCreateAreas, onEditAreas, onDeleteAreas, onEditDevices, editableDevices }: MapPropType) {
    const [map, setMap] = useState<LeafletMap>();
    const [heatmapLayer, setHeatmapLayer] = useState<Leaflet.HeatLayer>();
    const [editableLayer, setEditableLayer] = useState<FeatureGroup>(new FeatureGroup());
    const [devicesLayer, setDevicesLayer] = useState<FeatureGroup>(new FeatureGroup());
    const [areasLayer, setAreasLayer] = useState<FeatureGroup>(new FeatureGroup());
    const [pointsMarkers, setPointsMarkers] = useState<Marker[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const onMapReady = () => {
        setIsLoading(false);
        if (whenReady != null) whenReady();
    }

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

    // by default disallow area and sniffer creation
    const DEFAULT_CAN_CREATE_SNIFFER = false;
    const DEFAULT_CAN_CREATE_AREA = false;

    const POLYGON_PANE = "heatmap_pane";
    const POLYGONS_ZINDEX = 390;
    const AREA_NAME_PANE = "area_name_pane";
    const AREA_NAME_ZINDEX = 391;
    const DEVICES_PANE = "devices_pane";
    const DEVICES_SHADOW_ZINDEX = 404;
    const DEVICES_ZINDEX = 405;
    const DEVICES_SHADOW_PANE = "devices_shadow_pane";
    const zoom = 4;
    const mapRef = useCallback((node: HTMLDivElement | null) => {
        if (node !== null && map == null) {
            let newMap = new LeafletMap(node, {
                scrollWheelZoom: false, // avoid zoomming while scrolling on the page
                zoomControl: true,
                zoomSnap: zoomSnap
            });

            // Runs when the map gets initialized with a view (center and zoom) and at least one layer
            newMap = newMap.whenReady(onMapReady);

            if (mapUrl) {
                const tileLayer = new TileLayer(mapUrl)
                newMap = newMap.addLayer(tileLayer);
            }

            newMap = newMap.addLayer(editableLayer);
            const polygonOptions: Leaflet.DrawOptions.PolygonOptions = {
                showArea: false,
                metric: true,
                showLength: true,
                precision: {
                    m: 2,
                    ft: 1,
                    km: 1,
                },
                factor: 0.00001,
                allowIntersection: false, // disallow intersection of the polygon with itself. It is not to avoid intersections with other polygons
                zIndexOffset: POLYGONS_ZINDEX,
                shapeOptions: {
                    stroke: true,
                    color: '#dcdee2',
                    weight: 2,
                    opacity: 0.5,
                    fill: true,
                    fillColor: "#f1f3f4",
                    fillOpacity: 1,
                    clickable: true
                },
                icon: new Leaflet.DivIcon({
                    iconSize: new Leaflet.Point(10, 10),
                    className: 'leaflet-div-icon leaflet-editing-icon'
                }),
            };
            const markerOptions: Leaflet.DrawOptions.MarkerOptions = {
                zIndexOffset: DEVICES_ZINDEX,
                icon: deviceMarkerIcon
            }

            if (editable?.areas) setAreasLayer(editableLayer);
            else newMap = newMap.addLayer(areasLayer);
            newMap = newMap.addLayer(devicesLayer);

            if (editable?.areas || editable?.devices) {
                const drawControl = new Leaflet.Control.Draw({
                    position: "topleft",
                    draw: {
                        polygon: editable.areas ? polygonOptions:DEFAULT_CAN_CREATE_AREA,
                        circle: false,
                        marker: DEFAULT_CAN_CREATE_SNIFFER, //editable.devices && ? markerOptions:false,
                        polyline: false,
                        rectangle: false,
                        circlemarker: false
                    },
                    edit: {
                        featureGroup: editableLayer,
                        remove: onDeleteAreas && true
                    }
                });

                // Set the title to show on the polygon button, marker button and editing button
                Leaflet.drawLocal.draw.toolbar.buttons.polygon = BUTTON_TITLE_CREATE_AREA;
                Leaflet.drawLocal.draw.toolbar.buttons.marker = BUTTON_TITLE_CREATE_SNIFFER;

                let button_title_edit = BUTTON_TITLE_EDIT_AREA;
                if (editable.areas && editable.devices) button_title_edit = BUTTON_TITLE_EDIT_AREA_AND_SNIFFER;
                else if (!editable.areas && editable.devices) button_title_edit = BUTTON_TITLE_EDIT_SNIFFER;
                Leaflet.drawLocal.edit.toolbar.buttons.edit = button_title_edit;

                let button_title_remove = BUTTON_TITLE_REMOVE_AREA;
                if (editable.areas && editable.devices) button_title_remove = BUTTON_TITLE_REMOVE_AREA_AND_SNIFFER;
                else if (!editable.areas && editable.devices) button_title_remove = BUTTON_TITLE_REMOVE_SNIFFER;
                Leaflet.drawLocal.edit.toolbar.buttons.remove = button_title_remove;

                newMap = newMap.addControl(drawControl);
            }

            if (center != null && zoom != null) {
                newMap = newMap.setView(new LatLng(center[0], center[1]), 18);
            }

            newMap.createPane(POLYGON_PANE).style.zIndex = POLYGONS_ZINDEX.toString(); // polygon is below everything
            newMap.createPane(AREA_NAME_PANE).style.zIndex = AREA_NAME_ZINDEX.toString(); // area name is on top of polygon
            // heatmap goes here. It has zIndex 400
            newMap.createPane(DEVICES_SHADOW_PANE).style.zIndex = DEVICES_SHADOW_ZINDEX.toString(); // on top of heatmap, behind device icon
            newMap.createPane(DEVICES_PANE).style.zIndex = DEVICES_ZINDEX.toString(); // on top of everything

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

    const addEditingEventListeners = (map: LeafletMap) => {
        let retMap = map.removeEventListener(Leaflet.Draw.Event.CREATED); // Ensure only one handler
        retMap = retMap.addEventListener(Leaflet.Draw.Event.CREATED, function (event) {
            // @ts-ignore
            const type = event.layerType, layer = event.layer;

            if (type === 'marker') { // Do marker specific actions
                const marker = layer as MarkerDevice;
                console.log('A sniffer was created!', event);
                const coordLatLng = marker.getLatLng();
                //if (onCreateDevices) onCreateDevices([[coordLatLng.lng, coordLatLng.lat]]);
                editableLayer.addLayer(marker);
            } else if (type === 'polygon') {
                const poly = layer as Polygon;
                console.log('An area was created!', event);
                poly.bindTooltip("New area",{
                    permanent: true,
                    direction: "center",
                    className: "leaflet-area-tooltip"
                }).openTooltip();
                const coords = getPolygonXYCoords(poly);
                const polyArea = new PolygonArea(poly.getLatLngs(), poly.options, {
                    id: -1,
                    name: "New area",
                    description: "A new area",
                    location: coords
                });
                if (onCreateAreas && coords.length > 0) onCreateAreas([coords]);
                areasLayer.addLayer(polyArea);
            }
        });

        retMap = retMap.removeEventListener(Leaflet.Draw.Event.DELETED); // Ensure only one handler
        retMap = retMap.addEventListener(Leaflet.Draw.Event.DELETED, function (event) {
            // @ts-ignore
            let layers = event.layers; // deleted layers

            const deletedAreas: Area[] = [];
            // @ts-ignore
            layers.eachLayer(function(layer) {
                if (layer instanceof PolygonArea) {
                    deletedAreas.push(layer.area);
                }
            });
            if (deletedAreas.length == 0) console.log('Nothing was deleted!');
            else console.log('Something was deleted!');

            if (onDeleteAreas && deletedAreas.length > 0) onDeleteAreas(deletedAreas);
        })

        // Move the name of the area to the center of polygon when editing a vertex
        retMap = retMap.removeEventListener(Leaflet.Draw.Event.EDITVERTEX); // Ensure only one handler
        retMap = retMap.addEventListener(Leaflet.Draw.Event.EDITVERTEX, function (event) {
            // @ts-ignore
            const poly = event.poly as PolygonArea;
            console.log(poly.area.name)
            poly.closeTooltip();
            poly.openTooltip();
        });

        // handle edited event
        retMap = retMap.removeEventListener(Leaflet.Draw.Event.EDITED); // Ensure only one handler
        retMap = retMap.addEventListener(Leaflet.Draw.Event.EDITED, function (event) {
            // @ts-ignore
            let layers = event.layers; // edited layers

            const editedAreas: EditedArea[] = [];
            const editedDevices: EditedDevice[] = [];

            // @ts-ignore
            layers.eachLayer(function(layer) {
                if (layer instanceof PolygonArea) {
                    console.log('A polygon was edited!');
                    layer.closeTooltip();
                    layer.openTooltip();
                    const coords = getPolygonXYCoords(layer);
                    editedAreas.push({
                        area: layer.area,
                        newLocation: coords
                    });
                } else if (layer instanceof MarkerDevice) {
                    console.log('A device was edited!');
                    const coords = layer.getLatLng();
                    editedDevices.push({
                        device: layer.device,
                        newLocationX: coords.lng,
                        newLocationY: coords.lat,
                    });
                }
            });
            if (editedAreas.length == 0 && editedDevices.length == 0) console.log('Nothing was edited!');

            if (onEditAreas && editedAreas.length > 0) onEditAreas(editedAreas);
            if (onEditDevices && editedDevices.length > 0) onEditDevices(editedDevices);
        });

        return retMap;
    }

    const buildAreas = (map: LeafletMap, areas: Area[]): LeafletMap => {
        let retMap = map;

        areas.forEach(area => {
            const pointsLatLng = area.location.map(coord => xy(coord[0], coord[1]));

            const poly = new PolygonArea(pointsLatLng, {
                // polygon options
                color: "#dcdee2",
                fillColor: "#f1f3f4",
                fillOpacity: 1,
                weight: 2,
                pane: POLYGON_PANE,
            }, area);
            poly.bindTooltip(area.name,{
                permanent: true,
                direction: "center",
                className: "leaflet-area-tooltip",
                pane: AREA_NAME_PANE
            }).openTooltip();

            areasLayer.addLayer(poly);
        });

        return retMap;
    }

    const computeAreasBounds = (areas: Area[]): LatLngBounds => {
        const bounds = new LatLngBounds([[0,0], [0,0]])

        if (!areas) return bounds;

        areas.forEach(area => {
            area.location.forEach(loc => {
                const latlngs = xy(loc[0], loc[1]);
                bounds.extend(latlngs);
            });
        })
        return bounds;
    }

    const boundsGap = 0.05;
    useEffect(() => {
        areasLayer.eachLayer(layer => {
            if (layer instanceof PolygonArea) {
                layer.remove();
            }
        });

        if (areas && map) {
            let newMap = map;
            newMap = buildAreas(newMap, areas);
            newMap = addEditingEventListeners(newMap);

            if (fitAreasBounds) {
                if (areas.length > 0) {
                    const newBounds = computeAreasBounds(areas);
                    newMap = newMap.setView(newBounds.getCenter(), map.getZoom()).fitBounds(newBounds.pad(boundsGap));
                } else {
                    newMap = newMap.setView(xy(0, 0), zoom);
                }
            }

            setMap(newMap);
        }
    }, [areas, map]);

    const addMarkerDevice = (map: LeafletMap, device: Device, icon: Icon, iconYSize: number, destLayer: FeatureGroup): LeafletMap => {
        const deviceLoc = device.x && device.y ? xy(device.x, device.y):map.getCenter();
        const markerLayer = new MarkerDevice(deviceLoc, {
            icon: icon,
            title: device.name,
            pane: DEVICES_PANE,
            shadowPane: DEVICES_SHADOW_PANE,
        }, device);
        const markerPopup = buildDeviceMarkerPopup(device);
        markerLayer.bindPopup(renderToString(markerPopup), { // some options for the bind popup
            offset: new Point(0, -iconYSize / 4),
            minWidth: 80,
        });
        destLayer.addLayer(markerLayer);

        return map;
    }

    // Add non editable devices
    useEffect(() => {
        if (devices && map) {
            devicesLayer.eachLayer((layer) => layer.remove());

            let mapObj = map;
            devices.forEach((d: Device) => {
                mapObj = addMarkerDevice(mapObj, d, deviceMarkerIcon, iconSize[1], devicesLayer);
            });

            setMap(mapObj);
        }
    }, [devices, map]);

    // Add editable devices
    useEffect(() => {
        if (editableDevices && map) {
            editableLayer.eachLayer((layer) => {
                if (layer instanceof MarkerDevice) {
                    layer.remove();
                }
            });

            let mapObj = map;
            editableDevices.forEach((editableDev: Device) => {
                console.log("Add editable sniffer");
                mapObj = addMarkerDevice(mapObj, editableDev, deviceMarkerIcon, iconSize[1], editableLayer);
            });

            mapObj = addEditingEventListeners(mapObj);
            setMap(mapObj);
        }
    }, [editableDevices, map]);

    useEffect(() => {
        if (map) {
            const newMap = addEditingEventListeners(map);
            setMap(newMap);
        }
    }, [onCreateAreas, onDeleteAreas, onEditAreas, onEditDevices]);

    const interestPointMarkerIcon = new Icon({
        iconSize: iconSize, // size of the icon
        iconAnchor: [iconSize[0]/2, iconSize[1]], // point of the icon which will correspond to marker's location
        iconUrl: '/assets/images/point_of_interest.png',
        shadowUrl: '/assets/images/device_icon_shadow.png',
        shadowSize: shadowSize, // size of the shadow
        shadowAnchor: [shadowSize[0], shadowSize[1]/2],  // point of the icon which will correspond to shadow's location
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
        if (map && pointOfInterest) {
            pointsMarkers.forEach((marker) => marker.remove());
            setPointsMarkers([]);
            let mapObj = map;
            pointOfInterest?.forEach((p: PointOfInterest) => {
                mapObj = addMarkerInterestPoint(mapObj, p, interestPointMarkerIcon, iconSize[1]);
            });

            setMap(mapObj);
        }
    }, [pointOfInterest, map]);

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
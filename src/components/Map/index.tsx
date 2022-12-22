import {useCallback, useEffect, useState} from "react";

import {
    FeatureGroup,
    HeatMapOptions, Icon,
    LatLng, LatLngBounds, LatLngExpression,
    Map as LeafletMap, Marker, Point, PointExpression, Polygon, Polyline, PolylineOptions, Rectangle,
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
import {Typography} from "@mui/material";
import * as React from "react";
import CrowdPosition from "../../models/crowdposition";

const BUTTON_TITLE_CREATE_AREA = "Create areas";
const BUTTON_TITLE_EDIT_AREA = "Edit areas";
const BUTTON_TITLE_REMOVE_AREA = "Delete areas";

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

class PolygonArea extends Polygon {
    area: Area

    constructor(latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][], options: PolylineOptions, area: Area) {
        super(latlngs, options);
        this.area = area;
    }
}

export type EditedArea = {
    area: Area,
    newLocation: number[][]
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
    editable?: {
        devices?: boolean,
        areas?: boolean
    },
    onCreateAreas?: (points: number[][][]) => void,
    onCreateDevices?: (points: number[][]) => void,
    onEditAreas?: (editedAreas: EditedArea[]) => void,
    onDeleteAreas?: (areas: Area[]) => void,
    onEditDevices?: (points: number[][]) => void,
    onDeleteDevices?: (points: number[][]) => void,
}
export default function Map({ center, zoomSnap, height, whenReady, mapUrl, heatmapPoints, areas, fitAreasBounds, devices, editable, onCreateAreas, onCreateDevices, onEditAreas, onDeleteAreas, onEditDevices, onDeleteDevices }: MapPropType) {
    const [map, setMap] = useState<LeafletMap>();
    const [heatmapLayer, setHeatmapLayer] = useState<Leaflet.HeatLayer>();
    const [editableLayer, setEditableLayer] = useState<FeatureGroup>(new FeatureGroup());
    const [devicesMarkers, setDevicesMarkers] = useState<Marker[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const onMapReady = () => {
        setIsLoading(false);
        if (whenReady != null) whenReady();
    }

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

            newMap = newMap.addLayer(editableLayer);
            const polygonOptions: Leaflet.DrawOptions.PolygonOptions = {
                showArea: false,
                metric: true,
                showLength: true,
                precision: {
                    m: 2,
                    ft: 0,
                    km: 4,
                },
                factor: 0.001,
                allowIntersection: false, // disallow intersection of the polygon with itself. It is not to avoid intersections with other polygons
                zIndexOffset: 390,
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

            }
            if (editable?.areas || editable?.devices) {
                const drawControl = new Leaflet.Control.Draw({
                    position: "topleft",
                    draw: {
                        polygon: editable.areas ? polygonOptions:false,
                        circle: false,
                        marker: editable.devices ? markerOptions:false,
                        polyline: false,
                        rectangle: false,
                        circlemarker: false
                    },
                    edit: {
                        featureGroup: editableLayer,
                    }
                });
                // Set the title to show on the polygon button and editing button
                Leaflet.drawLocal.draw.toolbar.buttons.polygon = BUTTON_TITLE_CREATE_AREA;
                Leaflet.drawLocal.edit.toolbar.buttons.edit = BUTTON_TITLE_EDIT_AREA;
                Leaflet.drawLocal.edit.toolbar.buttons.remove = BUTTON_TITLE_REMOVE_AREA;
                newMap = newMap.addControl(drawControl);
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
                className: "leaflet-area-tooltip"
            }).openTooltip();
            console.log(poly.area);
            editableLayer.addLayer(poly);
        });

        retMap = retMap.removeEventListener(Leaflet.Draw.Event.CREATED); // Ensure only one handler
        retMap = retMap.addEventListener(Leaflet.Draw.Event.CREATED, function (event) {
            // @ts-ignore
            const type = event.layerType,
                layer = event.layer;
            console.log('Something was created!', event);

            if (type === 'marker') { // Do marker specific actions
                const marker = layer as Marker;
                const coordLatLng = marker.getLatLng();
                if (onCreateDevices) onCreateDevices([[coordLatLng.lng, coordLatLng.lat]]);
            } else if (type === 'polygon') {
                const poly = layer as PolygonArea;
                poly.bindTooltip("New area",{
                    permanent: true,
                    direction: "center",
                    className: "leaflet-area-tooltip"
                }).openTooltip();
                const coords = getPolygonXYCoords(poly);
                if (onCreateAreas && coords.length > 0) onCreateAreas([coords]);
            }
            editableLayer.addLayer(layer);
        });

        retMap = retMap.removeEventListener(Leaflet.Draw.Event.DELETED); // Ensure only one handler
        retMap = retMap.addEventListener(Leaflet.Draw.Event.DELETED, function (event) {
            // @ts-ignore
            let layers = event.layers; // deleted layers

            const deletedAreas: Area[] = [];
            // @ts-ignore
            layers.eachLayer(function(layer) {
                if (layer instanceof Rectangle ||
                    layer instanceof Polygon ||
                    layer instanceof Polyline) {
                    const poly = layer as PolygonArea;
                    deletedAreas.push(poly.area);
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

            const areasPoints: EditedArea[] = [];
            // @ts-ignore
            layers.eachLayer(function(layer) {
                if (layer instanceof Rectangle ||
                    layer instanceof Polygon ||
                    layer instanceof Polyline) {
                    const poly = layer as PolygonArea;
                    poly.closeTooltip();
                    poly.openTooltip();
                    const coords = getPolygonXYCoords(poly);
                    areasPoints.push({
                        area: poly.area,
                        newLocation: coords
                    });
                }
            });
            if (areasPoints.length == 0) console.log('Nothing was edited!');
            else console.log('Something was edited!');

            if (onEditAreas && areasPoints.length > 0) onEditAreas(areasPoints);
        });

        return retMap;
    }

    const computeAreasBounds = (areas: Area[]) => {
        let newBounds: number[] = [];
        if (areas && areas.length > 0) {
            // min x, min y, max x, max y
            newBounds = [areas[0].location[0][0], areas[0].location[0][1], areas[0].location[0][0], areas[0].location[0][1]];
            areas.forEach(area => {
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
            editableLayer.eachLayer(layer => layer.remove());

            let newMap = map;
            if (areas.length > 0) newMap = buildPolygons(newMap, areas);

            if (fitAreasBounds && areas.length > 0) {
                console.log("FITTING AREAS BOUNDS");
                // min x, min y, max x, max y
                const newBounds = computeAreasBounds(areas);

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

    useEffect(() => {
        if (devices && map) {
            devicesMarkers.forEach((marker) => marker.remove());
            setDevicesMarkers([]);

            let mapObj = map;
            devices?.forEach((d: Device) => {
                mapObj = addMarkerDevice(mapObj, d, deviceMarkerIcon, iconSize[1]);
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
import Building from "../../models/building";
import { FetchError, fetchJson } from "../index";
import Area from "../../models/area";
import Device from "../../models/device";
import CrowdPosition from "../../models/crowdposition";
import PointOfInterest from "../../models/pointOfInterest";
import {User} from "../../models/user";
import {response} from "express";

const ENDPOINT = process.env.DATA_MANAGER_HOST ? process.env.DATA_MANAGER_HOST:"http://localhost:10001";
const DATA_MANAGER_BUILDINGS_URL = ENDPOINT + "/api/buildings/pull";
const DATA_MANAGER_AREAS_URL = ENDPOINT + "/api/areas/pull";
const DATA_MANAGER_DEVICES_URL = ENDPOINT + "/api/sniffers/pull";
const DATA_MANAGER_SNIFFER_UPDATE_URL = ENDPOINT + "/api/sniffers/update";
const DATA_MANAGER_SNIFFER_CREATE_URL = ENDPOINT + "/api/sniffers/push";
const DATA_MANAGER_SNIFFER_DELETE_URL = ENDPOINT + "/api/sniffers/delete";
const DATA_MANAGER_POSITION_DETECTION_URL = ENDPOINT + "/api/position-detection/pull";
const DATA_MANAGER_POSITION_DETECTION_MAX_DATE_URL = ENDPOINT + "/api/position-detection/maxdate";
const DATA_MANAGER_CREATE_AREA_URL = ENDPOINT + "/api/areas/push/";
const DATA_MANAGER_DELETE_AREA_URL = ENDPOINT + "/api/areas/delete";
const DATA_MANAGER_UPDATE_AREA_URL = ENDPOINT + "/api/areas/update/";

const AI_URL = "http://localhost:10003/api/poi";



function buildings(userId: number): Promise<Building[]> {
    return fetchJson<Building[]>(`${DATA_MANAGER_BUILDINGS_URL}/${userId}`);
}

function areas(buildingId: string): Promise<Area[]> {
    return fetchJson<Area[]>(`${DATA_MANAGER_AREAS_URL}/${buildingId}`);
}

function devices(buildingId: string): Promise<Device[]> {
    return fetchJson<Device[]>(`${DATA_MANAGER_DEVICES_URL}/${buildingId}`);
}

function poi(buildingId: string, fromDate?: string, toDate?: string, k?: string): Promise<PointOfInterest[]> {
    return fetchJson<PointOfInterest[]>(`${AI_URL}/${buildingId}?k=${k}&start=${fromDate}&end=${toDate}`);
}

function crowdBehavior(buildingId: string, fromDate?: string, toDate?: string): Promise<CrowdPosition[]> {
    let url = `${DATA_MANAGER_POSITION_DETECTION_URL}/${buildingId}`;
    if (fromDate || toDate) url += "?";
    if (fromDate) url += `start=${fromDate}`;
    if (fromDate && toDate) url += `&`;
    if (toDate) url += `end=${toDate}`;

    return fetchJson<CrowdPosition[]>(url);
}

type MaxDateResponse = {
    maxDate: string
}
function maxDate(buildingId: string): Promise<Date> {
    return fetchJson<MaxDateResponse>(`${DATA_MANAGER_POSITION_DETECTION_MAX_DATE_URL}/${buildingId}`)
        .then(res => new Date(res.maxDate) );
}

function createArea(buildingId: string, location: number[][], name: string, description: string): Promise<any> {
    return fetch(`${DATA_MANAGER_CREATE_AREA_URL}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_building: buildingId,
            location: location,
            name: name,
            description: description
        }),
    });
}

function deleteArea(areaId: string): Promise<any> {
    return fetch(`${DATA_MANAGER_DELETE_AREA_URL}/${areaId}`, {
        method: "DELETE",
    });
}

function updateArea(buildingId: string, areaId: string, areaLocation: number[][], areaName: string, areaDescription: string): Promise<any> {
    return fetch(`${DATA_MANAGER_UPDATE_AREA_URL}/${areaId}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_building: buildingId,
            location: areaLocation,
            name: areaName,
            description: areaDescription
        }),
    });
}

function modifySniffer(idSniffer: string, id_building:string, name: string, xPosition: string, yPosition: string){
    const body = {
        'name':name,
        'id_building':id_building,
        'x':xPosition,
        'y':yPosition
    }
    console.log(body)
    return fetchJson<any>(`${DATA_MANAGER_SNIFFER_UPDATE_URL}/${idSniffer}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(response => console.log(response));
}

function createSniffer(id_building:string,idZerynt:string, name: string, xPosition: string, yPosition: string){
    const body = {
        name,
        id_building,
        "id_zerynth": idZerynt,
        'x':xPosition,
        'y':yPosition
    }
    return fetchJson<any>(`${DATA_MANAGER_SNIFFER_CREATE_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(response => console.log(response));

}

function deleteSniffer(idSniffer:string){

    return fetchJson(`${DATA_MANAGER_SNIFFER_DELETE_URL}/${idSniffer}`, {
        method: 'DELETE',
    });
}

const DataManagerAPI = {
    buildings,
    areas,
    devices,
    crowdBehavior,
    maxDate,
    createArea,
    deleteArea,
    updateArea,
    poi,
    modifySniffer,
    createSniffer,
    deleteSniffer
};

export default DataManagerAPI;
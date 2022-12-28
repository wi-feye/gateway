import Building from "../models/building";
import Area from "../models/area";
import { User } from "../models/user";
import useSWR from "swr";
import {useEffect} from "react";
import Router from "next/router";
import Device from "../models/device";
import Attendance from "../models/attendance";
import CrowdBehavior from "../models/crowdbehavior";
import PointOfInterest from "../models/pointOfInterest";
import ZerynthDevice from "../models/zerynth_device";
import TmpCode from "../models/tmpcode";
import UserTelegram from "../models/user_telegram";
import ZerynthBuilding from "../models/zerynth_building";
import {Time} from "@mui/x-date-pickers/internals/components/icons";
import {DateTime} from "asn1js";
import PredictedAttendance from "../models/predictedAttendance";

const REST_API_AUTH_USER_URL = "/api/auth/user";
const REST_API_GET_BUILDINGS_URL = "/api/building/list";
const REST_API_GET_AREAS_URL = "/api/area/list";
const REST_API_POST_CREATE_AREAS_URL = "/api/area/create";
const REST_API_DELETE_AREAS_URL = "/api/area/delete";
const REST_API_POST_UPDATE_AREAS_URL = "/api/area/update";
const REST_API_GET_DEVICES_URL = "/api/device/list";
const REST_API_GET_IDZER_URL = "/api/device/zerynth_devices";
const REST_API_GET_IDZER_BUI_URL = "/api/building/zerynth_buildings";
const REST_API_GET_CROWDBEHAVIOR_URL = "/api/crowdbehavior";
const REST_API_GET_MAXDATE_URL = "/api/crowdbehavior/maxdate";
const REST_API_GET_POINTINTEREST_URL = "/api/poi/list";
const REST_API_GET_ATTENDANCE_URL = "/api/attendance";
const REST_API_GET_ATTENDANCE_PERHOUR_URL = "/api/attendance/perhour";
const REST_API_GET_PREDICTED_ATTENDANCE_URL = "/api/predictions/attendance";
const REST_API_AUTH_LOGIN_URL = "/api/auth/login";
const REST_API_AUTH_LOGOUT_URL = "/api/auth/logout";

const REST_API_MODIFY_SNIFFER_URL = "/api/device/modify";
const REST_API_DELETE_SNIFFER_URL = "/api/device/delete";
const REST_API_CREATE_SNIFFER_URL = "/api/device/create";

const REST_API_CREATE_BUILDING_URL = "/api/building/create";
const REST_API_MODIFY_BUILDING_URL = "/api/building/modify";
const REST_API_DELETE_BUILDING_URL = "/api/building/delete";

const REST_API_GENTMPCODE = "/api/settings/tmpcode";
const REST_API_UT_GET = "/api/settings/user_telegram_get";
const REST_API_UT_DEL = "/api/settings/user_telegram_del";
const REST_API_UT_TOGGLE = "/api/settings/user_telegram_toggle";

export class FetchError extends Error {
    response: Response
    data: {
        message: string
    }
    constructor({
                    message,
                    response,
                    data,
                }: {
        message: string
        response: Response
        data: {
            message: string
        }
    }) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError)
        }

        this.name = 'FetchError'
        this.response = response
        this.data = data ?? { message: message }
    }
}

export async function fetchJson<JSON = unknown>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON> {
    const response = await fetch(input, init)

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json()

    // response.ok is true when res.status is 2xx
    // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
    if (response.ok) {
        return data
    }

    throw new FetchError({
        message: response.statusText,
        response,
        data,
    })
}

export async function authLogin(email: string, password: string): Promise<User> {
    const body = {
        email,
        password
    }
    return fetchJson(REST_API_AUTH_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export async function authLogout(): Promise<User> {
    return fetchJson(REST_API_AUTH_LOGOUT_URL);
}

export function useUser({
    redirectTo = '',
    redirectIfFound = false,
} = {}) {
    const { data: user, mutate: mutateUser, error } = useSWR<User>(REST_API_AUTH_USER_URL)

    useEffect(() => {
        const isLoading = !error && !user;
        if (isLoading) console.log("Fetching user info...");
        // if no redirect needed, just return (example: already on /dashboard)
        // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
        if (!redirectTo || !user) return

        if (
            // If redirectTo is set, redirect if the user was not found.
            (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
            // If redirectIfFound is also set, redirect if the user was found
            (redirectIfFound && user?.isLoggedIn)
        ) {
            Router.push(redirectTo)
        }
    }, [user, redirectIfFound, redirectTo])

    return { user, mutateUser }
}

export function useBuildings(user?: User): { buildings: Building[] | undefined, isLoading: boolean, isError: any } {
    //const { user } = useUser({ });
    const { data, error } = useSWR<Building[]>(
        user?.isLoggedIn ? REST_API_GET_BUILDINGS_URL : null,
        fetchJson
    );
    /*
    const defaultOptions = {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };
    */
    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching buildings...");

    return {
        buildings: data,
        isLoading,
        isError: error
    }
}

export function useAreas(buildingId: number | undefined, validOnly: boolean = true) {
    const { data, error, mutate } = useSWR<Area[]>(
        buildingId ? `${REST_API_GET_AREAS_URL}?buildingId=${buildingId}&validOnly=${validOnly}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching areas...");
    return {
        areas: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useDevices(buildingId: number | undefined) {
    const { data, error, mutate } = useSWR<Device[]>(
        buildingId ? `${REST_API_GET_DEVICES_URL}?buildingId=${buildingId}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching devices...");
    return {
        devices: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useZerynthDevices(buildingId: number | undefined) {
    const { data, error, mutate } = useSWR<ZerynthDevice[]>(
        buildingId ? `${REST_API_GET_IDZER_URL}?buildingId=${buildingId}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching id ...");
    return {
        zerynthDevices: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useZerynthBuildings() {
    const { data, error, mutate } = useSWR<ZerynthBuilding[]>(
        `${REST_API_GET_IDZER_BUI_URL}`,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching id ...");
    return {
        zerynthBuildings: data,
        isLoading,
        isError: error,
        mutate
    }
}

export function useAttendance(buildingId: number | undefined, from?: Date, to?: Date) {
    const fromTimestamp = from ? from.toISOString():"";
    const toTimestamp = to ? to.toISOString():"";
    const { data, error } = useSWR<Attendance[]>(
        buildingId ? `${REST_API_GET_ATTENDANCE_URL}?buildingId=${buildingId}&from=${fromTimestamp}&to=${toTimestamp}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching attendance...");
    return {
        attendance: data,
        isLoading,
        isError: error
    }
}

export function useAttendancePerHour(buildingId: number | undefined, from?: Date, to?: Date) {
    const fromTimestamp = from ? from.toISOString():"";
    const toTimestamp = to ? to.toISOString():"";
    const { data, error } = useSWR<Attendance[]>(
        buildingId ? `${REST_API_GET_ATTENDANCE_PERHOUR_URL}?buildingId=${buildingId}&from=${fromTimestamp}&to=${toTimestamp}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching attendance...");
    return {
        attendancePerHour: data,
        isLoading,
        isError: error
    }
}

export function usePredictedAttendance(buildingId: number | undefined, from?: Date) {
    const fromTimestamp = from ? from.toISOString():"";
    const { data, error } = useSWR<PredictedAttendance[]>(
        buildingId ? `${REST_API_GET_PREDICTED_ATTENDANCE_URL}?buildingId=${buildingId}&from=${fromTimestamp}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching predicted attendance...");
    return {
        predictedAttendance: data,
        isLoading,
        isError: error
    }
}

export function useCrowdBehavior(buildingId: number | undefined, from: Date, to: Date, minutesGap: number | undefined = 1) {
    const fromTimestamp = from.toISOString();
    const toTimestamp = to.toISOString();
    const { data, error } = useSWR<CrowdBehavior[]>(
        buildingId ? `${REST_API_GET_CROWDBEHAVIOR_URL}?buildingId=${buildingId}&from=${fromTimestamp}&to=${toTimestamp}&minutesGap=${minutesGap}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching position data...");
    return {
        crowdBehavior: data,
        isLoading,
        isError: error
    }
}

export function usePointOfInterest(buildingId: number, from: Date, to: Date, kPoint: number) {
    const fromTimestamp = from.toISOString();
    const toTimestamp = to.toISOString();
    const { data, error } = useSWR<PointOfInterest[]>(
        buildingId ? `${REST_API_GET_POINTINTEREST_URL}?buildingId=${buildingId}&k=${kPoint}&start=${fromTimestamp}&end=${toTimestamp}`:null,
        fetchJson
    );
    console.log(data)

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching point of interest...");
    return {
        pointOfInterest: data,
        isLoading,
        isError: error
    }
}

type MaxDateResponse = {
    maxDate: string
}
export function useMaxDate(buildingId: number | undefined) {
    const { data, error } = useSWR<Date>(
        buildingId ? `${REST_API_GET_MAXDATE_URL}?buildingId=${buildingId}`:null,
        (url) => fetchJson<MaxDateResponse>(url).then(r => new Date(r.maxDate))
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching max date...");
    return {
        maxDate: data,
        isLoading,
        isError: error
    }
}

export function createArea(buildingId: number, location: number[][]) {
    return fetch(`${REST_API_POST_CREATE_AREAS_URL}?buildingId=${buildingId}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            location: location
        }),
    })
}

export function deleteArea(buildingId: number, area: Area) {
    return fetch(`${REST_API_DELETE_AREAS_URL}?buildingId=${buildingId}&areaId=${area.id}`, {
        method: "DELETE",
    })
}

export function updateArea(buildingId: number, areaId: number, areaName: string, areaDescr: string, areaLocation: number[][]) {
    return fetch(`${REST_API_POST_UPDATE_AREAS_URL}?buildingId=${buildingId}&areaId=${areaId}`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: areaName,
            description: areaDescr,
            location: areaLocation
        }),
    })
}

export async function modifySniffer(idSniffer: string,id_building: string, name: string, xPosition: string, yPosition: string) {
    return fetch(REST_API_MODIFY_SNIFFER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idSniffer,
            id_building,
            name,
            xPosition,
            yPosition,
        }),
    });
}

export async function deleteSniffer(idSniffer: string) {
    return fetch(`${REST_API_DELETE_SNIFFER_URL}?idSniffer=${idSniffer}`, {
        method: 'DELETE',
    });
}

export async function createSniffer(id_building: string,idZerynt:string, name: string, xPosition: string, yPosition: string) {
    return fetch(REST_API_CREATE_SNIFFER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_building,
            idZerynt,
            name,
            xPosition,
            yPosition,
        }),
    });
}

export async function createBuilding(name: string, id_zerynth: string, open_time: string, close_time: string) {
    console.log(id_zerynth)
    return fetch(REST_API_CREATE_BUILDING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            id_zerynth,
            open_time,
            close_time
        }),
    });
}
export async function modifyBuilding(idBuilding:string, name: string, id_zerynth: string, open_time: string, close_time: string) {
    return fetch(REST_API_MODIFY_BUILDING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idBuilding,
            name,
            id_zerynth,
            open_time,
            close_time
        }),
    });
}

export async function deleteBuilding(idBuilding: string) {
    return fetch(`${REST_API_DELETE_BUILDING_URL}?idBuilding=${idBuilding}`, {
        method: 'DELETE',
    });
}

export async function genTmpCode() {
    const res = fetch(REST_API_GENTMPCODE, {
        method: 'POST',
    });
    return (await (await res).json()) as TmpCode;
}

export async function userTelegramGet() {
    const res = fetch(REST_API_UT_GET);
    return (await (await res).json()) as UserTelegram;
}

export async function userTelegramDel() {
    return fetch(REST_API_UT_DEL, {
        method: 'DELETE',
    });
}

export async function userTelegramToggle() {
    return fetch(REST_API_UT_TOGGLE, {
        method: 'POST',
    });
}
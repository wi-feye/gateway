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

const REST_API_AUTH_USER_URL = "/api/auth/user";
const REST_API_GET_BUILDINGS_URL = "/api/building/list";
const REST_API_GET_AREAS_URL = "/api/area/list";
const REST_API_GET_DEVICES_URL = "/api/device/list";
const REST_API_GET_CROWDBEHAVIOR_URL = "/api/crowdbehavior";
const REST_API_GET_MAXDATE_URL = "/api/crowdbehavior/maxdate";
const REST_API_GET_POINTINTEREST_URL = "/api/poi/list";
const REST_API_GET_ATTENDANCE_URL = "/api/attendance";
const REST_API_GET_ATTENDANCE_PERHOUR_URL = "/api/attendance/perhour";
const REST_API_AUTH_LOGIN_URL = "/api/auth/login";
const REST_API_AUTH_LOGOUT_URL = "/api/auth/logout";

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
    const { data, error } = useSWR<Area[]>(
        buildingId ? `${REST_API_GET_AREAS_URL}?buildingId=${buildingId}&validOnly=${validOnly}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching areas...");
    return {
        areas: data,
        isLoading,
        isError: error
    }
}

export function useDevices(buildingId: number | undefined) {
    const { data, error } = useSWR<Device[]>(
        buildingId ? `${REST_API_GET_DEVICES_URL}?buildingId=${buildingId}`:null,
        fetchJson
    );

    const isLoading = !error && !data;
    if (isLoading) console.log("Fetching devices...");
    return {
        devices: data,
        isLoading,
        isError: error
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

/*export function useApi<FunArgsType extends any[], ReturnType>(apiFunc: (...args: FunArgsType) => Promise<ReturnType>):
    { data: ReturnType | undefined, error: string, loading: boolean, request: (...args: FunArgsType) => Promise<void>}
{
    const [data, setData] = useState<ReturnType>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const request = async (...argsList: FunArgsType) => {
        setLoading(true);
        try {
            const dataResponse = await apiFunc(...argsList);
            setData(dataResponse);
        } catch (error) {
            setError(error instanceof FetchError ? error.data.message:"Unexpected error: "+error);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        error,
        loading,
        request
    };
}*/
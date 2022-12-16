
import ZerynthBuilding from "../../models/zerynth_building";
import ZerynthDevice from "../../models/zerynth_device";
import { fetchJson } from "../index";

const ENDPOINT = 'https://api.zdm.zerynth.com/v3/';

function zerynthCall<T>(apikey_zerynth: string, uri: string): Promise<T> {
    return fetchJson<T>(`${ENDPOINT}${uri}`, { headers: { "X-API-KEY": apikey_zerynth } });
}

async function zerynthBuildings(apikey_zerynth: string): Promise<ZerynthBuilding[]> {
    return (await (zerynthCall<any>(apikey_zerynth, 'workspaces'))).workspaces as ZerynthBuilding[];
}

async function zerynthDevices(apikey_zerynth: string, idz_building: string): Promise<ZerynthDevice[]> {
    return (await zerynthCall<any>(apikey_zerynth, `workspaces/${idz_building}/devices`)).devices as ZerynthDevice[];
}

const ZerynthAPI = {
    zerynthBuildings,
    zerynthDevices,
};

export default ZerynthAPI;

import ZerynthBuilding from "../../models/zerynth_building";
import ZerynthDevice from "../../models/zerynth_device";
import ZerynthUser from "../../models/zerynth_user";
import { fetchJson } from "../index";

const ENDPOINT_AUTH = 'https://api.login.zerynth.com/v1/';
const ENDPOINT_ZDM = 'https://api.zdm.zerynth.com/v3/';

function zerynthCall<T>(apikey_zerynth: string, url: string): Promise<T> {
    return fetchJson<T>(`${url}`, { headers: { "X-API-KEY": apikey_zerynth } });
}

async function zerynthUser(apikey_zerynth: string): Promise<ZerynthUser> {
    return zerynthCall<ZerynthUser>(apikey_zerynth, `${ENDPOINT_AUTH}auth/profile`);
}

async function zerynthBuildings(apikey_zerynth: string): Promise<ZerynthBuilding[]> {
    return (await (zerynthCall<any>(apikey_zerynth, `${ENDPOINT_ZDM}workspaces`))).workspaces as ZerynthBuilding[];
}

async function zerynthDevices(apikey_zerynth: string, idz_building: string): Promise<ZerynthDevice[]> {
    return (await zerynthCall<any>(apikey_zerynth, `${ENDPOINT_ZDM}workspaces/${idz_building}/devices`)).devices as ZerynthDevice[];
}

const ZerynthAPI = {
    zerynthUser,
    zerynthBuildings,
    zerynthDevices,
};

export default ZerynthAPI;
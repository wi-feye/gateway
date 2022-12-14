import {User} from "../../models/user";
import {fetchJson} from "../index";

const ENDPOINT = process.env.USER_MANAGER_HOST ? process.env.USER_MANAGER_HOST:"http://localhost:10002";
const USER_MANAGER_LOGIN_URL = ENDPOINT + "/login";
const USER_MANAGER_SIGNIN_URL = ENDPOINT + "/register";
const USER_MANAGER_USER_URL = ENDPOINT + "/user";

type UserManagerLoginResponse = {
    user: User
}
function login(email: string, password: string): Promise<User> {
    const body = {
        email,
        password
    }
    return fetchJson<UserManagerLoginResponse>(USER_MANAGER_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(response => response.user);
}

function register(email: string, password: string, name: string, surname: string, apikey_zerynth: string): Promise<User> {
    const body = { email, password, name, surname,apikey_zerynth}

    return fetchJson<UserManagerLoginResponse>(USER_MANAGER_SIGNIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(response => response.user);
}

function user(userId: number): Promise<User> {
    return fetchJson<User>(`${USER_MANAGER_USER_URL}?id=${userId}`);
}

const UserManagerAPI = {
    login,
    user,
    register
};

export default UserManagerAPI;
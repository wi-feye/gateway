export type ZerynthDevice = {
    id: string,    // id_zerynth
    name: string,
    is_connected: boolean,
    last_connected_at: string,
    last_disconnected_at: string,
    last_ip_address: string
}

export default ZerynthDevice;
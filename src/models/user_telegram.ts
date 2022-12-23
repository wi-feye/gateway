export type UserTelegram = {
    chatid: number | undefined,
    enabled: boolean,
    gencode_timestamp: string | undefined,
    id_user: number,
    tmpcode: number | undefined
}

export default UserTelegram;
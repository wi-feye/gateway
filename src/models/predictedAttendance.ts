export type PredictedAttendance = {
    id_area: string,
    minutesGap: number,
    from: string,
    count: number[],
}

export default PredictedAttendance;
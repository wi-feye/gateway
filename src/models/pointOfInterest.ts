export type PointOfInterest = {
    id: number,
    idArea: number,
    time: Date,
    pointOfInterest: [{ x:number,y:number }]
}

export default PointOfInterest;
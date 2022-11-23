import CrowdPosition from "./crowdposition";

export type CrowdBehavior = {
    from: string,
    to: string,
    data: CrowdPosition[]
}

export default CrowdBehavior;
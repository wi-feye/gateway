import CrowdBehavior from "../../models/crowdbehavior";
import CrowdPosition from "../../models/crowdposition";

function splitByDuration(positions: CrowdPosition[], durationMinutes: number): CrowdBehavior[] {
    const sortedByTime = positions.sort(function(x, y) {
        return x.timestamp < y.timestamp ? -1:1;
    })

    if (sortedByTime.length == 0) {
        return [];
    }
    const result: CrowdBehavior[] = [];

    let startTime = new Date(sortedByTime[0].timestamp); // start from the oldest one
    startTime.setSeconds(0);
    startTime.setMinutes(0);
    let endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + durationMinutes);
    //endTime.setSeconds(59);

    let current: CrowdBehavior = {
        from: startTime.toISOString(),
        to: endTime.toISOString(),
        data: []
    };
    result.push(current);

    sortedByTime.forEach((pos) => {
        const posDate = new Date(pos.timestamp);
        if (posDate > endTime) {
            // start becomes end + 1 minute
            startTime = new Date(endTime);
            startTime.setMinutes(endTime.getMinutes());
            startTime.setSeconds(0);
            // end becomes new start + <minutesGap> minutes
            endTime = new Date(startTime);
            endTime.setMinutes(startTime.getMinutes() + durationMinutes);
            
            //endTime.setSeconds(59);
            //if (endTime > toDate) endTime = new Date(endTime);
            current = {
                from: startTime.toISOString(),
                to: endTime.toISOString(),
                data: [pos]
            }
            result.push(current);
            //console.log("--- FROM:", current.from, ", TO:", current.to, "---");
        } else {
            current.data.push(pos);
            //console.log(pos.timestamp);
        }
    });

    if (result.length == 1 && result[0].data.length == 0) {
        return [];
    }

    return result;
}

export {
    splitByDuration
}
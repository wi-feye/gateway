import { NextApiRequest, NextApiResponse } from 'next'
import DeviceInteroperabilityAPI from '../../../src/restapi/gateway/device_interoperability'

async function publishOnZerynth(req: NextApiRequest, res: NextApiResponse) {
    const body = await req.body;
    const publishResult = await DeviceInteroperabilityAPI.publish(body).then(r => r.json());
    res.send(publishResult);
}

export default publishOnZerynth;
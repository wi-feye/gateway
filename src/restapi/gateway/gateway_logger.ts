import {NextApiRequest} from "next";

export default function (req: NextApiRequest) {
    const header = `[${req.method} ${req.url}]`;
    const content = req.session?.user?.name && req.session?.user?.surname ? `[User ${req.session.user?.name} ${req.session.user?.surname}]`:"";

    console.log(header, content);
}
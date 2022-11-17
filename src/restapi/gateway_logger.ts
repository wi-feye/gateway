import {NextApiRequest} from "next";

export default function (req: NextApiRequest) {
    const header = `[${req.method} ${req.url}]`;
    const content = req.session?.user? `[User ${req.session.user?.login}]`:"";

    console.log(header, content);
}
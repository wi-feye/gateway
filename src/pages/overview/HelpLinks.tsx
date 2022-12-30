import { Box, Link } from "@mui/material";
import MainCard from "../../components/MainCard";

const helpLinks = [
    {name: "Domenico Tupputi", email: "d.tupputi@studenti.unipi.it"},
    {name: "Domenico Ferraro", email: "d.ferraro7@studenti.unipi.it"},
    {name: "Geremia Pompei", email: "g.pompei2@studenti.unipi.it"},
];

export default function HelpLinks() {
    return (
        <MainCard sx={{ mt: 2.5 }}>
            {helpLinks.map((item, index) => (
                <Box key={index}>
                    <Link href={`mailto:${item.email}?subject=Wifeye%20Help`}>{item.name}</Link>
                </Box>
            ))}
        </MainCard>
    );

}
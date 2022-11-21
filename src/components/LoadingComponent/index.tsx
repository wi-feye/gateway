import {CircularProgress} from "@mui/material";

export default function LoadingComponent({ size=40 }) {
    return (
        <div style={{
            position: "absolute",
            top: `calc(50% - ${size}px`,
            left: `calc(50% - ${size}px`,
            zIndex: 1000
        }}>
            <CircularProgress size={size}/>
        </div>
    );
}
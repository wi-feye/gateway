import {CircularProgress} from "@mui/material";

export default function LoadingComponent({ size=40 }) {
    return (
        <div className="loading-component">
            <CircularProgress size={size}/>
        </div>
    );
}
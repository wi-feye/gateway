import {ReactNode} from "react";

type NoDataComponentProps = {
    children?: ReactNode,
    minHeight?: string,
}
export default function NoDataComponent({ children, minHeight }: NoDataComponentProps) {
    return (
        <div className="not-enough-data-component" style={{ minHeight: minHeight?minHeight:"unset" }}>
            <div style={{ minHeight: minHeight?minHeight:"unset", maxHeight: minHeight?minHeight:"unset" }}>
                { children }
            </div>
        </div>
    );
}
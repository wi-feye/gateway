import {ReactNode} from "react";

type NoDataComponentProps = {
    children?: ReactNode,
    maxHeight?: string,
}
export default function NoDataComponent({ children, maxHeight }: NoDataComponentProps) {
    return (
        <div className="not-enough-data-component">
            <div style={{ maxHeight: maxHeight?maxHeight:"unset" }}>
                { children }
            </div>
        </div>
    );
}
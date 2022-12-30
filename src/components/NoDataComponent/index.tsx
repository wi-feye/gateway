import {ReactNode} from "react";

type NoDataComponentProps = {
    children?: ReactNode;
}
export default function NoDataComponent({ children }: NoDataComponentProps) {
    return (
        <div className="not-enough-data-component">
            { children }
        </div>
    );
}
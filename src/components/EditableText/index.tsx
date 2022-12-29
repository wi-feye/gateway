import {useState} from "react";
import * as React from "react";
import {IconButton, Typography} from "@mui/material";
import {CheckOutlined, CloseOutlined, EditFilled} from "@ant-design/icons";

type EditableTextProps = {
    content: string,
    onContentEdit: (newContent: string) => void,
}
function EditableText({ content, onContentEdit }:EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(content);

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onClickEditBtn = () => {
        setIsEditing(!isEditing);
    }
    const onClickConfirm = () => {
        if (!currentValue || currentValue.trim().length == 0) return;
        if (currentValue.trim() === content.trim()) return;

        onContentEdit(currentValue.trim());
        setIsEditing(!isEditing);
    }
    const onClickCancel = () => {
        setCurrentValue(content);
        setIsEditing(!isEditing);
    }

    if (isEditing) {
        return (
            <div style={{ display: "inline-flex" }}>
                <input
                    autoFocus
                    className="MuiTypography-root editable-text-field"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                />
                <Typography style={{ display: "none" }} />
                <IconButton color="success" aria-label="confirm editing" onClick={onClickConfirm} onMouseDown={handleMouseDown}>
                    <CheckOutlined />
                </IconButton>
                <IconButton color="error" aria-label="discard editing" onClick={onClickCancel} onMouseDown={handleMouseDown}>
                    <CloseOutlined />
                </IconButton>
            </div>
        );
    }

    return (
        <div style={{ display: "inline-flex", alignItems: "center" }}>
            {currentValue}
            <IconButton
                aria-label="edit content"
                onClick={onClickEditBtn}
                onMouseDown={handleMouseDown}
                edge="end"
            >
                <EditFilled />
            </IconButton>
        </div>
    );
}

export default EditableText;
import { useEditorEffect, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { FC, useState } from "react";
import { undoDepth } from 'prosemirror-history';
import { Button } from "@alxgrn/telefrag-ui";
import { TEditorSaver } from "../../../../types";

type Props = {
    onSave: TEditorSaver;
};

const SaveButton: FC<Props> = ({ onSave }) => {
    const [ disabled, setDisabled ] = useState(true);

    useEditorEffect((view) => {
        setDisabled(!undoDepth(view.state));
    });

    const onClick = useEditorEventCallback((view) => {
        try {
            const content = JSON.stringify(view.state.doc.toJSON());
            onSave({ content, format: 'prose' });
        } catch (error) {
            console.error(`Can not save doc: ${error}`);
        }
    });

    return (<Button type='Accent' disabled={disabled} label='Сохранить' size='Small' onClick={onClick}/>);
};

export default SaveButton;

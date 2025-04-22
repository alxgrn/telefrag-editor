/**
 * Просмотровщик публикации в формате prose
 */
import { FC, useEffect, useState } from 'react';
import { Node } from 'prosemirror-model';
import { schema } from './schema';
import { EditorState } from 'prosemirror-state';
import { fixTables } from 'prosemirror-tables';
import { ProseMirror, ProseMirrorDoc } from '@handlewithcare/react-prosemirror';
import './ProseViewer.css';

type ProseViewerProps = {
    content?: string;
};

const ProseViewer: FC<ProseViewerProps> = ({ content }) => {
    const [editorState, setEditorState] = useState<EditorState>();

    useEffect(() => {
        if (!content) return;
        try {
            const doc = Node.fromJSON(schema, JSON.parse(content));
            let state = EditorState.create({ doc });
            const fix = fixTables(state);
            if (fix) state = state.apply(fix.setMeta('addToHistory', false));
            setEditorState(state);
        } catch (error) {
            console.error(`Can not parse Prose format: ${error}`);
        }
    }, [ content ]);

    if (!editorState) return null;

    return (
        <ProseMirror state={editorState} className='ProseViewer'>
            <ProseMirrorDoc />
        </ProseMirror>
    );
};

export default ProseViewer;

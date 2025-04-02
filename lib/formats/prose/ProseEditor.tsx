import { FC, useEffect, useState } from "react";
import { EditorState } from "prosemirror-state";
import { schema } from './schema';
import { setup } from './setup';
import { ProseMirror, ProseMirrorDoc } from "@handlewithcare/react-prosemirror";
//import { TEditorSaver, TImageUploader } from "../../types";
import { Node } from "prosemirror-model";
import MenuBar from "./menubar/MenuBar";
import './ProseViewer.css';
import './ImageUpload.css';

type Props = {
    content: string | null; // Содержимое статьи
    //onView: () => void; // Вызывается при клике на кнопку просмотра статьи
    //onSave: TEditorSaver; // Вызывается при нажатии на кнопку сохранения статьи
    //onChange: (changed: boolean) => void; // Вызывается при изменении текста статьи
    //onUpload: TImageUploader; // Вызывается после выбора картинки для загрузки на сервер
};

const ProseEditor: FC<Props> = ({ content }) => {
    const [editorState, setEditorState] = useState<EditorState>();

    // Инициализация
    useEffect(() => {
        let doc: Node|undefined;
        if (content) {
            try {
                doc = Node.fromJSON(schema, JSON.parse(content));
            } catch (error) {
                console.error(`Can not parse Prose format: ${error}`);
            }
        }

        const state = EditorState.create({
            doc,
            schema: schema,
            plugins: setup({ schema, floatingMenu: true }),
        });

        setEditorState(state);
    }, [ content ]);    

    if (!editorState) return null;

    return (
        <div className='ProseEditor'>
            <ProseMirror
                state={editorState}
                dispatchTransaction={(tr) => setEditorState((s) => s?.apply(tr))}
            >
                <MenuBar schema={schema} />
                <ProseMirrorDoc />
            </ProseMirror>
        </div>
    );
};

export default ProseEditor;

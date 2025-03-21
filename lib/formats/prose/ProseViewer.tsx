/**
 * Просмотровщик публикации в формате prose
 */
import { FC, useEffect, useRef, useState } from 'react';
import { DOMSerializer, Node, Schema } from 'prosemirror-model';
import { addListNodes } from 'prosemirror-schema-list';
import { schema } from 'prosemirror-schema-basic';
import './ProseViewer.css';

type ProseViewerProps = {
    content: string;
};

const ProseViewer: FC<ProseViewerProps> = ({ content }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        try {
            setError(false);
            const mySchema = new Schema({
                nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
                marks: schema.spec.marks,
            });
            const doc = Node.fromJSON(mySchema, JSON.parse(content));
            const dom = DOMSerializer.fromSchema(mySchema).serializeFragment(doc.content);
            ref.current?.appendChild(dom);
        } catch (error) {
            setError(true);
            console.error(`Can not parse Prose format: ${error}`);
        }
    }, [ ref, content ]);

    return (<div ref={ref} className='ProseViewer'>
        {error && <div className='error'>ОШИБКА</div>}
    </div>);
};

export default ProseViewer;

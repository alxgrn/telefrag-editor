/**
 * Кастомное отображение картинки для реактора.
 * Необходимо для возможности изменения подписи.
 */
import { Prompt } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { forwardRef, useState } from "react";
import { API_URL } from "../../../config";


const ImageView = forwardRef<HTMLTableElement, NodeViewComponentProps>(
    function Table({ children, nodeProps, ...props }, outerRef) {
        const [ title, setTitle ] = useState(nodeProps.node.attrs.title + '');
        const [ isOpen, setIsOpen ] = useState(false);

        const onClick = useEditorEventCallback((view, title: string) => {
            if (!view) return;
            setTitle(title);
            // Используем механизм обхода всех нод в выделении
            // также как в присвоении выравнивания в текстовых блоках.
            // Но наверняка есть более правильный способ т.к. у нас в
            // выделении должна быть только одна нода с картинкой.
            const { $from, $to } = view.state.selection;
            const nodeRange = $from.blockRange($to);
            if (nodeRange) {
                const parent = view.state.doc;
                console.log(`start=${nodeRange.start}, end=${nodeRange.end}`)
                let tr = view.state.tr;
                parent.nodesBetween(nodeRange.start, nodeRange.end, (node, pos) => {
                    if (node.type.name === 'image') {
                        tr = tr.setNodeMarkup(pos, null, { ...nodeProps.node.attrs, title });
                    }
                });
                view.dispatch(tr);
            }
            view.focus();
            setIsOpen(false);
        });

        return (
            <div
                {...props}
                ref={outerRef}
                className='image'
                onClick={() => setIsOpen(true)}
                title={nodeProps.node.attrs.title}
            >
                <img
                    title={nodeProps.node.attrs.title}
                    //fid={nodeProps.node.attrs.fid}
                    alt={nodeProps.node.attrs.alt}
                    src={nodeProps.node.attrs.fid ? `${API_URL}/files/${nodeProps.node.attrs.fid}` : nodeProps.node.attrs.src}
                />
                <Prompt
                    isOpen={isOpen}
                    onCancel={() => setIsOpen(false)}
                    onSubmit={onClick}
                    title='Подпись'
                    value={title}
                />
            </div>
        );
    }
);

export default ImageView;

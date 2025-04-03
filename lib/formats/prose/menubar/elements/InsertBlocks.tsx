/**
 * Кнопки для вставки блоков
 */
import { FC, useEffect, useState } from 'react';
import MenuBlock from '../MenuBlock';
import { NodeType, Schema } from "prosemirror-model";
import { Icons } from '@alxgrn/telefrag-ui';
import { EditorState } from 'prosemirror-state';
import InsertImage from './InsertImage';
import InsertVideo from './InsertVideo';
import { TMenuItem } from '../MenuItem';

type Props = {
    schema: Schema;
};

export const InsertBlocks: FC<Props> = ({ schema }) => {
    const [ items, setItems ] = useState<TMenuItem[]>([]);
    const [ isImagePrompt, setIsImagePrompt ] = useState(false);
    const [ isVideoPrompt, setIsVideoPrompt ] = useState(false);

    // Определим какие кнопки нужны в меню
    useEffect(() => {
        const insert: TMenuItem[] = [];

        if (schema.nodes.image) {
            const node = schema.nodes.image;
            insert.push({
                icon: <Icons.Image/>,
                isDisabled: (state) => { return !canInsert(state, node) },
                command: () => { setIsImagePrompt(true); return true; },
            });
        }

        if (schema.nodes.video) {
            const node = schema.nodes.video;
            insert.push({
                icon: <Icons.Film/>,
                isDisabled: (state) => { return !canInsert(state, node) },
                command: () => { setIsVideoPrompt(true); return true; },
            });
        }

        if (schema.nodes.horizontal_rule) {
            const node = schema.nodes.horizontal_rule;
            insert.push({
                icon: <Icons.FlipVertical/>,
                isDisabled: (state) => { return !canInsert(state, node) },
                command: (state, dispatch) => {
                    if (dispatch) {
                        dispatch(state.tr.replaceSelectionWith(node.create()));
                        return true;
                    }
                    return false;
                },
            });
        }

        setItems(insert);
    }, [ schema ]);

    if (items.length < 1) return null;

    return (<>
        <MenuBlock items={items} />
        <InsertImage isOpen={isImagePrompt} schema={schema} onClose={() => setIsImagePrompt(false)} />
        <InsertVideo isOpen={isVideoPrompt} schema={schema} onClose={() => setIsVideoPrompt(false)} />
    </>);
};

/**
 * Ниже функции основаны на prosemirror-example-setup/src/menu.ts
 */
function canInsert(state: EditorState, nodeType: NodeType) {
    let $from = state.selection.$from;
    for (let d = $from.depth; d >= 0; d--) {
        let index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
    }
    return false;
};

export default InsertBlocks;

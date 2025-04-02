/**
 * Блок кнопок в меню
 */
import { FC, useEffect, useState } from 'react';
import MenuBlock from './MenuBlock';
import { NodeType, Schema } from "prosemirror-model";
import { joinUp, lift, selectParentNode } from "prosemirror-commands";
import { TMenuItem } from './MenuItem';
import { Icons } from '@alxgrn/telefrag-ui';
import { EditorState } from 'prosemirror-state';
import InsertImage from './elements/InsertImage';
import HeaderMenu from './elements/HeaderMenu';
import MakeBlockMenu from './elements/MakeBlockMenu';
import InlineMarks from './elements/InlineMarks';
import './MenuBar.css';
import UndoRedo from './elements/UndoRedo';
import WrapBlockMenu from './elements/WrapBlockMenu';

type Props = {
    schema: Schema;
};

export const MenuBar: FC<Props> = ({ schema }) => {
    const [ items, setItems ] = useState<TMenuItem[][]>([]);
    const [ isImagePrompt, setIsImagePrompt ] = useState(false);

    // Определим какие кнопки нужны в меню
    useEffect(() => {
        const items: TMenuItem[][] = [];

        // Вставка блоков
        const insert: TMenuItem[] = [];

        if (schema.nodes.image) {
            const node = schema.nodes.image;
            insert.push({
                icon: <Icons.Image/>,
                isDisabled: (state) => { return !canInsert(state, node) },
                command: () => { setIsImagePrompt(true); return true; },
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

        if (insert.length) items.push(insert);

        // Комманды для манипуляций блоками
        items.push([{
            icon: <Icons.JoinUp/>,
            command: joinUp,
        },{
            icon: <Icons.IndentDecrease/>,
            command: lift,
        },{
            icon: <Icons.SquareDashed/>,
            command: selectParentNode,
        }]);

        setItems(items);
    }, [ schema ]);

    return (<div className='MenuBar'>
        
        <div className='MenuBlock'>
            <HeaderMenu schema={schema}/>
            <MakeBlockMenu schema={schema}/>
        </div>

        <InlineMarks schema={schema}/>
        {items.map((item, index) => <MenuBlock key={index} items={item} />)}
        <WrapBlockMenu schema={schema}/>
        <UndoRedo/>
        <InsertImage isOpen={isImagePrompt} schema={schema} onClose={() => setIsImagePrompt(false)} />
    </div>);
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

export default MenuBar;

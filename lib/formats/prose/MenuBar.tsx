/**
 * Блок кнопок в меню
 */
import { FC, useEffect, useState } from 'react';
import MenuBlock from './MenuBlock';
import { MarkType, NodeType, Schema } from "prosemirror-model";
import { joinUp, lift, selectParentNode, toggleMark, wrapIn } from "prosemirror-commands";
import { undo, redo } from 'prosemirror-history';
import { TMenuItem } from './MenuItem';
import { Icons } from '@alxgrn/telefrag-ui';
import { EditorState } from 'prosemirror-state';
import { wrapInList } from 'prosemirror-schema-list';
import InsertImage from './InsertImage';
import InsertLink from './InsertLink';
import './MenuBar.css';

type Props = {
    schema: Schema;
};

export const MenuBar: FC<Props> = ({ schema }) => {
    const [ items, setItems ] = useState<TMenuItem[][]>([]);
    const [ isLinkPrompt, setIsLinkPrompt ] = useState(false);
    const [ isImagePrompt, setIsImagePrompt ] = useState(false);

    // Определим какие кнопки нужны в меню
    useEffect(() => {
        const items: TMenuItem[][] = [];

        // Атрибуты строковых элементов
        const inline: TMenuItem[] = [];

        if (schema.marks.strong) {
            const mark = schema.marks.strong;
            inline.push({
                icon: <Icons.Bold/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark as MarkType),
            });
        }

        if (schema.marks.em) {
            const mark = schema.marks.em;
            inline.push({
                icon: <Icons.Italic/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark as MarkType),
            });
        }

        if (schema.marks.underline) {
            const mark = schema.marks.underline;
            inline.push({
                icon: <Icons.Underline/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark as MarkType),
            });
        }

        if (schema.marks.strikethrough) {
            const mark = schema.marks.strikethrough;
            inline.push({
                icon: <Icons.Strikethrough/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark as MarkType),
            });
        }

        if (schema.marks.code) {
            const mark = schema.marks.code;
            inline.push({
                icon: <Icons.Code/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark as MarkType),
            });
        }        
        
        if (schema.marks.link) {
            const mark = schema.marks.link;
            inline.push({
                icon: <Icons.Link/>,
                isActive: (state) => markActive(state, mark),
                isDisabled: (state) => { return state.selection.empty },
                command: (state, dispatch, view) => {
                    if (markActive(state, mark)) {
                        toggleMark(mark)(state, dispatch);
                        view?.focus();
                    } else {
                        setIsLinkPrompt(true);
                    }
                    return true;
                },
            });
        }

        if (inline.length) items.push(inline);

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

        // Охватывающие блоки
        const wrap: TMenuItem[] = [];

        if (schema.nodes.bullet_list) {
            const node = schema.nodes.bullet_list;
            wrap.push({
                icon: <Icons.List/>,
                command: (s, d) => wrapInList(node)(s, d),
                isSelected: (s) => wrapInList(node)(s),
            });
        }
    
        if (schema.nodes.ordered_list) {
            const node = schema.nodes.ordered_list;
            wrap.push({
                icon: <Icons.ListOrdered/>,
                command: (s, d) => wrapInList(node)(s, d),
                isSelected: (s) => wrapInList(node)(s),
            });
        }
        
        if (schema.nodes.blockquote) {
            const node = schema.nodes.blockquote;
            wrap.push({
                icon: <Icons.Quote/>,
                command: (s, d) => wrapIn(node)(s, d),
                isSelected: (s) => wrapIn(node)(s),
            });
        }    

        if (wrap.length) items.push(wrap);

        // Комманды для манипуляций блоками
        items.push([{
            icon: <Icons.JoinUp/>,
            command: joinUp,
        },{
            icon: <Icons.Lift/>,
            command: lift,
        },{
            icon: <Icons.SquareDashed/>,
            command: selectParentNode,
        }]);

        // Undo, Redo
        items.push([{
            icon: <Icons.Undo/>,
            command: undo,
        },{
            icon: <Icons.Redo/>,
            command: redo,
        }]);

        setItems(items);
    }, [ schema ]);

    return (<div className='MenuBar'>
        {items.map((item, index) => <MenuBlock key={index} items={item} />)}
        <InsertLink isOpen={isLinkPrompt} schema={schema} onClose={() => setIsLinkPrompt(false)} />
        <InsertImage isOpen={isImagePrompt} schema={schema} onClose={() => setIsImagePrompt(false)} />
    </div>);
};

/**
 * Ниже функции основаны на prosemirror-example-setup/src/menu.ts
 */

function markActive(state: EditorState, type: MarkType) {
    let {from, $from, to, empty} = state.selection;
    if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
    else return state.doc.rangeHasMark(from, to, type);
};

function canInsert(state: EditorState, nodeType: NodeType) {
    let $from = state.selection.$from;
    for (let d = $from.depth; d >= 0; d--) {
        let index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
    }
    return false;
};

export default MenuBar;

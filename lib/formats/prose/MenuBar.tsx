/**
 * Блок кнопок в меню
 */
import { FC, useEffect, useState } from 'react';
import MenuBlock from './MenuBlock';
import { MarkType, Schema } from "prosemirror-model";
import { toggleMark, wrapIn } from "prosemirror-commands";
import { undo, redo } from 'prosemirror-history';
import { TMenuItem } from './MenuItem';
import { Icons } from '@alxgrn/telefrag-ui';
import { EditorState } from 'prosemirror-state';
import { wrapInList } from 'prosemirror-schema-list';
import './MenuBar.css';

type Props = {
    schema: Schema;
};

export const MenuBar: FC<Props> = ({ schema }) => {
    const [ items, setItems ] = useState<TMenuItem[][]>([]);

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
        
        if (inline.length) items.push(inline);

        // Охватывающие блоки
        const wrap: TMenuItem[] = [];

        if (schema.nodes.bullet_list) {
            const node = schema.nodes.bullet_list;
            wrap.push({
                icon: 'Bul',
                command: (s, d) => wrapInList(node)(s, d),
                isSelected: (s) => wrapInList(node)(s),
            });
        }
    
        if (schema.nodes.ordered_list) {
            const node = schema.nodes.ordered_list;
            wrap.push({
                icon: 'Ord',
                command: (s, d) => wrapInList(node)(s, d),
                isSelected: (s) => wrapInList(node)(s),
            });
        }
        
        if (schema.nodes.blockquote) {
            const node = schema.nodes.blockquote;
            wrap.push({
                icon: 'Qut',
                command: (s, d) => wrapIn(node)(s, d),
                isSelected: (s) => wrapIn(node)(s),
            });
        }    

        if (wrap.length) items.push(wrap);

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


export default MenuBar;

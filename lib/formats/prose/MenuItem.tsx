/**
 * Кнопка в меню
 */
import { FC, ReactNode, useState } from 'react';
import { Command, EditorState } from 'prosemirror-state';
import { useEditorEffect, useEditorEventCallback } from '@handlewithcare/react-prosemirror';
import './MenuItem.css';

export type TMenuItem = {
    icon: ReactNode;
    command: Command;
    isActive?: (s: EditorState) => boolean; // истановлен ли атрибут у строкового элемента
    isSelected?: (s: EditorState) => boolean; // выбран ли обрамляющий блок у ноды
};

type Props = {
    item: TMenuItem;
};

const MenuItem: FC<Props> = ({ item }) => {
    const [ active, setActive ] = useState<boolean|undefined>(true);
    const [ disabled, setDisabled ] = useState<boolean|undefined>(false);
    const [ selected, setSelected ] = useState<boolean|undefined>(false);

    useEditorEffect((view) => {
        if (!view) return;
        setActive(item.isActive && item.isActive(view.state));
        setSelected(item.isSelected && !item.isSelected(view.state));
        setDisabled(!item.command(view.state));
    });

    const onClick = useEditorEventCallback((view) => {
        if (!view) return;
        item.command(view.state, view.dispatch, view);
    });

    if (selected) return null;

    return (
        <div
            className={`MenuItem ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onClick();
            }}
        >
            {item.icon}
        </div>
    );
};

export default MenuItem;

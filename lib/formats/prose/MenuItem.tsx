/**
 * Кнопка в меню
 * https://discuss.prosemirror.net/t/using-with-react/904
 */
import { FC, ReactNode, useEffect, useState } from 'react';
import { EditorView } from 'prosemirror-view';
import { Command, EditorState } from 'prosemirror-state';
import './MenuItem.css';

export type TMenuItem = {
    icon: ReactNode;
    command: Command;
    isActive?: (s: EditorState) => boolean;
    isAllowed?: (s: EditorState) => boolean;
};

type Props = {
    item: TMenuItem;
    view: EditorView;
};

const MenuItem: FC<Props> = ({ item, view }) => {
    const [ active, setActive ] = useState<boolean|undefined>(true);
    const [ disabled, setDisabled ] = useState<boolean|undefined>(false);

    useEffect(() => {
        console.log('View update')
        setActive(item.isActive && item.isActive(view.state));
        setDisabled(item.isAllowed && !item.isAllowed(view.state));
    }, [ item, view.state ]);

    return (
        <div
            className={`MenuItem ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                item.command(view.state, view.dispatch, view);
            }}
        >
            {item.icon}
        </div>
    );
};

export default MenuItem;

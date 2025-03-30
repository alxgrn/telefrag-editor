/**
 * Блок кнопок в меню
 */
import { FC } from 'react';
import MenuItem, { TMenuItem } from './MenuItem';
import { EditorView } from 'prosemirror-view';
import './MenuBlock.css';

type Props = {
    items: TMenuItem[];
    view: EditorView;
};

const MenuBlock: FC<Props> = ({ items, view }) => (
    <div className='MenuBlock'>
        {items.map((item, index) => <MenuItem key={index} item={item} view={view}/>)}
    </div>
);

export default MenuBlock;

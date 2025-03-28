/**
 * Блок кнопок в меню
 */
import { FC, ReactNode } from 'react';
import MenuItem from './MenuItem';

export type TMenuItem = {
    icon: ReactNode;
    active?: boolean;
    visible?: boolean;
    disabled?: boolean;
};

type Props = {
    items: TMenuItem[];
}

const MenuBlock: FC<Props> = ({ items }) => (
    <div className='MenuBlock'>
        {items.map(item => <MenuItem active={item.active} visible={item.visible} disabled={item.disabled}>
            {item.icon}
        </MenuItem>)}
    </div>
);

export default MenuBlock;

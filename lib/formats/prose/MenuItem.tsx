/**
 * Кнопка в меню
 */
import { FC, PropsWithChildren } from 'react';

type Props = {
    active?: boolean;
    visible?: boolean;
    disabled?: boolean;
};

const MenuItem: FC<PropsWithChildren<Props>> = ({ active, visible, disabled, children }) => {
    if (!visible) return null;
    return (
        <span className={`${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}>
            {children}
        </span>
    );
};

export default MenuItem;

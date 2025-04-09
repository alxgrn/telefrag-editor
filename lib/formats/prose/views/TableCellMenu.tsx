/**
 * Контекстные меню ячейки таблицы
 */
import { Menu, MenuItem } from "@alxgrn/telefrag-ui";
import { useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { addColumnAfter, addColumnBefore, addRowAfter, addRowBefore, deleteColumn, deleteRow, mergeCells, splitCell, toggleHeaderCell, toggleHeaderColumn, toggleHeaderRow } from "prosemirror-tables";
import { FC } from "react";

// Контекстное меню ряда
const rowMenuItems: MenuItem[] = [{
    id: 'toggleHeaderRow',
    text: 'Toggle header row',
},{
    id: 'addRowBefore',
    text: 'Insert row before',
},{
    id: 'addRowAfter',
    text: 'Insert row after',
},{
    id: 'deleteRow',
    text: 'Delete row',
}];
// Контекстное меню столбца
const columnMenuItems: MenuItem[] = [{
    id: 'toggleHeaderColumn',
    text: 'Toggle header column',
},{
    id: 'addColumnBefore',
    text: 'Insert column before',
},{
    id: 'addColumnAfter',
    text: 'Insert column after',
},{
    id: 'deleteColumn',
    text: 'Delete column',
}];
// Контекстное меню ячейки
const cellMenuItems: MenuItem[] = [{
    id: 'mergeCells',
    text: 'Merge cells',
},{
    id: 'splitCell',
    text: 'Split cell',
},{
    id: 'toggleHeaderCell',
    text: 'Toggle header',
}];

type Props = {
    parent?: HTMLElement | null;
    isRowMenuOpen: boolean;
    isCellMenuOpen: boolean;
    isColumnMenuOpen: boolean;
    onRowMenuClose: () => void;
    onCellMenuClose: () => void;
    onColumnMenuClose: () => void;
};


const TableCellMenu: FC<Props> = ({ parent,
                                    isRowMenuOpen, isCellMenuOpen, isColumnMenuOpen,
                                    onRowMenuClose, onCellMenuClose, onColumnMenuClose }) => {
    const onMenuClick = useEditorEventCallback((view, item: MenuItem) => {
        if (!view) return;

        switch (item.id) {
            case 'toggleHeaderRow':
                toggleHeaderRow(view.state, view.dispatch);
                break;
            case 'addRowBefore':
                addRowBefore(view.state, view.dispatch);
                break;
            case 'addRowAfter':
                addRowAfter(view.state, view.dispatch);
                break;
            case 'deleteRow':
                deleteRow(view.state, view.dispatch);
                break;
            case 'toggleHeaderColumn':
                toggleHeaderColumn(view.state, view.dispatch);
                break;
            case 'addColumnBefore':
                addColumnBefore(view.state, view.dispatch);
                break;
            case 'addColumnAfter':
                addColumnAfter(view.state, view.dispatch);
                break;
            case 'deleteColumn':
                deleteColumn(view.state, view.dispatch);
                break;
            case 'mergeCells':
                mergeCells(view.state, view.dispatch);
                break;
            case 'splitCell':
                splitCell(view.state, view.dispatch);
                break;
            case 'toggleHeaderCell':
                toggleHeaderCell(view.state, view.dispatch);
                break;
            default:
                break;
        }

        onRowMenuClose();
        onCellMenuClose();
        onColumnMenuClose();
        view.focus();
    });

    if (!parent) return null;

    return (<>
        <Menu
            parent={parent}
            items={rowMenuItems}
            isOpen={isRowMenuOpen}
            onClose={onRowMenuClose}
            onClick={onMenuClick}
            vertical='top'
            horizontal='inner-left'
        />
        <Menu
            parent={parent}
            items={cellMenuItems}
            isOpen={isCellMenuOpen}
            onClose={onCellMenuClose}
            onClick={onMenuClick}
        />
        <Menu
            parent={parent}
            items={columnMenuItems}
            isOpen={isColumnMenuOpen}
            onClose={onColumnMenuClose}
            onClick={onMenuClick}
            vertical='top'
            horizontal='inner-left'
            margin='var(--alxgrn-unit)'
        />
    </>);
};

export default TableCellMenu;

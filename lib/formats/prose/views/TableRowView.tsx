import { Menu, MenuItem } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { addRowAfter, addRowBefore, deleteRow } from "prosemirror-tables";
import { forwardRef, useRef, useState } from "react";

const menuItems: MenuItem[] = [{
    id: 'before',
    text: 'Insert row before',
},{
    id: 'after',
    text: 'Insert row after',
},{
    id: 'delete',
    text: 'Delete row',
}];

const TableRowView = forwardRef<HTMLTableRowElement, NodeViewComponentProps>(
    function TableRow({ children, nodeProps, ...props }, outerRef) {
        const refTD = useRef<HTMLTableCellElement>(null);
        const [ isOpen, setIsOpen ] = useState(false);

        const onClick = useEditorEventCallback((view) => {
            view.dispatch(view.state.tr.deleteSelection());
            setIsOpen(true);
        });
/*
        const onContextMenu = (e: React.MouseEvent<HTMLTableRowElement>) => {
            e.preventDefault();
            setIsOpen(true);
            console.log("Right Row Click");
        };
*/
        const onMenuClick = useEditorEventCallback((view, item: MenuItem) => {
            if (!view) return;

            switch (item.id) {
                case 'before':
                    addRowBefore(view.state, view.dispatch);
                    break;
                case 'after':
                    addRowAfter(view.state, view.dispatch);
                    break;
                case 'delete':
                    deleteRow(view.state, view.dispatch);
                    break;
                default:
                    break;
            }

            setIsOpen(false);
            view.focus();
        });

        return (
            <tr {...props}
                ref={outerRef}
                onClick={onClick}
                //onContextMenu={onContextMenu}
            >
                <td ref={refTD} style={{ border: '1px dashed green', width: '1px' }}/>
                {refTD.current && <Menu
                    parent={refTD.current}
                    items={menuItems}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onClick={onMenuClick}
                    horizontal='right'
                />}
                {children}
            </tr>
        );
    }
);

export default TableRowView;

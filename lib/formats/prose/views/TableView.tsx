/**
 * Кастомное отображение таблицы для реактора.
 * Необходимо для размещения кнопки удаления таблицы в блоке thead.
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { deleteTable } from "prosemirror-tables";
import { forwardRef } from "react";
import './TableView.css';

const TableView = forwardRef<HTMLTableElement, NodeViewComponentProps>(
    function Table({ children, nodeProps, ...props }, outerRef) {

        const onClick = useEditorEventCallback((view) => {
            deleteTable(view.state, view.dispatch);
        });

        return (
            <table ref={outerRef} {...props}>
                <thead onClick={onClick}>
                    <tr><th><Icons.Trash/></th></tr>
                </thead>
                <tbody>
                    {children}
                </tbody>
            </table>
        );
    }
);

export default TableView;

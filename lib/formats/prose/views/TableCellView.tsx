import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { forwardRef } from "react";

const TableCellView = forwardRef<HTMLTableCellElement, NodeViewComponentProps>(
    function TableCell({ children, nodeProps, ...props }, outerRef) {

        const onClick = useEditorEventCallback((view) => {
            view.dispatch(view.state.tr.deleteSelection());
        });

        const onContextMenu = (e: React.MouseEvent<HTMLTableCellElement>) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Right Cell Click");
        };

        return (
            <td {...props}
                ref={outerRef}
                onClick={onClick}
                onContextMenu={onContextMenu}
                style={{ border: '1px dashed red' }}
            >
                {children}
            </td>
        );
    }
);

export default TableCellView;

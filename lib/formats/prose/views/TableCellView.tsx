/**
 * Кастомное отображение ячейки таблицы.
 * Нам необходимо отобразить плашки для вызова контекстных меню рядов и столбцов,
 * а также необходимо выводить контекстное меню ячейки.
 * Для плашек мы используем псеводоэлементы ::before и ::after у ячеек по краю таблицы.
 */
import { NodeViewComponentProps } from "@handlewithcare/react-prosemirror";
import { forwardRef, useEffect, useRef, useState } from "react";
import TableCellMenu from "./TableCellMenu";

const TableCellView = forwardRef<HTMLTableCellElement, NodeViewComponentProps>(
    function TableCell({ children, nodeProps, ...props }, outerRef) {
        const innerRef = useRef<HTMLTableCellElement>(null);
        const [ isRowMenuOpen, setIsRowMenuOpen ] = useState(false);
        const [ isCellMenuOpen, setIsCellMenuOpen ] = useState(false);
        const [ isColumnMenuOpen, setIsColumnMenuOpen ] = useState(false);

        // Закрываем свое контекстное меню при вызове контекстного меню вне себя
        useEffect(() => {
            const handler = (e: globalThis.MouseEvent) => {
                if(innerRef.current !== e.target) {
                    setIsRowMenuOpen(false);
                    setIsCellMenuOpen(false);
                    setIsColumnMenuOpen(false);
                }
            };

            document.addEventListener('contextmenu', handler, true);
            return () => document.removeEventListener('contextmenu', handler, true);
        }, []);

        // Показываем контекстное
        const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsRowMenuOpen(false);
            setIsCellMenuOpen(false);
            setIsColumnMenuOpen(false);
            const rect = e.currentTarget.getBoundingClientRect();
            if (e.clientY < rect.y) {
                setIsColumnMenuOpen(true);
            } else if (e.clientX < rect.x) {
                setIsRowMenuOpen(true);
            } else {
                setIsCellMenuOpen(true);
            }
        };

        // Если надо отобразить загловок выводим тег TH...
        if (nodeProps.node.type.spec.tableRole === 'header_cell') return (
            <th {...props}
                colSpan={nodeProps.node.attrs.colspan}
                rowSpan={nodeProps.node.attrs.rowspan}
                style={{
                    textAlign: nodeProps.node.attrs.halign,
                    verticalAlign: nodeProps.node.attrs.valign,
                }}
                onContextMenu={onContextMenu}
                ref={(el) => {
                    innerRef.current = el;
                    if (!outerRef) {
                        return;
                    }
                    if (typeof outerRef === "function") {
                        outerRef(el);
                    } else {
                        outerRef.current = el;
                    }
                }}
            >
                {children}
                <TableCellMenu
                    parent={innerRef.current}
                    isRowMenuOpen={isRowMenuOpen}
                    onRowMenuClose={() => setIsRowMenuOpen(false)}
                    isCellMenuOpen={isCellMenuOpen}
                    onCellMenuClose={() => setIsCellMenuOpen(false)}
                    isColumnMenuOpen={isColumnMenuOpen}
                    onColumnMenuClose={() => setIsColumnMenuOpen(false)}
                />
            </th>
        );

        // ...в противном случае выводим тег TD
        return (
            <td {...props}
                colSpan={nodeProps.node.attrs.colspan}
                rowSpan={nodeProps.node.attrs.rowspan}
                style={{
                    textAlign: nodeProps.node.attrs.halign,
                    verticalAlign: nodeProps.node.attrs.valign,
                }}
                onContextMenu={onContextMenu}
                ref={(el) => {
                    innerRef.current = el;
                    if (!outerRef) {
                        return;
                    }
                    if (typeof outerRef === "function") {
                        outerRef(el);
                    } else {
                        outerRef.current = el;
                    }
                }}
            >
                {children}
                <TableCellMenu
                    parent={innerRef.current}
                    isRowMenuOpen={isRowMenuOpen}
                    onRowMenuClose={() => setIsRowMenuOpen(false)}
                    isCellMenuOpen={isCellMenuOpen}
                    onCellMenuClose={() => setIsCellMenuOpen(false)}
                    isColumnMenuOpen={isColumnMenuOpen}
                    onColumnMenuClose={() => setIsColumnMenuOpen(false)}
                />
            </td>
        );
    }
);

export default TableCellView;

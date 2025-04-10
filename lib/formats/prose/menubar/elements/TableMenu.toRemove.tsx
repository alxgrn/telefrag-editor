/**
 * Меню действий с таблицей
 */
import { Icons, Menu } from "@alxgrn/telefrag-ui";
import { MenuItem as UIMenuItem } from "@alxgrn/telefrag-ui/dist/components/ui/menu/Menu";
import { useEditorEffect, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { Command, EditorState, TextSelection, Transaction } from "prosemirror-state";
import { FC, useEffect, useRef, useState } from "react";
import { addColumnAfter, addColumnBefore, addRowAfter, addRowBefore, deleteColumn, deleteRow, deleteTable, isInTable, mergeCells, splitCell, toggleHeaderCell, toggleHeaderColumn, toggleHeaderRow } from "prosemirror-tables";
import MenuItem, { TMenuItem } from "../MenuItem";
import { Fragment, Node, Schema } from "prosemirror-model";
import { canInsert } from "./InsertBlocks";

type Props = {
    schema: Schema;
};

const TableMenu: FC<Props> = ({ schema }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ createTable, setCreateTable ] = useState<TMenuItem>();
    const [ items, setItems ] = useState<UIMenuItem[]>([]);
    const [ commands, setCommands ] = useState<Command[]>([]);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ inTable, setInTable ] = useState(false);

    useEffect(() => {
        const node = schema.nodes.table;
        if (node) {
            setCreateTable({
                icon: <Icons.Table/>,
                isDisabled: (state) => { return !canInsert(state, node) },
                command: insertTable(),
            });
        }

        const items: UIMenuItem[] = [];
        const commands: Command[] = [];

        const item = (id: number, text?: string, command?: Command) => {
            if (text && command) {
                commands[id] = command;
                items[id] = { id, text};
            } else {
                items[id] = { separator: true }
            }
        };

        item( 1, 'Insert column before', addColumnBefore),
        item( 2, 'Insert column after', addColumnAfter),
        item( 3, 'Delete column', deleteColumn),
        item( 4 );
        item( 5, 'Insert row before', addRowBefore),
        item( 6, 'Insert row after', addRowAfter),
        item( 7, 'Delete row', deleteRow),
        item( 8 );
        item( 9, 'Merge cells', mergeCells),
        item(10, 'Split cell', splitCell),
        item(11)
        item(12, 'Toggle header column', toggleHeaderColumn),
        item(13, 'Toggle header row', toggleHeaderRow),
        item(14, 'Toggle header cells', toggleHeaderCell),
        item(15);
        item(16, 'Delete table', deleteTable),

        setItems(items);
        setCommands(commands);
    }, []);

    useEditorEffect((view) => {
        if (!view) return;
        setInTable(isInTable(view.state));
    });

    const onClick = useEditorEventCallback((view, item: UIMenuItem) => {
            if (!view || !item.id) return;
            const command = commands[item.id as number];
            if (command) command(view.state, view.dispatch, view);
            setIsOpen(false);
            view.focus();
    });

    if (!createTable || !commands.length) return null;

    if (!inTable) return (
        <div className='MenuBlock'>
            <MenuItem item={createTable}/>
        </div>);

    return (
    <div className='MenuBlock'>
        <div
            ref={ref}
            className='MenuItem'
            onClick={() => setIsOpen(true)}
        >
            <Icons.Table/><Icons.ChevronRight/>
        </div>

        {ref.current && <Menu
            parent={ref.current}
            items={items}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onClick={onClick}
            horizontal='inner-left'
        />}
    </div>);
};
/**
 * Вставка таблицы.
 * Оригинал функции вставки таблицы тут:
 * https://discuss.prosemirror.net/t/how-co-create-table/3510/3
 */
function insertTable(): Command {
    return (
        state: EditorState,
        dispatch?: (tr: Transaction) => void
    ): boolean => {
        const offset: number = state.tr.selection.anchor + 1;
        const transaction: Transaction = state.tr;
        const cell: Node = state.schema.nodes.table_cell.createAndFill() as Node;
        const node: Node = state.schema.nodes.table.create(
            null,
            Fragment.fromArray([
                state.schema.nodes.table_row.create(
                    null,
                    Fragment.fromArray([cell, cell, cell])
                ),
                state.schema.nodes.table_row.create(
                    null,
                    Fragment.fromArray([cell, cell, cell])
                )
            ])
        );

        if (dispatch) {
            dispatch(
                transaction
                    .replaceSelectionWith(node)
                    .scrollIntoView()
                    .setSelection(
                        TextSelection.near(
                            transaction.doc.resolve(offset)
                        )
                    )
            );
        }

        return true;
    };
};

export default TableMenu;

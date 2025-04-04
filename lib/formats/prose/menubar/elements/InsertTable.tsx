/**
 * Вставка таблицы.
 * Оригинал функции вставки таблицы тут:
 * https://discuss.prosemirror.net/t/how-co-create-table/3510/3
 */

import { Fragment, Node } from "prosemirror-model";
import { Command, EditorState, TextSelection, Transaction } from "prosemirror-state";

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

export default insertTable;

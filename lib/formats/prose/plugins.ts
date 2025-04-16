/**
 * Настройка плагинов для редактора.
 * За основу взят оригинал из пакета prosemirror-example-setup
 */
import { keymap } from "prosemirror-keymap";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { Schema } from "prosemirror-model";
import { buildKeymap, buildInputRules } from "prosemirror-example-setup";
import { placeholderPlugin } from "./ImageUpload";
import { goToNextCell, tableEditing } from "prosemirror-tables";

export const plugins = (schema: Schema) => {
    let plugins = [
        //columnResizing({ lastColumnResizable: false }),
        tableEditing(),
        keymap({
            Tab: goToNextCell(1),
            'Shift-Tab': goToNextCell(-1),
        }),
        buildInputRules(schema),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        history(),
        placeholderPlugin,
    ];

    return plugins;
};

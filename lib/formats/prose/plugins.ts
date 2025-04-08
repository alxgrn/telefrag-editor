/**
 * Настройка плагинов для редактора.
 * За основу взят оригинал из пакета prosemirror-example-setup
 */
import { keymap } from "prosemirror-keymap";
import { history } from "prosemirror-history";
import { baseKeymap } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { menuBar, MenuElement } from "prosemirror-menu";
import { Schema } from "prosemirror-model";
import { buildKeymap, buildInputRules } from "prosemirror-example-setup";
import { buildMenuItems } from './menu';
import { placeholderPlugin } from "./ImageUpload";
import { goToNextCell, tableEditing } from "prosemirror-tables";

type SetupOptions = {
    /// The schema to generate key bindings and menu items for.
    schema: Schema;
    /// Can be used to [adjust](#example-setup.buildKeymap) the key bindings created.
    mapKeys?: { [key: string]: string | false };
    /// Set to false to disable the menu bar.
    menuBar?: boolean;
    /// Set to false to disable the history plugin.
    history?: boolean;
    /// Set to false to make the menu bar non-floating.
    floatingMenu?: boolean;
    /// Can be used to override the menu content.
    menuContent?: MenuElement[][];
};

export const plugins = (options: SetupOptions) => {
    let plugins = [
        //columnResizing({ lastColumnResizable: false }),
        tableEditing(),
        keymap({
            Tab: goToNextCell(1),
            'Shift-Tab': goToNextCell(-1),
        }),
        buildInputRules(options.schema),
        keymap(buildKeymap(options.schema, options.mapKeys)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        placeholderPlugin,
    ];

    if (options.menuBar !== false) {
        plugins.push(menuBar({
            floating: options.floatingMenu !== false,
            content: options.menuContent || buildMenuItems(options.schema).fullMenu,
        }));
    }

    if (options.history !== false) {
        plugins.push(history());
    }

    return plugins;

    //return plugins.concat(new Plugin({
    //    props: {
    //        attributes: {class: "ProseMirror-example-setup-style"},
    //    }
    //}));
};

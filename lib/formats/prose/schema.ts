/**
 * Наша схема документа
 */
import { Schema, NodeSpec, MarkSpec } from "prosemirror-model";
import { addListNodes } from 'prosemirror-schema-list';
import { schema as baseSchema } from 'prosemirror-schema-basic';
import { tableNodes } from "prosemirror-tables";

// Добавим в базовую схему свой узел картинок, видео и таблицы
const nodes = baseSchema.spec.nodes.remove('image').append({
    /// Переделали инлайн в блок т.к. нам не нужны инлайн картинки.
    image: {
        attrs: {
            src: { validate: "string" },
            alt: { default: null, validate: "string|null" },
            title: { default: null, validate: "string|null" },
        },
        group: "block",
        draggable: true,
        parseDOM: [{tag: "img[src]", getAttrs(dom: HTMLElement) {
            return {
                src: dom.getAttribute("src"),
                alt: dom.getAttribute("alt"),
                title: dom.getAttribute("title"),
            }
        }}],
        toDOM(node) {
            const { src, alt, title } = node.attrs;
            return ["div", { title, class: "image" }, [ "img", { src, alt, title }]];
        }
    } as NodeSpec,
    /// Блок видео полность наш, сделан на основе image
    video: {
        attrs: {
            src: { validate: "string" },
            title: { default: null, validate: "string|null" },
        },
        group: "block",
        draggable: true,
        parseDOM: [{tag: "iframe[src]", getAttrs(dom: HTMLElement) {
            return {
                src: dom.getAttribute("src"),
                title: dom.getAttribute("title"),
            }
        }}],
        toDOM(node) {
            const { src, title } = node.attrs;
            const allow = 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            return ["div", { title, class: "video" }, [ "iframe", { src, title, allow }]];
        }
    } as NodeSpec,
// Добавляем таблицы
}).append(
    tableNodes({
        tableGroup: 'block',
        cellContent: 'block+',
        cellAttributes: {
            halign: {
                default: null,
                getFromDOM(dom) {
                    const halign = dom.getAttribute('align') || null;
                    if (halign === 'left' || halign === 'right' || halign === 'center') return halign;
                    return null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                    attrs.style = (attrs.style || '') + `text-align: ${value};`;
                },
            },
            valign: {
                default: null,
                getFromDOM(dom) {
                    const valign = dom.style.verticalAlign || null;
                    if (valign === 'top' || valign === 'bottom' || valign === 'middle') return valign;
                    return null;
                },
                setDOMAttr(value, attrs) {
                    if (value)
                    attrs.style = (attrs.style || '') + `vertical-align: ${value};`;
                },
            },
        },
    }),
);

// Добавим подчеркивание и зачеркивание
const marks = baseSchema.spec.marks.append({
    /// Подчеркнутый текст. Рендериится как `<u>`.
    underline: {
        parseDOM: [
            {tag: "u"},
            {style: "font-style=underline"},
        ],
        toDOM() { return ["u", 0] }
    } as MarkSpec,

    /// Зачеркнутый текст. Рендериится как `<s>`.
    strikethrough: {
        parseDOM: [
            {tag: "s"},
            {style: "font-style=strike"},
            {style: "font-style=strikethrough"},
        ],
        toDOM() { return ["s", 0] }
    } as MarkSpec,
});

// Соорудили свою простую схему
const simpleSchema = new Schema({ nodes, marks });

// Добавим в неё списки
export const schema = new Schema({
    nodes: addListNodes(simpleSchema.spec.nodes, "paragraph block*", "block"),
    marks: simpleSchema.spec.marks,
});

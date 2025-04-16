/**
 * Наша схема документа
 */
import { Schema, NodeSpec, MarkSpec, Node, DOMSerializer, DOMParser } from "prosemirror-model";
import { addListNodes } from 'prosemirror-schema-list';
import { schema as baseSchema } from 'prosemirror-schema-basic';
import { tableNodes } from "prosemirror-tables";

// Добавим в базовую схему свой узел картинок и видео
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
});

// Добавим подчеркивание и зачеркивание в инлайн-метки
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
export const simpleSchema = new Schema({
    nodes: nodes.remove('horizontal_rule').remove('heading'),
    marks,
});

// Добавим в базовые узлы таблицы
const nodesWithTables = nodes.append(tableNodes({
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
}));

// Сделаем схему с таблицами и списками
export const schema = new Schema({
    nodes: addListNodes(nodesWithTables, "paragraph block*", "block"),
    marks,
});

/**
 * Заменяет в документе все узлы, которых нет в простой схеме, на параграфы.
 * По сути мы имитируем cut-and-paste HTML-документа в редактор, у которого
 * в качестве схемы используется simpleSchema. Сам документ формируем из сериализованного
 * контента сохраненного в БД.
 * @param content сериализованный в строку контент документа, null или undefined.
 * @returns документ, который содержит только узлы из простой схемы или undefined.
 */
export const toSimpleSchema = (content?: string|null): Node | undefined => {
    if (!content) return;
    try {
        const doc = Node.fromJSON(schema, JSON.parse(content));
        const dom = DOMSerializer.fromSchema(schema).serializeFragment(doc.content);
        return DOMParser.fromSchema(simpleSchema).parse(dom);
    } catch (error) {
        console.error(`Can not convert content to simple schema: ${error}`);
    }
};

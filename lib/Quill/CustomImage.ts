/**
 * Мы расширяем класс картинки для того чтобы в него попали новые атрибуты
 * и делаем картинки блочными элементами (не хотим картинки в строках).
 * Весь класс скопирован из исходника Quill 1.3.7, но наследует от блочного эмбед.
 * В качестве value картинки мы отдаем не строку URL (как в оригинале),
 * а объект CustomImageType. Это нужно для удобства удаления неиспользуемых
 * картинок на сервере.
 */
import { API_URL, ERROR_IMAGE, ERROR_IMAGE_DATA } from '../config';
import Quill, { Parchment } from 'quill';
const BlockEmbed = Quill.import('blots/block/embed') as typeof Parchment.EmbedBlot;
/*
const ATTRIBUTES = [
  'fid', // добавили от себя для сохранения id картинки в базе
  'src', // отсутствует в оригинале т.к. храниится как значение самого элемента
];
*/
export type CustomImageType = {
    src?: string | null;
    fid?: string | null;
}

class CustomImage extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'IMG';
    
    static create(value: string | number | CustomImageType) {
        const node = super.create() as HTMLImageElement;
        if (typeof value === 'number') {
            // value содержит идентификатор картинки на нашем сервере
            node.setAttribute('fid', `${value}`);
            node.setAttribute('src', `${API_URL}/files/${value}`);
        } else if (typeof value === 'string') {
            // value содержит URL картинки
            node.setAttribute('src', this.sanitize(value));
        } else {
            // value содержит объект CustomImageType
            if (value.fid) {
                node.setAttribute('fid', `${value.fid}`);
                node.setAttribute('src', `${API_URL}/files/${value.fid}`);
            } else if (value.src) {
                node.setAttribute('src', this.sanitize(value.src));
            } else {
                node.setAttribute('src', `${ERROR_IMAGE}`);
            }
        }

        //console.info('CustomImage: create');
        //console.info('fid=', node.getAttribute('fid'));
        //console.info('src=', node.getAttribute('src'));
        
        return node;
    }

    // Если я верно понял, этот метод вызывается при cut-and-paste
    // html-документа в редактор. Он вытаскивает из html атрибуты
    // тега картинки и оставляет только те, что мы разрешаем.
    /*
    static formats(domNode: HTMLElement) {
        const attr = ATTRIBUTES.reduce(function(formats: any, attribute) {
            if (domNode.hasAttribute(attribute)) {
                formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
        }, {});

        console.info('CustomImage: formats');
        console.dir(attr);
        return attr;
    }
    */
    // Не понятно кем и когда вызывается данный метод
    // Выглядит как проверка того что ссылка ведет к картинке поэтому
    // могла бы вызываться из sanitize, но нет
    /*
    static match(url: string) {
        console.info('CustomImage: match');
        return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
    }
    */
    // Проверяет протокол на валидность
    // В оригинальном коде идет вызов внешней функции, мы ее перетащили прямо сюда.
    // Сама функция немного стремная, но пусть остается такой.
    static sanitize(url: string) {
        console.info('CustomImage: sanitize');
        // В оригинале можно вставлять картинки закодированные через data
        // мы этот способ запрещаем т.к. не хотим хранить картинки прямо в документе
        // const protocols = ['http', 'https', 'data'];
        const protocols = ['http', 'https'];
        const anchor = document.createElement('a');
        anchor.href = url;
        const protocol = anchor.href.slice(0, anchor.href.indexOf(':'));
        // const error_image = '//:0';
        return protocols.indexOf(protocol) > -1 ? url : ERROR_IMAGE_DATA;
    }

    // В качестве "значения" элемента выступает наш кастомный объект картинки
    // В оригинале значением является строка URL исходника картинки
    static value(domNode: HTMLElement): CustomImageType {
        return {
            src: domNode.getAttribute('src'),
            fid: domNode.getAttribute('fid'),
        }
    }

    // По идее для эмбед элементов данный метод не нужен т.к.
    // эмбед элементы не редактируются. Но может я чего-то не понимаю.
    /*
    format(name: string, value: string | null) {
        console.info('CustomImage: format');

        if (ATTRIBUTES.indexOf(name) > -1) {
            if (value) {
                (this.domNode as HTMLElement).setAttribute(name, value);
            } else {
                (this.domNode as HTMLElement).removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
    */
}

export default CustomImage;

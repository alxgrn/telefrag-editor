/**
 * Заменяем стандартный класс видео на собственный
 * т.к. нам нужна поддержка отечественных сервисов
 * За основу взят класс из исходников Quill 1.3.7
 */
import Quill, { Parchment } from 'quill';
import { sanitizeVideoURL } from '../utils/link';
import { ERROR_EMBED_DATA } from '../config';
const BlockEmbed = Quill.import('blots/block/embed') as typeof Parchment.EmbedBlot;
/*
// Мы не используем высоту и ширину в верстке, но оставим эти атрибуты просто чтобы не ломать логику класса
const ATTRIBUTES = [
    'height',
    'width'
];
*/
// Если пытаемся вставить некорректную ссылку, будем вместо нее выводить этот документ
const SRCDOC = `<!DOCTYPE html><img src="${ERROR_EMBED_DATA}" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; max-width: 100%; max-height: 100%; border-radius: .25rem"/>`;

class CustomVideo extends BlockEmbed {
    static blotName = 'video';
    //static className = 'ql-video';
    static tagName = 'IFRAME';

    static create(value: string) {
        const src = this.sanitize(value);
        const node = super.create(value) as HTMLElement;
        node.setAttribute('frameborder', '0');
        // node.setAttribute('allowfullscreen', true); это устаревшее свойство
        if (src) {
            node.setAttribute('src', src);
            node.setAttribute('allow', 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        } else {
            node.setAttribute('srcdoc', SRCDOC);
        }
        return node;
    }

    // Этот метод мы целиком переписали под свои нужды
    // Он преобразовывает полученный URL в формат пригодный для embed
    static sanitize = (stringURL: string) => {
        return sanitizeVideoURL(stringURL);
    }
    
    static value(domNode: HTMLElement) {
        return domNode.getAttribute('src');
    }
/*
    format(name: string, value: string | null) {
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

    static formats(domNode: HTMLElement) {
        return ATTRIBUTES.reduce(function(formats: any, attribute) {
        if (domNode.hasAttribute(attribute)) {
            formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
        }, {});
    }
*/
}

export default CustomVideo;

/**
 * Заменяем стандартный класс видео на собственный
 * т.к. нам нужна поддержка отечественных сервисов
 * За основу взят класс из исходников Quill
 */
import Quill from 'quill';
import { sanitizeVideoURL } from '../utils/link';
import { ERROR_EMBED_DATA } from '../config';
const BlockEmbed = Quill.import('blots/block/embed');

// Мы не используем высоту и ширину в верстке, но оставим эти атрибуты просто чтобы не ломать логику класса
const ATTRIBUTES = [
    'height',
    'width'
];

// Если пытаемся вставить некорректную ссылку, будем вместо нее выводить этот документ
const SRCDOC = `<!DOCTYPE html><img src="${ERROR_EMBED_DATA}" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; max-width: 100%; max-height: 100%; border-radius: .25rem"/>`;

class CustomVideo extends BlockEmbed {
    static create(value: string) {
        const src = this.sanitize(value);
        const node = super.create(value);
        node.setAttribute('frameborder', '0');
        node.setAttribute('allowfullscreen', true);
        if (src) {
            node.setAttribute('src', src);
            node.setAttribute('allow', 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        } else {
            node.setAttribute('srcdoc', SRCDOC);
        }
        return node;
    }

    static formats(domNode: HTMLElement) {
        //eslint-disable-next-line
        return ATTRIBUTES.reduce(function(formats: any, attribute) {
        if (domNode.hasAttribute(attribute)) {
            formats[attribute] = domNode.getAttribute(attribute);
        }
        return formats;
        }, {});
    }

    // Этот метод мы целиком переписали под свои нужды
    // Он преобразовывает полученный URL в формат пригодный для embed
    static sanitize = (stringURL: string) => {
        return sanitizeVideoURL(stringURL);
    }
    
    static value(domNode: HTMLElement) {
        return domNode.getAttribute('src');
    }

    format(name: string, value: string | null) {
        if (ATTRIBUTES.indexOf(name) > -1) {
            if (value) {
                this.domNode.setAttribute(name, value);
            } else {
                this.domNode.removeAttribute(name);
            }
        } else {
            super.format(name, value);
        }
    }
}

CustomVideo.blotName = 'video';
CustomVideo.className = 'ql-video';
CustomVideo.tagName = 'IFRAME';

export default CustomVideo;

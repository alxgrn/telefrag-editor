/**
 * Общие константы и компоненты для редакторов и просмотровщиков статей
 */
import Quill from 'quill';
import CustomImage from './CustomImage';
import CustomVideo from './CustomVideo';
import 'highlight.js/styles/atom-one-dark.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import './QuillCore.css';

// Регистрируем свои обработчики картинок и видео
// Его надо зарегистрировать один раз, а не в каждом файле просмотровщиков/редакторов
Quill.register(CustomImage);
Quill.register(CustomVideo);

// Кнопки в тулбаре расширенной версии редактора
// NB: По факту не используем этот массив т.к. прописываем тулбар в виде html
export const toolbarFull = [
    [{ 'header': 1 }, { 'header': 2 }],
    ['bold', 'italic', 'underline', 'strike', 'link'],
    ['blockquote', 'code-block', {'list': 'ordered'}, {'list': 'bullet'}],
    [{'indent': '-1'}, {'indent': '+1'}],
    [{ 'align': [] }],
    ['image','video'],
    ['clean'],
];

// Кнопки в плавающем тулбаре компактной версии редактора
export const toolbarShort = [
    // { 'header': 1 }, { 'header': 2 },
    'bold', 'italic', 'underline', 'strike', 'link',
    'blockquote', 'code-block', {'list': 'ordered'}, {'list': 'bullet'},
    // {'indent': '-1'}, {'indent': '+1'},
    'image',
    'video',
    'clean',
];

// Допустимые типы блоков расширенного варианта документа
export const formatsFull = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'link', 
    'blockquote', 'code-block', 'list', 'bullet',
    'indent',
    'align',
    'image', 'video',
];

// Допустимые типы блоков компактной версии документа
export const formatsShort = [
    // 'header',
    'bold', 'italic', 'underline', 'strike', 'link', 
    'blockquote', 'code-block', 'list', 'bullet',
    // 'indent',
    'image', 'video',
];

/**
 * Перехватчик вставки картинки для загрузки на сервер
 */
import Quill from 'quill';
import { ERROR_IMAGE } from '../config';
import { TImageUploader } from '../types';

const imageHandler = (editor: Quill, uploader: TImageUploader) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
        if(!input.files) {
            return;
        }
        const file = input.files[0];
        // file type is only image.
        if (/^image\//.test(file.type)) {
            saveToServer(editor, file, uploader);
        } else {
            console.error(`imageHandler:\nЗагружать можно только изображения`);
            insertToEditor(editor, ERROR_IMAGE);
        }
    };
};

const saveToServer = async (editor: Quill, file: File, uploader: TImageUploader) => {
    try {
        //const formData = new FormData();
        //formData.append('image', file, file.name);
        //formData.append('article_id', article_id + '');
        const result = await uploader(file);
        if(typeof result === 'string') throw new Error(result);
        const file_id = result;
        insertToEditor(editor, file_id);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`imageHandler:\n${error.message}`);
        }
        insertToEditor(editor, ERROR_IMAGE);
    }
};

const insertToEditor = (editor: Quill, srcOrFid: string | number) => {
    const range = editor.getSelection(true);
    // По документации вызов getSelection с параметром true должен всегда
    // возвращать range, но на практике почему-то иногда возвращает null
    const index = range?.index ?? 0;
    editor.insertEmbed(index, 'image', srcOrFid);    
    editor.setSelection(index + 1, 0);
};

export default imageHandler;

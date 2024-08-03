/**
 * Отображает обложку лонгрида и реагирует на клик для загрузки нового изображения
 */
import React, { FC, useEffect, useState } from 'react';
import { TArticle, TImageUploader } from '../types';
import { sanitizeImageURL } from '../utils/link';
import { ERROR_IMAGE } from '../config';

type Props = {
    article: TArticle;
    onUpload: TImageUploader; // Вызывается после выбора обложки для загрузки на сервер
};

const EditorCover: FC<Props> = ({ article, onUpload }) => {
    const [ src, setSrc ] = useState(sanitizeImageURL(article.cover_id));

    useEffect(() => setSrc(sanitizeImageURL(article.cover_id)), [ article ]);

    const saveToServer = async (file: File) => {
        try {
            const result = await onUpload(file);
            if(typeof result === 'string') throw new Error(result);
            const file_id = result;
            setSrc(sanitizeImageURL(file_id));
        } catch (error) {
            if (error instanceof Error) {
                console.error(`EditorCover:\n${error.message}`);
            }
            setSrc(ERROR_IMAGE);
        }
    };

    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            if(!input.files) {
                return;
            }
            const file = input.files[0];
            // file type is only image
            if (/^image\//.test(file.type)) {
                saveToServer(file);
            } else {
                console.error(`EditorCover:\nЗагружать можно только изображения`);
                setSrc(ERROR_IMAGE);
            }
        };
    };

    return (<img src={src} onClick={onClick} />);
};

export default EditorCover;

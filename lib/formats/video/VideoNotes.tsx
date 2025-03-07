/**
 * Редактор публикации видео-ролика.
 * Это специальный тип публикации, в которой основное содержимое занимает видеоплеер.
 */
import { FC, useEffect, useState } from 'react';
import { TArticle, TImageUploader, TNotesSaver } from '../../types';
import { Fieldset, Form, Input } from '@alxgrn/telefrag-ui';
import { validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../utils/link';

//type TVideoFormat = {
//    src: string[];
//};

type VideoNotesProps = {
    article?: TArticle; // публикация
    onSave?: TNotesSaver; // нажатие на кнопку сохранения
    onCancel?: () => void; // нажатие на кнопку отмены редактирования
    onUpload?: TImageUploader; // вызывается после выбора обложки для загрузки на сервер
};

const VideoNotes: FC<VideoNotesProps> = ({ article, onSave, onCancel }) => {
    const [ name, setName ] = useState('');
    const [ info, setInfo ] = useState('');
    const [ text, setText ] = useState('');
    const [ rutube, setRutube ] = useState('');
    const [ youtube, setYoutube ] = useState('');
    const [ vkvideo, setVkvideo ] = useState('');

    useEffect(() => {
        setName(article ? article.name : '');
        setInfo(article ? article.info : '');
        if (!article) return;
        try {
            const content = JSON.parse(article.content);
            if (content.text) setText(content.text);
            if (Array.isArray(content.src)) (content.src as string[]).forEach(url => {
                if (validateRutubeURL(url))  setRutube(url);  else
                if (validateYoutubeURL(url)) setYoutube(url); else
                if (validateVkvideoURL(url)) setVkvideo(url);
            });
        } catch {

        }
    }, [ article ]);

    // Проверка того что требуемые данные введены
    const canSave = () => {
        if (rutube  && !validateRutubeURL(rutube))   return false;
        if (youtube && !validateYoutubeURL(youtube)) return false;
        if (vkvideo && !validateVkvideoURL(vkvideo)) return false;
        return rutube || youtube || vkvideo;
    };

    // Сохранение
    const onBeforeSave = () => {
        if(!onSave || !canSave()) return;
        const src: string[] = [];
        const rt = validateRutubeURL(rutube, true)   + '';
        const yt = validateYoutubeURL(youtube, true) + '';
        const vk = validateVkvideoURL(vkvideo, true) + '';
        if (rt) src.push(rt);
        if (yt) src.push(yt);
        if (vk) src.push(vk);
        const content = JSON.stringify({ src, text });
        onSave({ content, name, info, format: 'video' });
    };

    // Отмена
    const onBeforeCancel = () => {
        if(onCancel) onCancel();
    };

    return (
        <Form
            submit={canSave() ? 'Опубликовать' : undefined}
            cancel='Отменить'
            onSubmit={onSave ? onBeforeSave : undefined }
            onCancel={onCancel ? onBeforeCancel : undefined}
            submitType='Accent'
            cancelType='Default'
        >
            <Input
                id='name'
                top='Заголовок'
                value={name}
                onChange={setName}
                placeholder='Укажите заголовок'
                required
            />
            <Input
                id='info'
                top='Аннотация'
                type='textarea'
                value={info}
                onChange={setInfo}
                placeholder='Укажите аннотацию'
                required
            />
            <Fieldset
                required
                label='Ссылки на видео'
                top='Необходимо указать хотя бы одну ссылку'
                error={!canSave()}
            >
                <Input
                    id='rutube'
                    top='RuTube'
                    value={rutube}
                    onChange={setRutube}
                    placeholder='Ссылка на RuTube'
                />
                <Input
                    id='youtube'
                    top='YouTube'
                    value={youtube}
                    onChange={setYoutube}
                    placeholder='Ссылка на YouTube'
                />
                <Input
                    id='vkvideo'
                    top='VK Video'
                    value={vkvideo}
                    onChange={setVkvideo}
                    placeholder='Ссылка на VK Video'
                />
            </Fieldset>

            <Input
                id='content'
                top='Описание'
                type='textarea'
                value={text}
                onChange={setText}
                placeholder='Опишите о чем видео...'
            />
        </Form>
    );
};

export default VideoNotes;

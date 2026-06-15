/**
 * Редактор публикации видео-ролика.
 * Это специальный тип публикации, в которой основное содержимое занимает видеоплеер.
 */
import { FC, useEffect, useState } from 'react';
import { TArticle, TNotesSaver, TVideoFormat, TVideoFormatItem } from '../../../types';
import { Form, Hidden, Icons, Image, Input } from '@alxgrn/telefrag-ui';
import { sanitizeImageURL, validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../../utils/link';
import VideoSource from './VideoSource';

type VideoNotesProps = {
    article?: TArticle; // публикация
    onSave?: TNotesSaver; // нажатие на кнопку сохранения
    onCancel?: () => void; // нажатие на кнопку отмены редактирования
    //onUpload?: TImageUploader; // вызывается после выбора обложки для загрузки на сервер
};

const VideoNotes: FC<VideoNotesProps> = ({ article, onSave, onCancel }) => {
    const [ name, setName ] = useState('');
    const [ info, setInfo ] = useState('');
    const [ cover, setCover ] = useState<File|undefined>(undefined);
    const [ rtLink, setRtLink ] = useState('');
    const [ ytLink, setYtLink ] = useState('');
    const [ vkLink, setVkLink ] = useState('');
    const [ rtText, setRtText ] = useState('');
    const [ ytText, setYtText ] = useState('');
    const [ vkText, setVkText ] = useState('');
    const [ canSave, setCanSave ] = useState(false);

    useEffect(() => {
        setName(article ? article.name : '');
        setInfo(article ? article.info : '');
        if (!article) return;
        try {
            const content = JSON.parse(article.content);
            if (Array.isArray(content.video)) {
                const video = (content as TVideoFormat).video;
                video.forEach(item => {
                    const { link, text } = item;
                    if (validateRutubeURL(link)) {
                        setRtLink(link);
                        setRtText(text ?? '');
                    } else if (validateYoutubeURL(link)) {
                        setYtLink(link);
                        setYtText(text ?? '');
                    } else if (validateVkvideoURL(link)) {
                        setVkLink(link);
                        setVkText(text ?? '');
                    }
                });
            }
        } catch {
            console.error('Неверный видео-формат статьи');
        }
    }, [ article ]);

    // Проверка того что требуемые данные введены
    // NB: проверяем только данные из вложенных компонентов ввода ссылок
    // т.к. их заполненность не отрабатывается встроенным механизмом формы
    useEffect(() => {
        setCanSave(true);
        if ((rtLink && !validateRutubeURL(rtLink)) ||
            (ytLink && !validateYoutubeURL(ytLink)) ||
            (vkLink && !validateVkvideoURL(vkLink))) {
            setCanSave(false);
            return;
        }
        setCanSave(!!rtLink || !!ytLink || !!vkLink);
    }, [ ytLink, rtLink, vkLink ]);

    // Сохранение
    const onBeforeSave = () => {
        if(!onSave || !canSave) return;
        const video: TVideoFormatItem[] = [];
        const rt = validateRutubeURL(rtLink, true)  + '';
        const yt = validateYoutubeURL(ytLink, true) + '';
        const vk = validateVkvideoURL(vkLink, true) + '';
        if (rt) video.push({ link: rt, text: rtText.trim() });
        if (yt) video.push({ link: yt, text: ytText.trim() });
        if (vk) video.push({ link: vk, text: vkText.trim() });
        const content = JSON.stringify({ video });
        onSave({ content, name, info, cover, format: 'video' });
    };

    return (
        <Form
            submit={onSave ? 'Опубликовать' : undefined}
            onSubmit={onSave ? onBeforeSave : undefined}
            cancel={onCancel ? 'Отменить' : undefined}
            onCancel={onCancel ? onCancel : undefined}
            submitType='Accent'
            cancelType='Default'
            wide
        >
            {/* Финт ушами для блокирования кнопки сабмита при использовании вложенных компонентов формы */}
            {!canSave && <Hidden id='hidden' value='' required/>}
            <Image
                id='cover'
                label='Обложка'
                value={cover}
                onChange={setCover}
                text={<div><big><Icons.Image/></big><br/><small>Выберите файл</small></div>}
                placeholder={article?.cover_id ? sanitizeImageURL(article.cover_id) : undefined}
                required={!article?.cover_id}
            />
            <Input
                id='name'
                label='Заголовок'
                value={name}
                onChange={setName}
                placeholder='Укажите заголовок'
                required
            />
            <Input
                id='info'
                label='Аннотация'
                type='textarea'
                value={info}
                onChange={setInfo}
                placeholder='Укажите аннотацию'
                required
            />
            <VideoSource
                link={ytLink}
                text={ytText}
                type='YouTube'
                required={!rtLink.trim() && !vkLink.trim()}
                onChange={(l, t) => {
                    setYtLink(l.trim());
                    setYtText(t);
                }}
            />
            <VideoSource
                link={rtLink}
                text={rtText}
                type='RuTube'
                required={!ytLink.trim() && !vkLink.trim()}
                onChange={(l, t) => {
                    setRtLink(l.trim());
                    setRtText(t);
                }}
            />
            <VideoSource
                link={vkLink}
                text={vkText}
                type='VK'
                required={!rtLink.trim() && !ytLink.trim()}
                onChange={(l, t) => {
                    setVkLink(l.trim());
                    setVkText(t);
                }}
            />
        </Form>
    );
};

export default VideoNotes;

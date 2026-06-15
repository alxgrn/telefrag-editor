/**
 * Компонент для ввода ссылки на видео и описания с таймкодами
 */
import { FC, useEffect, useState } from 'react';
import { Fieldset, Input } from '@alxgrn/telefrag-ui';
import { validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../../utils/link';

type VideoNotesProps = {
    link: string; // ссылка на видео
    text: string; // описание видео
    type: 'RuTube'|'YouTube'|'VK'; // тип ссылки
    required?: boolean; 
    onChange: (link: string, text: string, error: boolean) => void; // каллбэк изменения
};

const VideoSource: FC<VideoNotesProps> = ({ link, text, type, required, onChange }) => {
    const [ error, setError ] = useState(false);

    useEffect(() => {
        if (!link.trim()) {
            setError(false);
            return;
        }
        switch (type) {
            case 'RuTube':
                setError(!validateRutubeURL(link) as boolean);
                break;
            case 'YouTube':
                setError(!validateYoutubeURL(link) as boolean);
                break;
            case 'VK':
                setError(!validateVkvideoURL(link) as boolean);
                break;
            default:
                setError(true);
        }
    }, [ link, text, type ]);

    return (
        <Fieldset
            label={`Ссылка и описание ${type} видео`}
            error={error}
            required={required}
        >
            <Input
                id={`${type}-link`}
                value={link}
                placeholder='Ссылка'
                onChange={link => onChange(link, text, error)}
                bottom={error ? 'Неверный формат URL' : undefined}
                required={required}
            />
            <Input
                id={`${type}-text`}
                type='textarea'
                value={text}
                placeholder='Описание'
                onChange={text => onChange(link, text, error)}
            />
        </Fieldset>
    );
};

export default VideoSource;

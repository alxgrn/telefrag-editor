/**
 * Просмотровщик публикации видео-ролика.
 * Это специальный тип публикации, в которой основное содержимое занимает видеоплеер.
 */
import { FC, ReactNode, useEffect,  useState } from 'react';
import { validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../utils/link';
import VideoToolbar from './VideoToolbar';
import VideoPlayerRuTube from './players/VideoPlayerRuTube';
import VideoPlayerYouTube from './players/VideoPlayerYouTube';
import VideoPlayerVkVideo from './players/VideoPlayerVkVideo';
import { TVideoFormat } from '../../types';
import Play from './icons/Play';
import './VideoViewer.css';

export type PlayerProps = {
    src: string; // отсанитайзеный URL видео
    seek?: number; // число секунд для перемотки
    play?: boolean; // сразу запустить воспроизведение?
    refresh?: boolean; // флаг обновления, нужен для перемотки к одному и тому же значению несколько раз подряд
    onTime?: (time: number) => void; // калбэк изменения времени воспроизведения
    onPause?: (pause: boolean) => void; // калбэк приостановки воспроизведения
};

type VideoViewerProps = {
    content: string;
    short?: boolean;
    cover?: string;
};

const VideoViewer: FC<VideoViewerProps> = ({ content, short = false, cover = '' }) => {
    const [ time, setTime ] = useState(0);
    const [ seek, setSeek ] = useState(0);
    const [ play, setPlay ] = useState(false); // Надо ли запускать воспроизведение сразу после загрузки плеера
    const [ pause, setPause ] = useState(true); // Будет меняться при нажатии на воспроизведение/пауза внутри плеера
    const [ active, setActive ] = useState('');
    const [ preset, setPreset ] = useState(''); // Плеер по умолчанию
    const [ rtLink, setRtLink ] = useState('');
    const [ ytLink, setYtLink ] = useState('');
    const [ vkLink, setVkLink ] = useState('');
    const [ rtText, setRtText ] = useState('');
    const [ ytText, setYtText ] = useState('');
    const [ vkText, setVkText ] = useState('');
    const [ refresh, setRefresh ] = useState(false);
    const [ showPlayer, setShowPlayer ] = useState(true); // Показываем плеер или обложку

    // Парсим контент
    useEffect(() => {
        try {
            const data = JSON.parse(content) as TVideoFormat;
            const video = data.video;
            if (!Array.isArray(video)) throw new Error();    
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
        } catch {
            console.error('Неверный видео-формат статьи');
        }
    }, [ content ]);

    // Выбираем плеер по-умолчанию
    useEffect(() => {
        if (vkLink) setPreset(vkLink);
        else if (rtLink) setPreset(rtLink);
        else if (ytLink) setPreset(ytLink);
        else setPreset('');
    }, [ rtLink, ytLink, vkLink ]);

    // Если указана обложка, то сначала надо показать её
    useEffect(() => {
        setShowPlayer(!cover);
        if (cover) {
            // Если показываем обложку, то сбрасываем паузу чтобы при клике в тулбаре
            // плееру была передана команда сразу запустить воспроизведение. При клике
            // на саму обложку эта команда устанавливается напрямую.
            setPause(false);
        } else {
            // Если обложки нет, то сразу загружаем плеер по-умолчанию
            setActive(preset);
        }
    }, [ cover, preset ]);

    // Парсинг тайминга в секунды
    const parseTime = (line: string) => {
        const time = line.split(':');
        let h = 0, m = 0, s = 0;
        if (time.length === 3) {
            h = parseInt(time[0]);
            m = parseInt(time[1]);
            s = parseInt(time[2]);
        } else if (time.length === 2) {
            m = parseInt(time[0]);
            s = parseInt(time[1]);

        }
        return h * 60 * 60 + m * 60 + s;
    };

    // Преобразование текста в строки и парсинг таймингов.
    // При клике на тайминг устанавливаем время перемотки и переключаем флаг обновления.
    // Это необходимо чтобы при нескольких кликах на один и тот же тайминг вызывалась перемотка.
    const parseLine = (line: string): ReactNode => {
        if (line.match(/^\d{1,2}(:\d{1,2}){1,2}\s.+/g)) {
            const time = line.split(' ')[0];
            const text = line.substring(time.length);
            return <>
                <span
                    className='a'
                    onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSeek(parseTime(time));
                        setRefresh(r => !r);
                    }}
                >
                    {time}
                </span> {text}
            </>;
        }

        return <>{line}</>;
    };

    // Вывод описания с таймкодами
    const printText = (text: string): ReactNode => {
        if (!text) return null;
        return <p>{text.split('\n').map((line, index) => <span key={index}>{parseLine(line)}<br/></span>)}</p>;
    };

    // Возвращает выбранный плеер
    const getVideoPlayer = (): ReactNode => {
        switch (active) {
            case rtLink: return (<>
                <VideoPlayerRuTube src={rtLink} seek={seek} refresh={refresh} play={play} onTime={setTime} onPause={setPause}/>
                {!short && printText(rtText)}
            </>);
            case ytLink: return (<>
                <VideoPlayerYouTube src={ytLink} seek={seek} refresh={refresh} play={play} onTime={setTime} onPause={setPause}/>
                {!short && printText(ytText)}
            </>);
            case vkLink: return (<>
                <VideoPlayerVkVideo src={vkLink} seek={seek} refresh={refresh} play={play} onTime={setTime} onPause={setPause}/>
                {!short && printText(vkText)}
            </>);
            default: return <></>;
        }
    };

    // Возврат ошибки в случае если нет источников видео
    if (!preset) return (
        <div className={`VideoViewerError ${short ? 'Short' : ''}`}>
            ОШИБКА: не указано ни одного источника видео
        </div>
    );

    return (
    <div className={`VideoViewer ${short ? 'Short' : ''}`}>
        <VideoToolbar
            active={active}
            rutube={rtLink}
            youtube={ytLink}
            vkvideo={vkLink}
            onChange={a => {
                setActive(a); // меняем вид плеера
                setSeek(time > 3 ? time - 3 : time); // устанавливаем с какого момента начать просмотр
                setPlay(!pause); // устанавливаем надо ли сразу запустить воспроизведение
                setShowPlayer(true); // если была показана обложка, то больше не надо
            }}
        />

        {showPlayer ? getVideoPlayer() :
        <div
            className={`VideoCover ${short ? 'Short' : ''}`}
            style={{ backgroundImage: `url(${cover})`}}
            onClick={e => {
                e.stopPropagation();
                setActive(preset);
                setShowPlayer(true);
                setPlay(true);
            }}
        >
            <Play/>
        </div>}
    </div>);
};

export default VideoViewer;

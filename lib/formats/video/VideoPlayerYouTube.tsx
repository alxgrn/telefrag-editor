/**
 * YouTube player
 * https://developers.google.com/youtube/iframe_api_reference
 */
import { FC, useEffect, useRef, useState } from 'react';
import { loadYouTubeIframeApi, YouTubeIframeApiType } from './VideoApi';

type Props = {
    src: string; // отсанитайзеный URL видео
    seek?: number; // число секунд для перемотки
    play?: boolean; // запустить воспроизведение?
    refresh?: boolean; // флаг обновления, нужен для перемотки к одному и тому же значению несколько раз подряд
    onTime: (time: number) => void;
    onPause: (pause: boolean) => void;
};

const VideoPlayerYouTube: FC<Props> = ({ src, seek, refresh, play, onTime, onPause }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ api, setApi ] = useState<YouTubeIframeApiType|undefined>(undefined);
    const [ player, setPlayer ] = useState<any|undefined>(undefined);
    const [ videoId, setVideoId ] = useState('');

    // Загрузим API
    useEffect(() => {
        const loadApi = async () => {
            setApi(undefined);
            try {
                const api = await loadYouTubeIframeApi();
                setApi(api);
            } catch (error) {
                console.error(`Can not load YouTubeIframeApi: ${error}`);
            }
        };

        loadApi();
    }, []);

    // Парсим SRC
    useEffect(() => {
        try {
            const url = new URL(src);
            const videoId = url.pathname.split('/')[2];
            setVideoId(videoId);
        } catch (error) {
            console.error(`Can not parse YouTube URL: ${error}`);
        }
    }, [ src ]);

    // Инициализируем плеер
    useEffect(() => {
        if (!api || !videoId || !ref.current) return;
        const player = new api.Player(ref.current, {
            videoId,
            width: '100%',
            height: '100%',
            playerVars: { 'rel': 0, 'showinfo': 0 , 'autoplay': 1 },
            events: {
                'onReady': () => setPlayer(player),
                'onStateChange': () => {
                    const state = player.getPlayerState();
                    if (state >= 0) onPause(state === 2);
                    // console.log(`STATE ${state}`);
                },
            }
        });
    }, [ ref, api, videoId ]);

    // Отслеживаем время проигрывания
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!player) return;
            const time = player.getCurrentTime();
            onTime(time);
        }, 1000);
    
        return () => clearInterval(intervalId);
    }, [ player ]);

    // Перемотка
    useEffect(() => {
        if (seek !== undefined && player) {
            player.seekTo(seek, true);
        }
    }, [ seek, player, refresh ]);

    // Статус воспроизведения
    // Установка через этот эффект ведет себя странно: если стартуем с паузы, то видим черный экран с индикатором загрузки.
    // Пробовал использовать флаг autoplay при инициализации, но он почему-то игнорируется и всегда работает автозапуск.
    // Как компромиссный вариант установили при инициализации плеера autoplay=1 (пусть будет для порядка)
    // и считаем что по-умолчанию у нас плеер всегда стартует с автозапуском, но если
    // не установлен флаг play, то мы тут же ставим плеер на паузу. В этом случае мы добиваемся
    // того что почти всегда подгружается кадр паузы, но теряем возможность запуска/остановки плеера снаружи.
    // Однако нам это и не нужно, поэтому нет повода для грусти!
    useEffect(() => {
        if (!player) return;
        // if (play) player.playVideo(); else player.pauseVideo();
        if (!play) player.pauseVideo();
    }, [ player, play ]);

    if (!src) return null;
    // Важно! Надо вложить DIV плеера в еще один DIV т.к. API заменяет DIV плеера на IFRAME
    // что ведет к ошибке при размонтировании компонента, если DIV плеера на верхнем уровне
    return (<div className='VideoPlayer'><div ref={ref}/></div>);
};

export default VideoPlayerYouTube;

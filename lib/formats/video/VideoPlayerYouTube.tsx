/**
 * YouTube player
 * TODO: Надо что-то делать с идентификацией DIV в который помещается плеер.
 * Сейчас id статичный и это очень плохо.
 */
import { FC, useEffect, useState } from 'react';
import { loadYouTubeIframeApi, YouTubeIframeApiType } from './VideoApi';

type Props = {
    src: string; // отсанитайзеный URL видео
    seek?: number; // число секунд для перемотки
    play?: boolean; // запустить воспроизведение?
    onTime: (time: number) => void;
    onPause: (pause: boolean) => void;
};

const VideoPlayerYouTube: FC<Props> = ({ src, seek, play, onTime, onPause }) => {
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
        if (!api || !videoId) return;
        const player = new api.Player('video-player', {
            videoId,
            width: '100%',
            height: '100%',
            playerVars: { 'rel': 0, 'showinfo': 0 },
            events: {
                'onReady': () => setPlayer(player),
                'onStateChange': () => {
                    const state = player.getPlayerState();
                    onPause(state === 2);
                },
            }
        });
    }, [ api, videoId ]);

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
    }, [ seek, player ]);

    // Статус воспроизведения
    // Установка через этот эффект ведет себя странно
    // если стартуем с паузы: черный экран с индикатором загрузки
    useEffect(() => {
        if (!player) return;
        if (play) player.playVideo(); else player.pauseVideo();
    }, [ player, play ]);

    // Важно! Надо вложить DIV плеера в еще один DIV т.к. API заменяет DIV плеера на IFRAME
    // что ведет к ошибке при размонтировании компонента, если DIV плеера на верхнем уровне
    return (<div className='VideoPlayer'><div id='video-player'/></div>);
};

export default VideoPlayerYouTube;

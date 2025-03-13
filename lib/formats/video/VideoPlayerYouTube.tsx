/**
 * YouTube player
 */
import { FC, useEffect, useState } from 'react';
import { loadYouTubeIframeApi, YouTubeIframeApiType } from './VideoApi';

type Props = {
    src: string; // отсанитайзеный URL видео
    seek?: number; // число секунд для перемотки
};

const VideoPlayerYouTube: FC<Props> = ({ src, seek }) => {
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
            events: {
                'onReady': () => setPlayer(player),
            }
        });
    }, [ api, videoId ]);

    // Перемотка
    useEffect(() => {
        if (seek && player) {
            player.seekTo(seek, true);
        }
    }, [ seek ]);

    // Важно! Надо вложить DIV плеера в еще один DIV т.к. API заменяет DIV плеера на IFRAME
    // что ведет к ошибке при размонтировании компонента, если DIV плеера на верхнем уровне
    return (<div className='VideoPlayer'><div id='video-player'/></div>);
};

export default VideoPlayerYouTube;

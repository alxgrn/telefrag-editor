/**
 * YouTube Player
 * ВНИМАНИЕ: По непонятной причине плеер всегда стартует видео после загрузки!
 *           Для того, чтобы это купировать, приходится городить огород с проверкой первого проигрывания.
 */
import { FC, useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { PlayerProps } from '../VideoViewer';
import { validateYoutubeURL } from '../../../utils/link';

enum State {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
};

const VideoPlayerYouTube: FC<PlayerProps> = ({ src, seek, play, refresh, onTime, onPause }) => {
    const isMounted = useRef(true);
    const playerRef = useRef<any>(null);
    const [ videoId, setVideoId ] = useState('');
    const [ firstPlay, setFirstPlay ] = useState(true);

    // console.log(`YouTube Player seek=${seek} play=${play} refresh=${refresh}`);

    // Не будем вызывать проверку времени воспроизведения у размонтированного компонента
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false };
    }, []);

    // Сбрасываем первого проигрывания при смене видео
    useEffect(() => {
        setFirstPlay(true);
    }, [videoId]);

    // Опции проигрывателя
    const opts: YouTubeProps['opts'] = {
        playerVars: {
            autoplay: 0, // Отключаем автозапуск
            start: 0,
            iv_load_policy: 3, // Скрываем аннотации
            rel: 0, // Не показывать похожие видео в конце
            enablejsapi: 1, // Включаем JS API
            origin: window.origin,
            controls: 1, // Показываем элементы управления
            playsinline: 1, // Воспроизведение "внутри" (для мобильных)
        },
    };

    // Извлечение videoId из URL
    useEffect(() => {
        try {
            const link = validateYoutubeURL(src, true) as string;
            if (!link) throw new Error(`Bad URL for YouTube video: ${src}`);
            const url = new URL(link);
            const videoId = url.pathname.split('/')[2];
            setVideoId(videoId);
        } catch (error) {
            console.error(`YouTube Player: Can not parse YouTube URL: ${error}`);
            setVideoId('');
        }
    }, [ src ]);

    // Обработчик готовности плеера
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
        //console.log(`YouTube Player: player ready`);
        if (typeof seek === 'number') {
            event.target.seekTo(seek, true);
            //console.log(`YouTube Player: seek to ${seek}`);
        }
    };

    // Обработчик изменения состояния (пауза, воспроизведение и т.д.)
    const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
        // console.log(`YouTube Player: state changed to ${event.data}`);
        if (event.data === State.PLAYING) {
            if (firstPlay && !play) {
                // Видео начало играть, но play=false -> ставим на паузу
                event.target.pauseVideo();
                setFirstPlay(false);
                //console.warn('YouTube Player: blocked unintended play');
            } else {
                onPause?.(false);
                //console.log(`YouTube Player: state changed to play`);
            }
        } else if (event.data === State.PAUSED || event.data === State.ENDED) {
            onPause?.(true);
            //console.log(`YouTube Player: state changed to pause`);
        }
    };

    // Обработка ошибок
    const onPlayerError: YouTubeProps['onError'] = (event) => {
        console.error('YouTube Player: error', event.data);
        // Можно вызвать onError callback, если он передан
    };

    // Обновление времени (вызывается каждые ~250мс)
    useEffect(() => {
        if (!isMounted.current || !onTime) return;

        const interval = setInterval(() => {
            if (playerRef.current) {
                const currentTime = playerRef.current.getCurrentTime();
                if (currentTime !== undefined && !isNaN(currentTime)) {
                    onTime(currentTime);
                }
            }
        }, 250);

        return () => clearInterval(interval);
    }, [ onTime ]);

    // Перемотка при изменении seek или refresh
    useEffect(() => {
        if (playerRef.current && typeof seek === 'number') {
            playerRef.current.seekTo(seek, true);
            //console.log(`YouTube Player: seek to ${seek}`);
        }
    }, [ seek, refresh ]);

    // Управление воспроизведением при изменении пропса play
    useEffect(() => {
        if (!playerRef.current) return;

        const player = playerRef.current;
        const playerState = player.getPlayerState();

        if (play) {
            // Запускаем, только если не играет
            if (playerState !== State.PLAYING) {
                player.playVideo();
                //console.log('YouTube Player: play video');
            }
        } else {
            // Ставим на паузу, только если играет
            if (playerState === State.PLAYING) {
                player.pauseVideo();
                //console.log('YouTube Player: pause video');
            }
        }
    }, [ play ]);

    if (!videoId) return null;

    return (
        <div className="VideoPlayer">
            <YouTube
                key={videoId}
                videoId={videoId}
                opts={opts}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                onError={onPlayerError}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default VideoPlayerYouTube;

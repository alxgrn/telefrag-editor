/**
 * VK Video player
 * https://dev.vk.com/ru/widgets/video
 */
import { FC, useEffect, useRef, useState } from 'react';
import { loadVkVideoIframeApi, VkVideoIframeApiType } from './VideoApiVkVideo';
import { PlayerProps } from '../VideoViewer';

type State = {
    state: 'uninited' | 'unstarted' | 'playing' | 'paused' | 'ended' | 'error';
    volume: number;
    muted: boolean;
    time: number;
    duration: number;
};

const VideoPlayerVkVideo: FC<PlayerProps> = ({ src, seek, refresh, play, onTime, onPause }) => {
    const ref = useRef<HTMLIFrameElement>(null);
    const [ api, setApi ] = useState<VkVideoIframeApiType | undefined>(undefined);
    const [ ready, setReady ] = useState(false); // Готов плеер или еще нет
    const [ player, setPlayer ] = useState<any | undefined>(undefined);
    const playerRef = useRef<any>(null); // Для безопасного доступа внутри колбэков

    // console.log(`VK Video Player seek=${seek} play=${play} refresh=${refresh}`);

    // Загрузка API VK Video
    useEffect(() => {
        const loadApi = async () => {
            try {
                const api = await loadVkVideoIframeApi();
                setApi(api);
            } catch (error) {
                console.error('VK Video Player: Не удалось загрузить API', error);
            }
        };

        loadApi();
    }, []);

    // Инициализация плеера
    useEffect(() => {
        if (!api || !ref.current) return;

        try {
            const instance = api.VideoPlayer(ref.current);
            setPlayer(instance);
            playerRef.current = instance;

            // Очистка при размонтировании
            return () => {
                const p = playerRef.current;
                if (!p) return;

                // Сначала отписываемся от всех событий
                p.off('timeupdate');
                p.off('started');
                p.off('resumed');
                p.off('paused');

                // Затем вызываем destroy, если метод существует
                if (typeof p.destroy === 'function') {
                    p.destroy();
                }

                // Обнуляем ссылку
                playerRef.current = null;
            };
        } catch (error) {
            console.error('VK Video Player: Ошибка инициализации', error);
        }
    }, [ api ]);

    // Перемотка видео
    useEffect(() => {
        if (player && ready && seek !== undefined && typeof player.seek === 'function') {
            try {
                player.seek(seek);
            } catch (err) {
                console.warn(`VK Video Player: Не удалось выполнить seek к ${seek}`, err);
            }
        }
    }, [ player, ready, seek, refresh ]);

    // Управление воспроизведением
    useEffect(() => {
        if (player && ready && typeof player.play === 'function' && typeof player.pause === 'function') {
            try {
                if (play) player.play(); else player.pause();
            } catch (err) {
                console.warn(`VK Video Player: Не удалось выполнить play/pause`, err);
            }
        }
    }, [ player, ready, play ]);

    // Подписка на события плеера
    useEffect(() => {
        if (!player) return;

        const handleTimeUpdate = (state: State) => {
            //console.log(`TIME UPDAE: ${state.time} of ${state.duration}`);
            setReady(true);
            onTime?.(state.time);
        }
        const handleStarted = () => onPause?.(false);
        const handleResumed = () => onPause?.(false);
        const handlePaused = () => onPause?.(true);

        player.on('timeupdate', handleTimeUpdate);
        player.on('started', handleStarted);
        player.on('resumed', handleResumed);
        player.on('paused', handlePaused);

        return () => {
            player.off('timeupdate', handleTimeUpdate);
            player.off('started', handleStarted);
            player.off('resumed', handleResumed);
            player.off('paused', handlePaused);
        };
    }, [ player, onTime, onPause ]);

    if (!src) return null;

    return (
        <iframe
            ref={ref}
            src={`${src}&js_api=1`}
            className="VideoPlayer"
            allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
        />
    );
};

export default VideoPlayerVkVideo;

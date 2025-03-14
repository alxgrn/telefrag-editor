/**
 * VK Video player
 * https://dev.vk.com/ru/widgets/video
 */
import { FC, useEffect, useRef, useState } from 'react';
import { loadVkVideoIframeApi, VkVideoIframeApiType } from './VideoApi';

type State = {
    state: 'uninited'|'unstarted'|'playing'|'paused'|'ended'|'error',
    volume: number,
    muted: boolean,
    time: number,
    duration: number,
};

type Props = {
    src: string; // отсанитайзеный URL видео
    seek?: number; // число секунд для перемотки
    play?: boolean; // запустить воспроизведение?
    onTime: (time: number) => void;
    onPause: (pause: boolean) => void;
};

const VideoPlayerVkVideo: FC<Props> = ({ src, seek, play, onTime, onPause }) => {
    const ref = useRef<HTMLIFrameElement>(null);
    const [ api, setApi ] = useState<VkVideoIframeApiType|undefined>(undefined);
    const [ player, setPlayer ] = useState<any|undefined>(undefined);

    // Загрузим API
    useEffect(() => {
        const loadApi = async () => {
            setApi(undefined);
            try {
                const api = await loadVkVideoIframeApi();
                setApi(api);
            } catch (error) {
                console.error(`Can not load VkVideoIframeApi: ${error}`);
            }
        };

        loadApi();
    }, []);

    // Инициализируем плеер
    useEffect(() => {
        if (!api || !ref.current) return;
        const player = api.VideoPlayer(ref.current);
        setPlayer(player);
    }, [ api, ref ]);

    // Перемотка
    useEffect(() => {
        if (player && seek !== undefined) {
            player.seek(seek);
        }
    }, [ seek, player ]);

    // Статус воспроизведения
    useEffect(() => {
        if (!player) return;
        if (play) player.play(); else player.pause();
    }, [ player, play ]);

    // Отслеживаем время проигрывания и статус
    useEffect(() => {
        player?.on('timeupdate', (state: State) => onTime(state.time));
        player?.on('started', () => onPause(false));
        player?.on('resumed', () => onPause(false));
        player?.on('paused', () => onPause(true));
    }, [ player ]);

    return (<iframe
        className='VideoPlayer'
        ref={ref}
        src={`${src}&js_api=1`}
        allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    />);
};

export default VideoPlayerVkVideo;

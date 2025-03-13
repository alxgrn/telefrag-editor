/**
 * VK Video player
 */
import { FC, useEffect, useRef, useState } from 'react';
import { loadVkVideoIframeApi, VkVideoIframeApiType } from './VideoApi';

type Props = {
    src: string; // отсанитайзеный URL видео
    seek?: number; // число секунд для перемотки
};

const VideoPlayerVkVideo: FC<Props> = ({ src, seek }) => {
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
        if (seek && player) {
            //console.log(`Seek to ${seek}`);
            //console.dir(player);
            player.seek(seek);
        }
    }, [ seek, player ]);

    return (<iframe
        className='VideoPlayer'
        ref={ref}
        src={`${src}&js_api=1`}
        allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    />);
};

export default VideoPlayerVkVideo;

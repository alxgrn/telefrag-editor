/**
 * RuTube player
 */
import { FC, useEffect, useRef } from 'react';

type Props = {
    src: string; // отсанитайзеный URL видео
    seek?: number; // число секунд для перемотки
};

const VideoPlayerRuTube: FC<Props> = ({ src, seek }) => {
    const player = useRef<HTMLIFrameElement>(null);

    // Перемотка
    useEffect(() => {
        player.current?.contentWindow?.postMessage(JSON.stringify({
            type: 'player:setCurrentTime',
            data: { time: seek }
        }), '*');
    }, [ seek ]);

    return (<iframe
        className='VideoPlayer'
        ref={player}
        src={src}
        allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    />);
};

export default VideoPlayerRuTube;

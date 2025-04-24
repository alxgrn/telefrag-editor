/**
 * RuTube player
 * https://rutube.ru/info/embed/
 * TODO: Пока не очень понятно как различать несколько плееров на одной странице
 */
import { FC, useEffect, useRef, useState } from 'react';

type Props = {
    src: string; // отсанитайзеный URL видео
    seek?: number; // число секунд для перемотки
    play?: boolean; // запустить воспроизведение?
    refresh?: boolean; // флаг обновления, нужен для перемотки к одному и тому же значению несколько раз подряд
    onTime: (time: number) => void;
    onPause: (pause: boolean) => void;
};

const VideoPlayerRuTube: FC<Props> = ({ src, seek, refresh, play, onTime, onPause }) => {
    const player = useRef<HTMLIFrameElement>(null);
    const [ ready, setReady ] = useState(false); // готов плеер или еще нет

    // Отслеживаем события от проигрывателя
    useEffect(() => {
        const listener = (event: MessageEvent) => {
            try {
                var message = JSON.parse(event.data);        
                switch (message.type) {
                    case 'player:ready':
                        setReady(true);
                        //console.log(`player:ready`);
                        //console.dir(message.data);
                        break;
                    case 'player:currentTime':
                        onTime(message.data.time);
                        //console.log(`playerId: ${message.data.playerId}`);
                        break;
                    case 'player:changeState':
                        onPause(message.data.state === 'paused');
                        break;
                };
            } catch (error) {
                console.error(`VideoPlayerRuTube: bad event from player: ${error}`);
            }
        };

        window.addEventListener('message', listener);
        return () => window.removeEventListener('message', listener);
    }, []);

    // Перемотка
    useEffect(() => {
        if (!ready) return;
        player.current?.contentWindow?.postMessage(JSON.stringify({
            type: 'player:setCurrentTime',
            data: { time: seek }
        }), '*');
    }, [ seek, ready, refresh ]);

    // Запуск / останов
    useEffect(() => {
        if (!ready) return;
        player.current?.contentWindow?.postMessage(JSON.stringify({
            type: play ? 'player:play' : 'player:pause',
            data: {}
        }), '*');
    }, [ play, ready ]);

    if (!src) return null;

    return (<iframe
        className='VideoPlayer'
        ref={player}
        src={src}
        allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    />);
};

export default VideoPlayerRuTube;

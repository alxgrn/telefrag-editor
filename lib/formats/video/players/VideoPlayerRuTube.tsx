/**
 * RuTube player
 * https://rutube.ru/info/embed/
 */
import { FC, useEffect, useRef, useState } from 'react';
import { PlayerProps } from '../VideoViewer';

const VideoPlayerRuTube: FC<PlayerProps> = ({ src, seek, refresh, play, onTime, onPause }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [ ready, setReady ] = useState(false); // Готов плеер или еще нет

    // console.log(`RuTube Player seek=${seek} play=${play} refresh=${refresh}`);

    // Отслеживаем события от проигрывателя
    useEffect(() => {
        const listener = (event: MessageEvent) => {
            try {
                // Проверка источника
                if (event.origin !== 'https://rutube.ru' && event.origin !== 'https://www.rutube.ru') {
                    return;
                }

                // Проверяем, от нашего ли плеера сообщение
                if (event.source !== iframeRef.current?.contentWindow) {
                    return;
                }
                
                const message = JSON.parse(event.data);
    
                switch (message.type) {
                    case 'player:ready':
                        // См. ниже: это сообщение ещё не означает что плеером можно уже управлять
                        // setReady(true);
                        // console.log(`VideoPlayerRuTube => player:ready`);
                        break;
                    case 'player:currentTime':
                        onTime?.(message.data.time);
                        // Ловим duration это необходимо для определения того, что данные о видео
                        // загружены плеером и он может нормально делать seek, одного ready не достаточно!
                        if (message.data.duration && isFinite(message.data.duration)) {
                            setReady(true);
                        }
                        //console.log(`VideoPlayerRuTube => player:currentTime`);
                        break;
                    case 'player:changeState':
                        if (message.data.state === 'pause' || message.data.state === 'playing') {
                            onPause?.(message.data.state === 'pause');
                        }
                        //console.log(`VideoPlayerRuTube => player:changeState to "${message.data.state}"`);
                        break;
                    case 'player:error':
                        console.error(`RuTube Player: error`, message.data?.message);
                    break;
                };
            } catch (error) {
                console.warn(`RuTube Player: invalid message`, error);
            }
        };

        window.addEventListener('message', listener);
        return () => window.removeEventListener('message', listener);
    }, [ onTime, onPause ]);

    // Перемотка
    useEffect(() => {
        //console.log(`READY: ${ready} SEEK: ${seek}`);
        if (!ready || seek === null || seek === undefined) return;

        if (typeof seek !== 'number' || !isFinite(seek) || isNaN(seek) || seek < 0) {
            console.warn(`RuTube Player: Invalid seek value ${seek}`);
            return;
        }

        if (!iframeRef.current?.contentWindow) return;
        iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
                type: 'player:setCurrentTime',
                data: { time: seek }
            }),
            'https://rutube.ru' // '*'
        );
    }, [ seek, ready, refresh ]);

    // Запуск / останов
    useEffect(() => {
        if (!ready || !iframeRef.current?.contentWindow) return;
        iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
                type: play ? 'player:play' : 'player:pause',
                data: {}
            }),
            'https://rutube.ru' // '*'
        );
    }, [ play, ready ]);

    if (!src) return null;

    return (<iframe
        className='VideoPlayer'
        ref={iframeRef}
        src={src}
        allowFullScreen
        allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    />);
};

export default VideoPlayerRuTube;

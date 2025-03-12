/**
 * Редактор публикации видео-ролика.
 * Это специальный тип публикации, в которой основное содержимое занимает видеоплеер.
 */
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../utils/link';
import { Button } from '@alxgrn/telefrag-ui';
import { loadVkVideoIframeApi, loadYouTubeIframeApi, VkVideoIframeApiType, YouTubeIframeApiType } from './VideoApi';
import './VideoViewer.css';

type VideoViewerProps = {
    content: string;
};

const VideoViewer: FC<VideoViewerProps> = ({ content }) => {
    const player = useRef<HTMLIFrameElement>(null);
    const [ src, setSrc ] = useState('');
    const [ text, setText ] = useState('');
    const [ rutube, setRutube ] = useState('');
    const [ youtube, setYoutube ] = useState('');
    const [ vkvideo, setVkvideo ] = useState('');
    const [ youtubeApi, setYoutubeApi ] = useState<YouTubeIframeApiType|undefined>(undefined);
    const [ vkvideoApi, setVkvideoApi ] = useState<VkVideoIframeApiType|undefined>(undefined);

    // Загрузим API
    useEffect(() => {
        const loadApi = async () => {
            setYoutubeApi(undefined);
            setVkvideoApi(undefined);
            try {
                const yt = await loadYouTubeIframeApi();
                setYoutubeApi(yt);
            } catch (error) {
                console.error(`Can not load YouTubeIframeApi: ${error}`);
            }
            try {
                const vk = await loadVkVideoIframeApi();
                setVkvideoApi(vk);
            } catch (error) {
                console.error(`Can not load VkVideoIframeApi: ${error}`);
            }
        };

        loadApi();
    }, []);

    // Парсим контент
    useEffect(() => {
        try {
            const data = JSON.parse(content);
            //console.log(data);
            if (data.text) setText(data.text);
            if (Array.isArray(data.src)) (data.src as string[]).forEach(url => {
                if (validateRutubeURL(url)) {
                    setSrc(url);
                    setRutube(url); 
                } else if (validateYoutubeURL(url)) {
                    setSrc(url);
                    setYoutube(url); 
                } else if (validateVkvideoURL(url)) {
                    setSrc(url);
                    setVkvideo(url);
                }
            });
        } catch (error) {
            console.error(`Can not parse Video format: ${error}`);
        }
    }, [ content ]);

    // Париснг тайминга в секунды
    const parseTime = (line: string) => {
        const time = line.split(':');
        let h = 0, m = 0, s = 0;
        if (time.length === 3) {
            h = parseInt(time[0]);
            m = parseInt(time[1]);
            s = parseInt(time[2]);
        } else if (time.length === 2) {
            m = parseInt(time[0]);
            s = parseInt(time[1]);

        }
        return h * 60 * 60 + m * 60 + s;
    };

    // Перемотка плеера RuTube
    const seekRuTube = (time: number) => {
        player.current?.contentWindow?.postMessage(JSON.stringify({
            type: 'player:setCurrentTime',
            data: { time }
        }), '*');
    };

    // Перемотка плеера YouTube
    const seekYouTube = (time: number) => {
        if (!youtubeApi || !player.current) return;
        const api = youtubeApi.Player(player.current);
        if (api) api.seekTo(time, true);
    };

    // Перемотка плеера VkVideo
    const seekVkVideo = (time: number) => {
        if (!vkvideoApi || !player.current) return;
        const api = vkvideoApi.VideoPlayer(player.current);
        if (api) api.seek(time);
    };

    // Перемотка плеера
    const seekPlayer = (stime: string) => {
        const time = parseTime(stime);
        if (src.startsWith('https://rutube')) seekRuTube(time);
        else if (src.startsWith('https://youtube')) seekYouTube(time);
        else if (src.startsWith('https://vkvideo')) seekVkVideo(time);
        else alert(`${stime} - ${time}`);
    };

    // Преобразование текста в строки и парсинг таймингов
    const parseLine = (line: string): ReactNode => {
            if (line.match(/^\d{1,2}(:\d{1,2}){1,2}\s.+/g)) {
                const time = line.split(' ')[0];
                const text = line.substring(time.length);
                return <><span className='a' onClick={() => seekPlayer(time)}>{time}</span> {text}</>;
            }

            return <>{line}</>;
    };

    return (<div className='VideoViewer'>
        <div>
            {rutube && <>
                <Button
                    label='RuTube'
                    size='Small'
                    type={src.startsWith('https://rutube') ? 'Accent' : undefined}
                    onClick={() => setSrc(rutube)}
                />&nbsp;</>}
            {youtube && <>
                <Button
                    label='YouTube'
                    size='Small'
                    type={src.startsWith('https://youtube') ? 'Accent' : undefined}
                    onClick={() => setSrc(youtube)}
                />&nbsp;</>}
            {vkvideo &&
                <Button
                    label='VK Video'
                    size='Small'
                    type={src.startsWith('https://vkvideo') ? 'Accent' : undefined}
                    onClick={() => setSrc(vkvideo)}
                />}
        </div>
        <iframe
            ref={player}
            src={`${src}?enablejsapi=1&js_api=1`}
            allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        />
        <div>
            {text.split('\n').map((line, index) => <div key={index}>{parseLine(line)}</div>)}
        </div>
    </div>);
};

export default VideoViewer;

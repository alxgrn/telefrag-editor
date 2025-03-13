/**
 * Редактор публикации видео-ролика.
 * Это специальный тип публикации, в которой основное содержимое занимает видеоплеер.
 */
import { FC, ReactNode, useEffect,  useState } from 'react';
import { validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../utils/link';
import VideoToolbar from './VideoToolbar';
import VideoPlayerRuTube from './VideoPlayerRuTube';
import VideoPlayerYouTube from './VideoPlayerYouTube';
import VideoPlayerVkVideo from './VideoPlayerVkVideo';
import './VideoViewer.css';

type VideoViewerProps = {
    content: string;
};

const VideoViewer: FC<VideoViewerProps> = ({ content }) => {
    const [ src, setSrc ] = useState('');
    const [ text, setText ] = useState('');
    const [ seek, setSeek ] = useState<number>(0);
    const [ rutube, setRutube ] = useState('');
    const [ youtube, setYoutube ] = useState('');
    const [ vkvideo, setVkvideo ] = useState('');

    // Парсим контент
    useEffect(() => {
        try {
            const data = JSON.parse(content);
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

    // Парсинг тайминга в секунды
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

    // Преобразование текста в строки и парсинг таймингов
    const parseLine = (line: string): ReactNode => {
            if (line.match(/^\d{1,2}(:\d{1,2}){1,2}\s.+/g)) {
                const time = line.split(' ')[0];
                const text = line.substring(time.length);
                return <><span className='a' onClick={() => setSeek(parseTime(time))}>{time}</span> {text}</>;
            }

            return <>{line}</>;
    };

    return (<div className='VideoViewer'>
        <VideoToolbar
            active={src}
            onActive={setSrc}
            rutube={rutube}
            youtube={youtube}
            vkvideo={vkvideo}
        />
        {src === rutube ? <VideoPlayerRuTube src={src} seek={seek}/> :
        src === youtube ? <VideoPlayerYouTube src={src} seek={seek}/> :
        <VideoPlayerVkVideo src={src} seek={seek} />}
        <div>
            {text.split('\n').map((line, index) => <span key={index}>{parseLine(line)}<br/></span>)}
        </div>
    </div>);
};

export default VideoViewer;

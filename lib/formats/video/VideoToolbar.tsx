/**
 * Переключатель плеера
 */
import { FC, useEffect, useState } from 'react';
import './VideoToolbar.css';
import VkVideo from './icons/VkVideo';
import RuTube from './icons/RuTube';
import YouTube from './icons/YouTube';

type Props = {
    youtube?: string;
    rutube?: string;
    vkvideo?: string;
    active?: string;
    onChange: (src: string) => void;
};

const VideoToolbar: FC<Props> = ({ rutube, youtube, vkvideo, active, onChange }) => {
    const [ count, setCount ] = useState(0);

    useEffect(() => {
        let count = 0;
        if (rutube) count ++;
        if (youtube) count ++;
        if (vkvideo) count ++;
        setCount(count);
    }, [ rutube, youtube, vkvideo ]);

    const onClick = (player: string) => {
        if (player !== active) onChange(player);
    };

    if (count < 2) return null;

    return (
        <div className='VideoToolbar'>
            {vkvideo &&
            <div
                className={`VideoToolbarButton ${active === vkvideo ? 'Active' : ''}`}
                onClick={() => onClick(vkvideo)}
            >
                <VkVideo/>
                <span>VK Video</span>
            </div>}
            {rutube && 
            <div
                className={`VideoToolbarButton ${active === rutube ? 'Active' : ''}`}
                onClick={() => onClick(rutube)}
            >
                <RuTube/>
                <span>RuTube</span>
            </div>}
            {youtube && 
            <div
                className={`VideoToolbarButton ${active === youtube ? 'Active' : ''}`}
                onClick={() => onClick(youtube)}
            >
                <YouTube/>
                <span>YouTube</span>
            </div>}
        </div>
    );
};

export default VideoToolbar;

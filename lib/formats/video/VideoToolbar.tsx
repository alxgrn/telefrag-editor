/**
 * Переключатель плеера
 */
import { FC, useEffect, useState } from 'react';
import './VideoToolbar.css';

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
                VK Video
            </div>}
            {rutube && 
            <div
                className={`VideoToolbarButton ${active === rutube ? 'Active' : ''}`}
                onClick={() => onClick(rutube)}
            >
                RuTube
            </div>}
            {youtube && 
            <div
                className={`VideoToolbarButton ${active === youtube ? 'Active' : ''}`}
                onClick={() => onClick(youtube)}
            >
                YouTube
            </div>}
        </div>
    );
};

export default VideoToolbar;

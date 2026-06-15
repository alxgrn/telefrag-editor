/**
 * Переключатель плеера
 */
import { FC, useEffect, useState } from 'react';
import { Button } from '@alxgrn/telefrag-ui';

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
            {vkvideo && <Button
                    label='VK Video'
                    size='Small'
                    type={active === vkvideo ? 'Accent' : undefined}
                    onClick={() => onClick(vkvideo)}
            />}
            {rutube && <Button
                label='RuTube'
                size='Small'
                type={active === rutube ? 'Accent' : undefined}
                onClick={() => onClick(rutube)}
            />}
            {youtube && <Button
                label='YouTube'
                size='Small'
                type={active === youtube ? 'Accent' : undefined}
                onClick={() => onClick(youtube)}
            />}
        </div>
    );
};

export default VideoToolbar;

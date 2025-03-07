import { FC, useEffect, useState } from "react";
import { Button } from '@alxgrn/telefrag-ui';

type Props = {
    mode?: string;
    changed?: boolean;
    onChange?: (mode: string) => void;
};

const ModeSelector: FC<Props> = ({ mode, changed, onChange }) => {
    const [ state, setState ] = useState<string|undefined>(mode);

    useEffect(() => setState(mode), [ mode ]);

    const setMode = (mode: string) => {
        setState(mode);
        if (onChange) onChange(mode);
    };

    return (<div className={changed ? 'toolbar changed' : 'toolbar'}>
        <Button size='Small' label='QuillViewer' onClick={() => setMode('QuillViewer')} type={state === 'QuillViewer' ? 'Accent' : undefined}/>&nbsp;
        <Button size='Small' label='QuillNotes' onClick={() => setMode('QuillNotes')} type={state === 'QuillNotes' ? 'Accent' : undefined}/>&nbsp;
        <Button size='Small' label='QuillEditor' onClick={() => setMode('QuillEditor')} type={state === 'QuillEditor' ? 'Accent' : undefined}/>&nbsp;
        <Button size='Small' label='VideoViewer' onClick={() => setMode('VideoViewer')} type={state === 'VideoViewer' ? 'Accent' : undefined}/>&nbsp;
        <Button size='Small' label='VideoNotes' onClick={() => setMode('VideoNotes')} type={state === 'VideoNotes' ? 'Accent' : undefined}/>&nbsp;
        <Button size='Small' label='VideoEditor' onClick={() => setMode('VideoEditor')} type={state === 'VideoEditor' ? 'Accent' : undefined}/>
    </div>);
};

export default ModeSelector;

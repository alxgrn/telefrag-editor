/**
 * Просмотровщик документа созданного через Quill
 */
import { FC, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import hljs from 'highlight.js';
import { formatsFull, formatsShort, toolbarFull, toolbarShort } from './QuillCore';
import './QuillViewer.css';

type QuillViewerProps = {
    short?: boolean; // флаг варианта набора тегов у контента - полный или компактный
    content: string | null;
    expandable?: boolean; // флаг того надо ли выводить контент свернутым если он слишком длинный
};

const QuillViewer: FC<QuillViewerProps> = ({ short = false, content, expandable = false }) => {
    const refViewer = useRef<HTMLDivElement>(null);
    const refWrapper = useRef<HTMLDivElement>(null);
    const [ error, setError ] = useState('');
    const [ collapsed, setСollapsed ] = useState(expandable);

    useEffect(() => {
        setError('');
        if (!refViewer.current) return;
        const editor = new Quill(refViewer.current, {
            readOnly: true,
            theme: 'bubble',
            formats: short ? formatsShort : formatsFull,
            modules: {
                syntax: {
                    hljs,
                    //highlight: (text: string) => hljs.highlightAuto(text).value,
                },
                toolbar: {
                    // В принципе это не нужно, но Quill пишет предупреждение о том,
                    // что удаляет кнопку тулбара для запрещенных видов формата
                    container: short ? toolbarShort : toolbarFull,
                }                
            }
        });
        try {
            if(content) {
                editor.setContents(JSON.parse(content));
            } else {
                setError('Содержимое отсуствует');
            }
        } catch {
            setError('Ошибка парсинга');
        }
    }, [ refViewer, content, short, collapsed ]);

    // Проверяем надо ли выводить свернутый вариант
    useEffect(() => {
        if (!refViewer.current || !refWrapper.current) return;
        const viewer = refViewer.current;
        const wrapper = refWrapper.current;
        setСollapsed(viewer.clientHeight > wrapper.clientHeight);
    }, [ refViewer, refWrapper ]);

    if (error) return <div className='error'>{error}</div>;
    if (!expandable) return <div ref={refViewer}/>;
    if (!collapsed) return <div ref={refViewer}/>;

    return (<>
        <div ref={refWrapper} className='QuillViewerWrapper'>
            <div ref={refViewer}/>
        </div>
        <div className='QuillViewerExpand'>
            <span className='a' onClick={() => setСollapsed(false)}>Показать целиком...</span>
        </div>
    </>);
};

export default QuillViewer;

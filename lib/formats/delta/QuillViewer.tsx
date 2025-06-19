/**
 * Просмотровщик документа созданного через Quill
 */
import { FC, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
//import hljs from 'highlight.js';
import { formatsFull, formatsShort, toolbarFull, toolbarShort } from './QuillCore';

type QuillViewerProps = {
    short?: boolean; // флаг варианта набора тегов у контента - полный или компактный
    content: string | null;
};

const QuillViewer: FC<QuillViewerProps> = ({ short = false, content }) => {
    const refViewer = useRef<HTMLDivElement>(null);
    const [ error, setError ] = useState('');

    useEffect(() => {
        setError('');
        if (!refViewer.current) return;
        const editor = new Quill(refViewer.current, {
            readOnly: true,
            theme: 'bubble',
            formats: short ? formatsShort : formatsFull,
            modules: {
                /*syntax: {
                    hljs,
                    //highlight: (text: string) => hljs.highlightAuto(text).value,
                },*/
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
    }, [ refViewer, content, short ]);

    if (error) return <div className='error'>{error}</div>;
    return <div ref={refViewer}/>;
};

export default QuillViewer;

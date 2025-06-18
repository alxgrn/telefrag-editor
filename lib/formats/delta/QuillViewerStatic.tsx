/**
 * Просмотровщик документа созданного через Quill
 * В данной версии не используется сам Quill, вместо него
 * формат delta парсится сразу в html
 */
import { FC, useEffect, useRef, useState } from 'react';
import './QuillViewer.css';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { API_URL } from '../../config';

const CLASS = 'ql-editor';

// Скопировано из исходников Quill
type DeltaOperation = { insert?: any, delete?: number, retain?: number } & OptionalAttributes;
interface StringMap { [key: string]: any; }
interface OptionalAttributes { attributes?: StringMap; }

type QuillViewerProps = {
    content: string | null;
    expandable?: boolean; // флаг того надо ли выводить контент свернутым если он слишком длинный
};

const QuillViewer: FC<QuillViewerProps> = ({ content, expandable = false }) => {
    const refViewer = useRef<HTMLDivElement>(null);
    const refWrapper = useRef<HTMLDivElement>(null);
    const [ html, setHtml ] = useState('');
    const [ error, setError ] = useState('');
    const [ collapsed, setСollapsed ] = useState(expandable);

    useEffect(() => {
        setError('');
        if (!content) {
            setError('Содержимое отсуствует');
            return;
        }
        try {
            // Распарсим контент
            const delta = JSON.parse(content);
            console.dir(delta);
            // Проверим что есть поле ops
            if (delta.ops === undefined) throw new Error('No ops field found');
            // Просмотрим список иллюстраций в документе и заменим содержимое наших картинок
            // на стандартное для Quill т.к. конвертер про наш формат ничего не знает
            (delta.ops as DeltaOperation[]).forEach(item => {
                if (!item.insert.image) return;
                if (item.attributes?.fid) {
                    item.insert.image = `${API_URL}/files/${item.attributes.fid}`;
                }
                item.attributes = { ...item.attributes, renderAsBlock: true };
            });
            console.dir(delta);
            // Теперь можно конвертировать в html
            const converter = new QuillDeltaToHtmlConverter(delta.ops, { 
                multiLineParagraph: false,
                multiLineBlockquote: false,
            });
            const html = converter.convert();
            setHtml(html);
        } catch {
            setError('Ошибка парсинга');
        }
    }, [ content ]);

    // Проверяем надо ли выводить свернутый вариант
    useEffect(() => {
        if (!refViewer.current || !refWrapper.current) return;
        const viewer = refViewer.current;
        const wrapper = refWrapper.current;
        setСollapsed(viewer.clientHeight > wrapper.clientHeight);
    }, [ refViewer, refWrapper ]);

    if (error) return <div className='error'>{error}</div>;
    if (!expandable) return <div className={CLASS} dangerouslySetInnerHTML={{ __html: html }}/>;
    if (!collapsed) return <div className={CLASS} dangerouslySetInnerHTML={{ __html: html }}/>;

    return (<>
        <div ref={refWrapper} className='QuillViewerWrapper'>
            <div ref={refViewer} className={CLASS} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>
        <div className='QuillViewerExpand'>
            <span className='a' onClick={() => setСollapsed(false)}>Показать целиком...</span>
        </div>
    </>);
};

export default QuillViewer;

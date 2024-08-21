import { FC, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import hljs from 'highlight.js';
import imageHandler from './ImageHandler';
import SaveButton  from './SaveButton';
import { TEditorSaver, TImageUploader } from '../types';
import H3Icon from './H3Icon';
import { formatsFull } from './QuillCore';
import QuillModal from './QuillModal';
import { Alert } from '@alxgrn/react-form';
import EyeIcon from './EyeIcon';
import './QuillEditor.css';

/**
 * Большой редактор для статей
 */

type QuillEditorProps = {
    content: string | null; // Содержимое статьи
    onView: () => void; // Вызывается при клике на кнопку просмотра статьи
    onSave: TEditorSaver; // Вызывается при нажатии на кнопку сохранения статьи
    onChange: (changed: boolean) => void; // Вызывается при изменении текста статьи
    onUpload: TImageUploader; // Вызывается после выбора картинки для загрузки на сервер
};

const QuillEditor: FC<QuillEditorProps> = ({ content, onView, onSave, onChange, onUpload }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [ editor, setEditor ] = useState<Quill|null>(null);
    const [ message, setMessage ] = useState('');
    const [ isAlert, setIsAlert ] = useState(false);
    const [ isChanged, setIsChanged ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    // Инициализация редактора
    useEffect(() => {
        setEditor(null);
        if (!editorRef.current) return;
        if (!toolbarRef.current) return;

        const editor = new Quill(editorRef.current, {
            theme: 'snow',
            //scrollingContainer: 'html', // иначе при вставке текста окно редактора прыгает наверх - убрали в Quill2
            placeholder: 'Начните писать текст здесь',
            formats: formatsFull,
            modules: {
                syntax: {
                    hljs,
                    //highlight: (text: string) => hljs.highlightAuto(text).value,
                },
                toolbar: {
                    // Для добавления кнопки сохранения в тулбар, пришлось городить свой HTML-код
                    // container: toolbarFull,
                    container: toolbarRef.current,
                    handlers: {
                        // наш загрузчик картинок на сервер
                        image: () => imageHandler(editor, onUpload),
                        // заменим дефолтный tooltip для ввода URL на нашу модалку
                        video: () => setIsModalOpen(true),
                    } 
                }
            },
        });

        try {    
            if(content) {
                editor.setContents(JSON.parse(content));
            }
        } catch {
            setMessage('Не могу отпарсить статью!');
            setIsAlert(true);
        }

        editor.history.clear();
        editor.on('text-change', () => { setIsChanged(true); onChange(true); });
        editor.focus();
        setEditor(editor);
        setIsChanged(false);
        onChange(false);

    }, [ editorRef, content ]);

    return (
        <div>
            <div className='QuillToolbar'>
                <div ref={toolbarRef}>
                    <span className='ql-formats'>
                        <button type='button' className='ql-header' value='2'/>
                        <button type='button' className='ql-header' value='3'>
                            <H3Icon/>
                        </button>
                    </span>
                    <span className='ql-formats'>
                        <button type='button' className='ql-bold'/>
                        <button type='button' className='ql-italic'/>
                        <button type='button' className='ql-underline'/>
                        <button type='button' className='ql-strike'/>
                        <button type='button' className='ql-link'/>
                    </span>
                    <span className='ql-formats'>
                        <button type='button' className='ql-blockquote'/>
                        <button type='button' className='ql-code-block'/>
                        <button type='button' className='ql-list' value='ordered'/>
                        <button type='button' className='ql-list' value='bullet'/>
                    </span>
                    <span className='ql-formats'>
                        <button type='button' className='ql-indent' value='-1'/>
                        <button type='button' className='ql-indent' value='+1'/>
                    </span>
                    <span className='ql-formats'>
                        <select className='ql-align'></select>
                    </span>
                    <span className='ql-formats'>
                        <button type='button' className='ql-image'/>
                        <button type='button' className='ql-video'/>
                    </span>
                    <span className='ql-formats'>
                        <button type='button' className='ql-clean'/>
                    </span>
                    <span className='ql-formats'>
                        <button type='button' onClick={() => onView()}>
                            <EyeIcon/>
                        </button>
                    </span>
                </div>
                <div>
                    <SaveButton
                        editor={editor}
                        changed={isChanged}
                        onSave={onSave}
                        onSaved={() => {
                            setIsChanged(false);
                            onChange(false);
                        }}
                    />
                </div>
            </div>

            <div ref={editorRef}/>

            <QuillModal
                type='video'
                editor={editor}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <Alert
                isOpen={isAlert}
                onClose={() => setIsAlert(false)}
                title='Ошибка'
                message={message}
            /> 
            
        </div>
    );
};

export default QuillEditor;

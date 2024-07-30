/**
 * Редактор компактного варианта публикаций и комментариев
 * Если у нас происходит редактирование публикации, то становится доступна загрузка картинок
 */
import { FC, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import hljs from 'highlight.js';
import { formatsShort, toolbarShort } from './QuillCore';
import { TImageUploader, TNotesSaver } from '../types';
import imageHandler from './ImageHandler';
import QuillModal, { TQuillModalType } from './QuillModal';
import './QuillNotes.css';

type QuillNotesProps = {
    title?: boolean | string | null; // нужно ли выводить поле ввода для заголовка публикации и его начальное содержимое
    content?: string | null; // начальный контент редактора
    placeholder?: string; // подсказка в пустом редакторе
    onSave?: TNotesSaver; // нажатие на кнопку сохранения
    onCancel?: () => void; // нажатие на кнопку отмены редактирования
    onUpload?: TImageUploader; // вызывается после выбора картинки для загрузки на сервер
};

const QuillNotes: FC<QuillNotesProps> = ({ content, title = false, placeholder, onSave, onCancel, onUpload }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ name, setName ] = useState('');
    const [ editor, setEditor ] = useState<Quill|null>(null);
    const [ isEditorEmpty, setIsEditorEmpty ] = useState(true);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ modalType, setModalType ] = useState<TQuillModalType>('image');

    useEffect(() => {
        setEditor(null);
        if (!ref.current) return;

        const editor = new Quill(ref.current, {
            theme: 'snow',
            placeholder: placeholder ?? 'Начните писать текст здесь',
            //scrollingContainer: 'html', // иначе при вставке текста окно редактора прыгает наверх - убрали в Quill2
            formats: formatsShort,
            modules: {
                syntax: {
                    hljs,
                    //highlight: (text: string) => hljs.highlightAuto(text).value,
                },
                toolbar: {
                    container: toolbarShort,
                    handlers: {
                        // если разрешено грузить картинки, подключаем выбор файла с диска, иначе запрашиваем URL
                        image: () => {
                            if (onUpload) {
                                imageHandler(editor, onUpload);
                            } else {
                                setModalType('image');
                                setIsModalOpen(true);
                        }},
                        // заменим дефолтный tooltip для ввода URL на нашу модалку
                        video: () => {
                            setModalType('video');
                            setIsModalOpen(true);
                        },
                        // Для ссылки пока не меняем вызов tooltip т.к. надо разбираться
                        // с тем как его показывают при клике на ссылку в редакторе
                        // link: () => {
                        //    setModalType('link');
                        //    setIsModalOpen(true);
                        //},
                    } 
                }
            }
        });

        editor.on('text-change', () => {
            setIsEditorEmpty(editor.getText().trim().length < 1);
        });

        //let content: string | null = null;
        //if (article) content = article.content;
        //if (comment) content = comment.content;

        if (content) {
            try {
                editor.setContents(JSON.parse(content));
            } catch {
                console.error('QuillNotes: Ошибка парсинга контента');
            }
        }

        // Если нужно поле ввода заголовка, инициализируем его значение
        if(title !== false) {
            setName(typeof title === 'string' ? title : '');
        }

        editor.focus();
        setEditor(editor);
    }, [ ref, placeholder ]);

    // Проверка того что требуемые данные введены
    const canSave = () => {
        return !isEditorEmpty && (title !== false ? name.trim().length > 0 : true);
    };

    // Сохранение
    const onBeforeSave = () => {
        if(!editor || !onSave || !canSave()) return;
        const content = JSON.stringify(editor.getContents());
        onSave({ content, title: name, format: 'delta' });
    };

    // Отмена
    const onBeforeCancel = () => {
        if(onCancel) onCancel();
    };

    return (
        <div className='QuillNotes'>
            {(title !== false) &&
            <input
                className='QuillNotesTitle'
                onChange={e => setName(e.currentTarget.value)}
                value={name}
                placeholder='Укажите заголовок'
            />}
            <div className='QuillNotesContent'>
                <div ref={ref}/>
            </div>
            {((onSave || onCancel) && editor) &&
            <div className='QuillNotesButtons'>
                {onCancel && <span className='a' onClick={onBeforeCancel}>Отменить</span>}
                {onSave && <span className={canSave() ? 'button' : 'button disabled'} onClick={onBeforeSave}>Опубликовать</span>}
            </div>}
            <QuillModal
                type={modalType}
                editor={editor}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default QuillNotes;

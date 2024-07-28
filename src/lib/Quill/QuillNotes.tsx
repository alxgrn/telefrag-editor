/**
 * Редактор компактного варианта публикаций и комментариев
 * Если у нас происходит редактирование публикации, то становится доступна загрузка картинок
 */
import { FC, useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import hljs from 'highlight.js';
import { formatsShort, toolbarShort } from './QuillCore';
import { TArticle, TComment, TImageUploader } from '../types';
import './QuillNotes.css';
import imageHandler from './ImageHandler';
import QuillModal from './QuillModal';

type PropsArticle = {
    article?: TArticle;
    comment?: never;
    title?: boolean; // нужно ли выводить поле ввода для заголовка публикации
};

type PropsComment = {
    comment?: TComment;
    article?: never;
    title?: never;
};

type QuillNotesProps = (PropsArticle | PropsComment) & {
    placeholder?: string;
    onSave?: (content: string, title: string) => void;
    onCancel?: () => void;
    onUpload: TImageUploader; // Вызывается после выбора картинки для загрузки на сервер
};

const QuillNotes: FC<QuillNotesProps> = ({ article, comment, placeholder, title, onSave, onCancel, onUpload }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ name, setName ] = useState('');
    const [ editor, setEditor ] = useState<Quill|null>(null);
    const [ isEditorEmpty, setIsEditorEmpty ] = useState(true);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ modalType, setModalType ] = useState<'image'|'video'|'link'>('image');

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
                        // картинки можно грузить только к уже существующим публикациям, но не к комментариям
                        image: () => {
                            if (article) {
                                imageHandler(editor, article.id, onUpload);
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

        let content: string | null = null;
        if (article) content = article.content;
        if (comment) content = comment.content;

        if (content) {
            try {
                editor.setContents(JSON.parse(content));
            } catch {
                console.error('QuillNotes: Ошибка парсинга контента');
            }
        }

        if(article) {
            setName(article.name ?? '');
        }

        editor.focus();
        setEditor(editor);
    }, [ ref, article, comment, placeholder ]);

    // Проверка того что требуемые данные введены
    const canSave = () => {
        return !isEditorEmpty && (title ? name.trim().length > 0 : true);
    };

    // Сохранение
    const onBeforeSave = () => {
        if(!editor || !onSave || !canSave()) return;
        const content = JSON.stringify(editor.getContents());
        onSave(content, name);
    };

    // Отмена
    const onBeforeCancel = () => {
        if(onCancel) onCancel();
    };

    return (
        <div className='QuillNotes'>
            {title &&
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

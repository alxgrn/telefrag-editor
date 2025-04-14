/**
 * Редактор публикации в формате prose
 */
import { FC, useEffect, useRef, useState } from 'react';
import { TImageUploader, TNotesSaver } from '../../types';
import { Button } from '@alxgrn/telefrag-ui';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { startImageUpload } from './ImageUpload';
import { plugins } from './plugins';
import { schema } from './schema';
import './ProseMirror.css';
import './ProseNotes.css';
import './ProseViewer.css';
import './ImageUpload.css';

type ProseNotesProps = {
    title?: boolean | string | null; // нужно ли выводить поле ввода для заголовка публикации и его начальное содержимое
    content?: string | null; // начальный контент редактора
    placeholder?: string; // подсказка в пустом редакторе
    onSave?: TNotesSaver; // нажатие на кнопку сохранения
    onCancel?: () => void; // нажатие на кнопку отмены редактирования
    onUpload?: TImageUploader; // вызывается после выбора картинки для загрузки на сервер
};

const ProseNotes: FC<ProseNotesProps> = ({ title = false, content, onSave, onCancel, onUpload }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ view, setView ] = useState<EditorView|null>(null);
    const [ name, setName ] = useState('');

    // Инициализация
    useEffect(() => {
        if (!ref) return;

        if (title !== false) {
            setName(typeof title === 'string' ? title : '');
        }

        let doc: Node|undefined;
        if (content) {
            try {
                doc = Node.fromJSON(schema, JSON.parse(content));
            } catch (error) {
                console.error(`Can not parse Prose format: ${error}`);
            }
        }

        const state = EditorState.create({
            doc,
            schema: schema,
            plugins: plugins({ schema, floatingMenu: true }),
        });

        const view = new EditorView(ref.current, { state })
        setView(view);
        view.focus();

        return () => {
            if (view) {
                view.destroy();
                setView(null);
            }
        }
    }, [ ref, title, content ]);

    // Проверка того что требуемые данные введены
    const canSave = () => {
        return true;
        //return view && view.state.doc.textContent.length && (title !== false ? name.trim().length > 0 : true);
    };

    // Сохранение
    const onBeforeSave = () => {
        if(!view || !onSave || !canSave()) return;
        const content = JSON.stringify(view.state.doc.toJSON());
        onSave({ content, name, format: 'prose' });
    };

    // Отмена
    const onBeforeCancel = () => {
        if(onCancel) onCancel();
    };

    return (<div className='ProseNotes'>
        {(title !== false) &&
        <input
            className='ProseNotesTitle'
            onChange={e => setName(e.currentTarget.value)}
            value={name}
            placeholder='Укажите заголовок'
        />}

        <div ref={ref} className='ProseNotesContent'/>

        {((onSave || onCancel) && view) &&
        <div className='ProseNotesButtons'>
            <input
                type='file'
                accept='image/*'
                onChange={e => {
                    if (e.target.files?.length && onUpload) {
                        startImageUpload(view, e.target.files[0], schema, onUpload);
                    }
                }}
            />

            {onCancel && <span className='a' onClick={onBeforeCancel}>Отменить</span>}
            {onSave && <Button label='Опубликовать' size='Small' type='Accent' disabled={!canSave()} onClick={onBeforeSave} />}
        </div>}
    </div>);
};

export default ProseNotes;

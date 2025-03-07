/**
 * Компонент редактора с усеченным набором допустимых блоков
 * Применяется для комментариев и всех типов публикаций кроме лонгридов
 */
import { FC } from 'react';
import { TArticle, TComment, TImageUploader, TNotesSaver } from '../types';
import QuillNotes from '../formats/delta/QuillNotes';
import VideoNotes from '../formats/video/VideoNotes';

type PublicationProps = { // Редактирование статьи
    article?: TArticle;
    comment?: never;
    title?: boolean;
} | { // Редактирование комментария
    article?: never;
    comment?: TComment;
    title?: never;
} | { // Создание публикации
    article?: never;
    comment?: never;
    title?: boolean;
};

type NotesProps = PublicationProps & {
    onSave: TNotesSaver; // Вызывается при нажатии на кнопку сохранения
    onCancel?: () => void; // Вызывается при отмене редактирования
    onUpload?: TImageUploader; // Вызывается после выбора картинки для загрузки на сервер
    placeholder?: string; // Подсказка в пустом редакторе
}

const Notes: FC<NotesProps> = ({ article, comment, title, onSave, onCancel, onUpload, placeholder }) => {
    /**
     * Нужно редактировать статью
     * Заголовки только у постов в группы, картинки можно загружать ко всем типам статей
     */
    if (article) {
        switch (article.format) {
            case 'delta':
                return (<QuillNotes
                    title={title === true ? article.name : undefined}
                    content={article.content}
                    onSave={onSave}
                    onCancel={onCancel}
                    onUpload={onUpload}
                    placeholder={placeholder}
                />);
            case 'video':
                return (<VideoNotes
                    article={article}
                    onSave={onSave}
                    onCancel={onCancel}
                    onUpload={onUpload}
                />);
            default:
                return (<div className='p error'>Неизвестный формат статьи</div>);
        }
    }
    /**
     * Нужно редактировать комментарий
     * Заголовков у комментариев нет, картинки загружать нельзя
     */
    if (comment) {
        if (comment.format !== 'delta') {
            return (<div className='p error'>Неизвестный формат комментария</div>);
        }

        return (<QuillNotes
            content={comment.content}
            onSave={onSave}
            onCancel={onCancel}
            placeholder={placeholder}
        />);
    }
    /**
     * Нужно создать публикацию (статью или комментарий)
     * Заголовок определяется флагом, картинки загружать нельзя
     */
    return (<QuillNotes
        title={title}
        onSave={onSave}
        onCancel={onCancel}
        placeholder={placeholder}
    />);
};

export default Notes;

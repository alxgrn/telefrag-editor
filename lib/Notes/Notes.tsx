/**
 * Компонент редактора с усеченным набором допустимых блоков
 * Применяется для комментариев и всех типов публикаций кроме лонгридов
 */
import { FC } from 'react';
import { TArticle, TComment, TImageUploader, TNotesSaver } from '../types';
import QuillNotes from '../Quill/QuillNotes';

type PublicationProps = { // Редактирование статьи
    article: TArticle;
    comment?: never;
    title?: never;
} | { // Редактирование комментария
    article?: never;
    comment: TComment;
    title?: never;
} | { // Создание публикации
    article?: never;
    comment?: never;
    title: boolean;
};

type NotesProps = PublicationProps & {
    onSave: TNotesSaver; // Вызывается при нажатии на кнопку сохранения
    onCancel: () => void; // Вызывается при отмене редактирования
    onUpload: TImageUploader; // Вызывается после выбора картинки для загрузки на сервер
}

const Notes: FC<NotesProps> = ({ article, comment, title, onSave, onCancel, onUpload }) => {
    /**
     * Нужно редактировать статью
     * Заголовки только у постов в группы, картинки можно загружать ко всем типам статей
     */
    if (article) {
        if (article.format !== 'delta') {
            return <div>Неизвестный формат статьи</div>;
        }

        return (<QuillNotes
            title={article.type === 'post' ? article.name : undefined}
            content={article.content}
            onSave={onSave}
            onCancel={onCancel}
            onUpload={onUpload}
        />);
    }
    /**
     * Нужно редактировать комментарий
     * Заголовков у комментариев нет, картинки загружать нельзя
     */
    if (comment) {
        if (comment.format !== 'delta') {
            return (<div>Неизвестный формат комментария</div>);
        }

        return (<QuillNotes
            content={comment.content}
            onSave={onSave}
            onCancel={onCancel}
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
    />);
};

export default Notes;

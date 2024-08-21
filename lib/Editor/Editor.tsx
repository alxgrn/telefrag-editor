/**
 * Компонент редактора с полным набором допустимых блоков
 * Применяется для лонгридов
 */
import { FC } from "react";
import { TArticle, TComment, TEditorSaver, TImageUploader } from "../types";
import QuillEditor from "../Quill/QuillEditor";

type PublicationProps = {
    article: TArticle;
    comment?: never;
} | {
    article?: never;
    comment: TComment;
};

type EditorProps = PublicationProps & {
    onView: () => void; // Вызывается при клике на кнопку просмотра статьи
    onSave: TEditorSaver; // Вызывается при нажатии на кнопку сохранения статьи
    onChange: (changed: boolean) => void; // Вызывается при изменении текста статьи
    onUpload: TImageUploader; // Вызывается после выбора иллюстрации для загрузки на сервер
}

const Editor: FC<EditorProps> = ({ article, comment, onView, onSave, onChange, onUpload }) => {

    if (article) {
        if (article.format !== 'delta') {
            return <div>Неизвестный формат статьи</div>;
        }

        return (<QuillEditor
            content={article.content}
            onView={onView}
            onSave={onSave}
            onChange={onChange}
            onUpload={onUpload}
        />);
    }

    if (comment) {
        if (comment.format !== 'delta') {
            return <div>Неизвестный формат комментария</div>;
        }

        return <div>Редактор комментариев пока недоступен</div>
    }

    return <div>Публикация не указана</div>
};

export default Editor;

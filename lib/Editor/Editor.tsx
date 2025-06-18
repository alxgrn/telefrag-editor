/**
 * Компонент редактора с полным набором допустимых блоков
 * Применяется для лонгридов
 */
import { FC } from "react";
import { TArticle, TComment, TEditorSaver, TImageUploader } from "../types";
import QuillEditor from "../formats/delta/QuillEditor";
import VideoNotes from "../formats/video/VideoNotes";
import { ProseEditor } from "../formats/prose";

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

    if (comment) {
        return <div className='p error'>Редактор комментариев пока недоступен</div>
    }

    if (article) {
        switch (article.format) {
            case 'delta':
                return (<QuillEditor
                    content={article.content}
                    onView={onView}
                    onSave={onSave}
                    onChange={onChange}
                    onUpload={onUpload}
                />);
            case 'video':
                return (<VideoNotes
                    article={article}
                    onSave={onSave}
                    onCancel={onView}
                    //onUpload={onUpload}
                />);
            case 'prose':
                return (<ProseEditor
                    content={article.content}
                    onSave={onSave}
                    onView={onView}
                    onChange={onChange}
                    onUpload={onUpload}
                />);
            default:
                return <div className='p error'>Неизвестный формат статьи</div>;
        }
    }

    return <div className='p error'>Публикация не указана</div>
};

export default Editor;

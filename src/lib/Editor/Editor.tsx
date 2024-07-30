import { FC, useState } from "react";
import { TArticle, TComment, TEditorSaver, TImageUploader } from "../types";
import QuillEditor from "../Quill/QuillEditor";
import Editable from "../components/Editable";

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
    onChange: () => void; // Вызывается при изменении текста статьи
    onUpload: TImageUploader; // Вызывается после выбора картинки для загрузки на сервер
}

const Editor: FC<EditorProps> = ({ article, comment, onView, onSave, onChange, onUpload }) => {
    const [ name, setName ] = useState(article?.name ?? '');
    const [ info, setInfo ] = useState(article?.info ?? '');

    if (article) {
        if (article.format !== 'delta') {
            return <div>Неизвестный формат статьи</div>;
        }

        return (<>
            <h1 style={{ margin: '0' }}>
                <Editable
                    value={name}
                    onChange={setName}
                />
            </h1>
            <div>
                <Editable
                    value={info}
                    onChange={setInfo}
                />
            </div>
            <QuillEditor
                content={article.content}
                onView={onView}
                onSave={onSave}
                onChange={onChange}
                onUpload={onUpload}
            />
        </>);
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

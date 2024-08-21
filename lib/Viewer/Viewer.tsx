import { FC } from "react";
import { TArticle, TComment } from "../types";
import QuillViewer from "../Quill/QuillViewer";

type Props = {
    short?: boolean; // флаг варианта набора тегов у контента - полный или компактный
    article: TArticle | TComment;
    expandable?: boolean; // флаг того надо ли выводить контент свернутым если он слишком длинный
};

const Viewer: FC<Props> = ({ short, article, expandable }) => {
    if (article.format === 'delta') {
        return <QuillViewer content={article.content} short={short} expandable={expandable}/>
    }

    return <div>Неизвестный формат публикации</div>;
};

export default Viewer;

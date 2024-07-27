import { FC } from "react";
import { TArticle, TComment } from "../types";
import QuillViewer from "../Quill/QuillViewer";

type Props = {
    article: TArticle | TComment;
};

const Viewer: FC<Props> = ({ article }) => {
    if (article.format === 'delta') {
        return <QuillViewer article={article}/>
    }

    return <div>Неизвестный формат публикации</div>;
};

export default Viewer;

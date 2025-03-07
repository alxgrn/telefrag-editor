import { FC } from "react";
import { TArticle, TComment } from "../types";
import QuillViewer from "../formats/delta/QuillViewer";
import VideoViewer from "../formats/video/VideoViewer";

type Props = {
    short?: boolean; // флаг варианта набора тегов у контента - полный или компактный
    article: TArticle | TComment;
    expandable?: boolean; // флаг того надо ли выводить контент свернутым если он слишком длинный
};

const Viewer: FC<Props> = ({ short, article, expandable }) => {
    switch (article.format) {
        case 'delta':
            return <QuillViewer content={article.content} short={short} expandable={expandable}/>;
        case 'video':
            return <VideoViewer content={article.content}/>;
        default:
            return <div className='p error'>Неизвестный формат публикации</div>;
    }
};

export default Viewer;

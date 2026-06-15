import { FC, useMemo } from "react";
import { TArticle, TComment } from "../types";
import QuillViewer from "../formats/delta/QuillViewer";
import VideoViewer from "../formats/video/VideoViewer";
import { ProseViewer } from "../formats/prose";

type Props = {
    article: TArticle | TComment;
    // Для delta - флаг варианта набора тегов у контента - полный или компактный
    // Для video - флаг того, что не нужно выводить текст с таймкодами и делать скругленные уголки у плеера
    short?: boolean;
    // Ссылка на картинку обложки
    cover?: string;
};

const Viewer: FC<Props> = ({ article, short, cover }) => {

    const viewer = useMemo(() => {
        switch (article.format) {
            case 'delta':
                return <QuillViewer content={article.content} short={short}/>;
            case 'video':
                return <VideoViewer content={article.content} short={short} cover={cover}/>;
            case 'prose':
                return <ProseViewer content={article.content}/>;
            default:
                return <div className='p error'>Неизвестный формат публикации</div>;
        }
    }, [ article, short ]);

    return viewer;
};

export default Viewer;

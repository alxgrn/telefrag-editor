import { FC, useEffect, useRef, useState } from "react";
import { TArticle, TComment } from "../types";
import QuillViewer from "../formats/delta/QuillViewer";
import VideoViewer from "../formats/video/VideoViewer";
import { ProseViewer } from "../formats/prose";
import './Viewer.css';

type Props = {
    short?: boolean; // флаг варианта набора тегов у контента - полный или компактный
    article: TArticle | TComment;
    expandable?: boolean; // флаг того надо ли выводить контент свернутым если он слишком длинный
};

const Viewer: FC<Props> = ({ short, article, expandable = false }) => {
    const refWrapper = useRef<HTMLDivElement>(null);
    const [ collapsed, setСollapsed ] = useState(expandable);

    useEffect(() => {
        setСollapsed(expandable);
    }, [ short, article, expandable ]);

    useEffect(() => {
        if (!expandable || !refWrapper.current) return;
        const wrapper = refWrapper.current;
        //console.log(`${wrapper.clientHeight} < ${wrapper.scrollHeight}`);
        setСollapsed(wrapper.clientHeight < wrapper.scrollHeight);
    }, [ expandable, refWrapper ]);

    const viewer = () => {
        switch (article.format) {
            case 'delta':
                return <QuillViewer content={article.content} short={short}/>;
            case 'prose':
                return <ProseViewer content={article.content}/>;
            case 'video':
                return <VideoViewer content={article.content}/>;
            default:
                return <div className='p error'>Неизвестный формат публикации</div>;
        }
    };

    if (!expandable) return viewer();

    // ВНИМАНИЕ: Чтобы компонент вьюера не перерисовывался при разворачивании,
    // необходимо чтобы враппер вокруг него оставался, а не убирался из DOM.
    return (<>
        <div ref={refWrapper} className={collapsed ? 'ViewerWrapper' : undefined}>
            {viewer()}
        </div>
        {collapsed && <div className='ViewerExpand'>
            <span className='a' onClick={() => setСollapsed(false)}>Показать целиком...</span>
        </div>}
    </>);
};

export default Viewer;

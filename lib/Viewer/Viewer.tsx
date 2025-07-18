import { FC, useEffect, useMemo, useRef, useState } from "react";
import { TArticle, TComment } from "../types";
import QuillViewer from "../formats/delta/QuillViewer";
import VideoViewer from "../formats/video/VideoViewer";
import { ProseViewer } from "../formats/prose";
import './Viewer.css';
// Максимальная высота свернутого компонента
// Должна совпадать с уазанным в CSS
const MAX_HEIGHT = 300;

type Props = {
    short?: boolean; // флаг варианта набора тегов у контента - полный или компактный
    article: TArticle | TComment;
    expandable?: boolean; // флаг того надо ли выводить контент свернутым если он слишком длинный
};

const Viewer: FC<Props> = ({ short, article, expandable = false }) => {
    const refWrapper = useRef<HTMLDivElement>(null);
    const [ collapsed, setСollapsed ] = useState(true);

    useEffect(() => {
        setСollapsed(true);
    }, [ short, article, expandable ]);

    useEffect(() => {
        if (!refWrapper.current) return;
        const wrapper = refWrapper.current;
        //console.log(`${wrapper.clientHeight} < ${wrapper.scrollHeight} ${collapsed}`);
        setСollapsed(wrapper.scrollHeight > MAX_HEIGHT);
    }, [ refWrapper.current ]);

    const viewer = useMemo(() => {
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
    }, [ article, short ]);

    if (!expandable) return viewer;

    // ВНИМАНИЕ: Чтобы компонент вьюера не перерисовывался при разворачивании,
    // необходимо чтобы враппер вокруг него оставался, а не убирался из DOM.
    return (<>
        <div ref={refWrapper} className={collapsed ? 'ViewerWrapper' : undefined}>
            {viewer}
        </div>
        {collapsed && <div className='ViewerExpand'>
            <span className='a' onClick={() => setСollapsed(false)}>Показать целиком...</span>
        </div>}
    </>);
};

export default Viewer;

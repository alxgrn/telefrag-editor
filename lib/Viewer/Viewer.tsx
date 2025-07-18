import { FC, useEffect, useMemo, useRef, useState } from "react";
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
    const [ collapsed, setСollapsed ] = useState(true);

    useEffect(() => {
        setСollapsed(true);
    }, [ short, article, expandable ]);

    // Так до конца и не понятно насколько это хороший механизм проверки
    // того что содержимое статьи превышает максимальную высоту в ленте.
    // Проблема в том, что в начальный момент, когда враппер уже есть,
    // сам вьер еще может быть не отрисован или не имеет действительную
    // высоту.
    useEffect(() => {
        if (!expandable || !collapsed) return;
        const wrapper = refWrapper.current;
        if (!wrapper) return;
        const viewer = wrapper.firstElementChild;
        if (!viewer) return;
        if (wrapper.clientHeight >= viewer.clientHeight) setСollapsed(false);
    }, [ refWrapper, expandable, collapsed ]);

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

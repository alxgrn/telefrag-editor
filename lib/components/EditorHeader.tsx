/**
 * Компонент для отображения и редактирования названия, аннотации и обложки лонгрида
 */
import { FC, useState } from "react";
import { TArticle, TImageUploader } from "../types";
import EditorCover from "./EditorCover";
import { Editable } from "@alxgrn/react-form";
import './EditorHeader.css';

type Props = {
    article: TArticle;
    onUpload: TImageUploader;
}

const EditorHeader: FC<Props> = ({ article, onUpload }) => {
    const [ name, setName ] = useState(article.name ?? '');
    const [ info, setInfo ] = useState(article.info ?? '');

    return (
        <div className='EditorHeader'>
            <div className='EditorText'>
                <h1 style={{ margin: '0' }}>
                    <Editable
                        value={name}
                        placeholder='Заголовок'
                        onChange={setName}
                        // empty
                    />
                </h1>
                <div>
                    <Editable
                        value={info}
                        placeholder='Аннотация'
                        onChange={setInfo}
                        // empty
                    />
                </div>
            </div>
            <EditorCover article={article} onUpload={onUpload}/>
        </div>
    );
};

export default EditorHeader;

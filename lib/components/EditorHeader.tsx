/**
 * Компонент для отображения и редактирования названия, аннотации и обложки лонгрида
 */
import { CSSProperties, FC, useState } from "react";
import { TArticle, TImageUploader } from "../types";
import EditorCover from "./EditorCover";
import { Editable } from "@alxgrn/react-form";
import './EditorHeader.css';

type Props = {
    article: TArticle;
    onChange: (name: string, info: string) => void;
    onUpload: TImageUploader;
}

const EditorHeader: FC<Props> = ({ article, onChange, onUpload }) => {
    const [ name, setName ] = useState(article.name ?? '');
    const [ info, setInfo ] = useState(article.info ?? '');
    const style: CSSProperties = {
        color: 'var(--alxgrn-input-color-focus)',
        backgroundColor: 'var(--alxgrn-input-bg-focus)',
        borderRadius: 'var(--unit-small)',
    };

    return (
        <div className='EditorHeader'>
            <div className='EditorText'>
                <h1 style={{ margin: '0' }}>
                    <Editable
                        value={name}
                        style={style}
                        placeholder='Заголовок'
                        onChange={name => {
                            setName(name);
                            onChange(name, info);
                        }}
                        // empty
                    />
                </h1>
                <div>
                    <Editable
                        value={info}
                        style={style}
                        placeholder='Аннотация'
                        onChange={info => {
                            setInfo(info);
                            onChange(name, info);
                        }}
                        // empty
                    />
                </div>
            </div>
            <EditorCover article={article} onUpload={onUpload}/>
        </div>
    );
};

export default EditorHeader;

import { useEffect, useState } from 'react';
import { article as initialArticle } from './article';
import { Editor, Notes, Viewer } from '../lib';
import { Button } from '@alxgrn/react-form';
import { TArticle } from '../lib/types';
import EditorHeader from '../lib/components/EditorHeader';
import './App.css'

type ArticleResponse = { article: TArticle };

const App = () => {
    const [ article, setArticle ] = useState<TArticle>(initialArticle);
    const [ isViewer, setIsViewer ] = useState(false);
    const [ isEditor, setIsEditor ] = useState(false);
    const [ isChanged, setIsChanged ] = useState(false);

    useEffect(() => {
        fetch('https://dailytelefrag.ru/api/articles/20')
        .then(response => response.json())
        .then(json => setArticle((json as ArticleResponse).article));
    }, []);

    if (isViewer) {
        return (<>
            <div className='toolbar'>
                <Button label='Редактировать' onClick={() => setIsViewer(false)}/>
            </div>
            <h1 style={{margin: '0'}}>{article.name}</h1>
            <div style={{marginBottom: '1rem'}}><i>{article.info}</i></div>
            <Viewer article={article}/>
        </>);
    } else {
        return (<>
            <div className='toolbar'>
                <Button label={isEditor ? 'Краткий' : 'Полный'} onClick={() => setIsEditor(b => !b)}/>&nbsp;
                <Button label={isChanged ? 'Изменено' : 'Исходник'} type={isChanged ? 'Error' : 'Success'}/>
            </div>
            {isEditor
            ? <>
                <EditorHeader
                    article={article}
                    onChange={(name, info) => setArticle({...article, name, info })}
                    onUpload={() => new Promise(function(resolve) {
                        // Имитируем загрузку картинки на сервер и возврат ее идентификатора
                        setTimeout(() => resolve(1410), 1000);
                    })}
                />
                <Editor
                    article={article}
                    onView={() => setIsViewer(true)}
                    onChange={() => setIsChanged(true)}
                    onSave={(data) => new Promise(function(resolve) {
                            setArticle({ ...article, content: data.content, format: data.format });
                            setIsViewer(true);
                            setIsChanged(false);
                            console.dir(data.content);
                            // Имитируем успешное завершение сохранения на сервер
                            setTimeout(() => resolve(undefined), 1000);
                    })}
                    onUpload={() => new Promise(function(resolve) {
                        // Имитируем загрузку картинки на сервер и возврат ее идентификатора
                        setTimeout(() => resolve(413), 1000);
                    })}
                />
            </>
            : <Notes
                article={article}
                onCancel={() => setIsViewer(true)}
                onUpload={() => new Promise(function(resolve) {
                    setTimeout(() => resolve("Не могу загрузить картинку"), 1000);
                })}
                onSave={(data) => {
                    setArticle({ ...article, content: data.content, format: data.format });
                    setIsViewer(true);
                    console.dir(data.content);
                }}
            />}
        </>);
    }
}

export default App

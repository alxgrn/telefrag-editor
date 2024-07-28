import { useState } from 'react';
import './App.css'
import { article as initialArticle } from './article';
import { Editor, Viewer } from './lib';
import { Button } from '@alxgrn/react-form';
import { TArticle } from './lib/types';
import QuillNotes from './lib/Quill/QuillNotes';

function App() {
    const [ article, setArticle ] = useState<TArticle>(initialArticle);
    const [ isViewer, setIsViewer ] = useState(false);
    const [ isEditor, setIsEditor ] = useState(false);


    if (isViewer) {
        return (<>
            <div className='toolbar'>
                <Button label='Редактировать' onClick={() => setIsViewer(false)}/>
            </div>
            <Viewer article={article}/>
        </>);
    } else {
        return (<>
            <div className='toolbar'>
                <Button label={isEditor ? 'Краткий' : 'Полный'} onClick={() => setIsEditor(b => !b)}/>
            </div>
            {isEditor
            ? <Editor
                article={article}
                onView={() => setIsViewer(true)}
                onChange={() => {}}
                onSave={(content, format) => new Promise(function(resolve) {
                        setArticle({ ...article, content, format });
                        setIsViewer(true);
                        console.dir(content);
                        // Имитируем успешное завершение сохранения на сервер
                        setTimeout(() => resolve(undefined), 1000);
                })}
                onUpload={() => new Promise(function(resolve) {
                    // Имитируем загрузку картинки на сервер и возврат ее идентификатора
                    setTimeout(() => resolve(413), 1000);
                })}
            />
            : <QuillNotes
                article={article}
                onUpload={() => new Promise(function(resolve) {
                    setTimeout(() => resolve("Не могу загрузить картинку"), 1000);
                })}
            />}
        </>);
    }
}

export default App

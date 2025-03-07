import { useState } from 'react';
import { delta as initialDelta, video as initialVideo } from './article';
import { Editor, Notes, Viewer } from '../lib';
import { TArticle } from '../lib/types';
import EditorHeader from '../lib/components/EditorHeader';
import ModeSelector from './ModeSelector';
import './App.css'

//type ArticleResponse = { article: TArticle };

const App = () => {
    const [ delta, setDelta ] = useState<TArticle>(initialDelta);
    const [ video, setVideo ] = useState<TArticle>(initialVideo);
    const [ isChanged, setIsChanged ] = useState(false);
    const [ mode, setMode ] = useState<string|undefined>('QuillViewer');
/*
    useEffect(() => {
        fetch('https://dailytelefrag.ru/api/articles/20')
        .then(response => response.json())
        .then(json => setArticle((json as ArticleResponse).article));
    }, []);
*/
    if (mode === 'QuillViewer') return (<>
        <ModeSelector mode={mode} onChange={setMode}/>
        <h1 style={{margin: '0'}}>{delta.name}</h1>
        <div style={{marginBottom: '1rem'}}><i>{delta.info}</i></div>
        <Viewer article={delta}/>
    </>);

    if (mode === 'VideoViewer') return (<>
        <ModeSelector mode={mode} onChange={setMode}/>
        <h1 style={{margin: '0'}}>{video.name}</h1>
        <div style={{marginBottom: '1rem'}}><i>{video.info}</i></div>
        <Viewer article={video}/>
    </>);

    if (mode === 'QuillNotes') return (<>
        <ModeSelector mode={mode} onChange={setMode}/>
        <Notes
            article={delta}
            onCancel={() => setMode('QuillViewer')}
            onUpload={() => new Promise(function(resolve) {
                setTimeout(() => resolve("Не могу загрузить картинку"), 1000);
            })}
            onSave={(data) => {
                setDelta({ ...delta, content: data.content, format: data.format });
                setMode('QuillViewer')
                console.dir(data.content);
            }}
        />
    </>);

    if (mode === 'VideoNotes') return (<>
        <ModeSelector mode={mode} onChange={setMode}/>
        <Notes
            article={video}
            onCancel={() => setMode('VideoViewer')}
            onUpload={() => new Promise(function(resolve) {
                setTimeout(() => resolve("Не могу загрузить картинку"), 1000);
            })}
            onSave={(data) => {
                setVideo({ ...video, content: data.content, format: data.format });
                setMode('VideoViewer')
                console.dir(data.content);
            }}
        />
    </>);

    if (mode === 'QuillEditor') return (<>
        <ModeSelector mode={mode} onChange={setMode} changed={isChanged}/>
        <EditorHeader
            article={delta}
            onChange={(name, info) => setDelta({...delta, name, info })}
            onUpload={() => new Promise(function(resolve) {
                // Имитируем загрузку картинки на сервер и возврат ее идентификатора
                setTimeout(() => resolve(1410), 1000);
            })}
        />
        <Editor
            article={delta}
            onView={() => setMode('QuillViewer')}
            onChange={() => setIsChanged(true)}
            onSave={(data) => new Promise(function(resolve) {
                    setDelta({ ...delta, content: data.content, format: data.format });
                    setMode('QuillViewer')
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
    </>);

    return (<>
        <ModeSelector mode={mode} onChange={setMode}/>
        <div>Выберите режим</div>
    </>);
}

export default App

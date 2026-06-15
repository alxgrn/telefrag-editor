import { useState } from 'react';
import { delta as initialDelta, video as initialVideo, prose as initialProse } from './articles';
import { Editor, Notes, Viewer } from '../lib';
import { TArticle } from '../lib/types';
import EditorHeader from '../lib/components/EditorHeader';
import ModeSelector from './ModeSelector';
import './App.css'
import { Expandable } from '@alxgrn/telefrag-ui';
//import { getImageIdsFromProse } from '../lib/formats/prose/utils';

const App = () => {
    const [ article, setArticle ] = useState<TArticle>(initialProse);
    const [ isChanged, setIsChanged ] = useState(false);
    const [ mode, setMode ] = useState<string>('editor');
    const [ format, setFormat ] = useState<string>('prose');

    const onChange = (newMode: string, newFormat: string) => {
        setMode(newMode);
        setFormat(newFormat);
        if (newFormat === format) return;
        switch (newFormat) {
            case 'delta':
                setArticle(initialDelta);
                break;
            case 'video':
                setArticle(initialVideo);
                break;
            case 'prose':
                setArticle(initialProse);
                break;
            default:
                break;
        }
    };

    if (mode === 'viewer') return (<>
        <ModeSelector mode={mode} format={format} onChange={onChange}/>
        <h1 style={{margin: '0'}}>{article.name}</h1>
        <div style={{marginBottom: '1rem'}}><i>{article.info}</i></div>
        <Expandable aspectRatio='16x9'>
            <Viewer article={article} cover={'https://dailytelefrag.ru/api/files/413'}/>
        </Expandable>
    </>);

    if (mode === 'notes') return (<>
        <ModeSelector mode={mode} format={format} onChange={onChange}/>
        <Notes
            article={article}
            onCancel={() => setMode('viewer')}
            onUpload={() => new Promise(function(resolve) {
                setTimeout(() => resolve(1410), 1000);
            })}
            onSave={(data) => {
                setArticle({ ...article, content: data.content, format: data.format });
                setMode('viewer')
                console.dir(data.content);
                // getImageIdsFromProse(data.content);
            }}
        />
    </>);

    if (mode === 'editor') return (<>
        <ModeSelector mode={mode} format={format} onChange={onChange} changed={isChanged}/>
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
            onChange={(b) => setIsChanged(b)}
            onView={() => {
                setMode('viewer');
                setIsChanged(false);
            }}
            onSave={(data) => new Promise(function(resolve) {
                    setArticle({ ...article, content: data.content, format: data.format });
                    setMode('viewer');
                    setIsChanged(false);
                    console.log(JSON.stringify(data.content));
                    // getImageIdsFromProse(data.content);
                    // Имитируем успешное завершение сохранения на сервер
                    setTimeout(() => resolve(undefined), 1000);
            })}
            onUpload={() => new Promise(function(resolve) {
                // Имитируем загрузку картинки на сервер и возврат ее идентификатора
                setTimeout(() => resolve(413), 1000);
                // setTimeout(() => resolve('Error'), 1000);
            })}
        />
    </>);

    return (<>
        <ModeSelector mode={mode} format={format} onChange={onChange}/>
        <div>Выберите режим</div>
    </>);
}

export default App

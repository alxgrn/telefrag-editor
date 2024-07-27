import { useState } from 'react';
import './App.css'
//import Viewer from './lib/Viewer/Viewer';
import { article } from './article';
import { Editor, Viewer } from './lib';
import { Button } from '@alxgrn/react-form';

function App() {
    const [ isViewer, setIsViewer ] = useState(true);

    if (isViewer) {
        return (<>
            <Button label='Редактировать' onClick={() => setIsViewer(false)}/><br/><br/>
            <Viewer article={article}/>
        </>);
    } else {
        return (<Editor
            article={article}
            onView={() => setIsViewer(true)}
            onChange={() => {}}
            onSave={() => new Promise(function(resolve) {
                setTimeout(() => resolve(undefined), 1000);
            })}
            onUpload={() => new Promise(function(resolve) {
                setTimeout(() => resolve("Не могу загрузить картинку"), 1000);
            })}
        />);
    }
}

export default App

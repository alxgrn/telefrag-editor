/**
 * Кнопка сохранение документа
 */
import { FC, useState } from 'react';
import Quill from 'quill';
import { Alert } from '@alxgrn/react-form';
import { TArticleSaver } from '../types';

type SaveButtonProps = {
    article_id: number;
    changed: boolean;
    editor?: Quill|null;
    onSaved: () => void;
    onSave: TArticleSaver;
}

export const SaveButton: FC<SaveButtonProps> = ({ article_id, editor, changed, onSaved, onSave }) => {
    const [ error, setError ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);
    const [ showError, setShowError ] = useState(false);

    const onBeforeSave = async () => {
        if(!editor) return;
        editor.disable();
		setIsLoading(true);
        setError('');
        try {
            const content = JSON.stringify(editor.getContents());
            const result = await onSave(content, 'delta', article_id);
            if(result) {
                setError(result);
            } else {
                // Сбрасываем историю чтобы не было возврата к версии до сохранения
                // т.к. в ней могут быть удаленные при сохранении лишние картинки
                editor.getModule('history').clear();
                onSaved();
            }
        } catch {
            setError('Что-то не так с текстом статьи');
        }
        setIsLoading(false);
        editor.enable();
        editor.focus();
    };

    const closeError = () => {
        setError('');
        setShowError(false);
    };

    if (!editor) return <span className='QuillSaveButton Disabled'>...</span>;
    if (!changed) return <span className='QuillSaveButton Disabled'>Сохранено</span>;

    if(error) return (
        <>
            <span className='QuillSaveButton Disabled' onClick={() => setShowError(true)}>Ошибка</span>
            <Alert
                isOpen={showError}
                onClose={closeError}
                title='Ошибка'
                message={error}
            />
        </>
    );

    if(isLoading) {
        return <span className='QuillSaveButton Disabled'>Сохраняю...</span>;
    } else {
        return <span className='QuillSaveButton' onClick={() => onBeforeSave()}>Сохранить</span>;
    }
};

export default SaveButton;

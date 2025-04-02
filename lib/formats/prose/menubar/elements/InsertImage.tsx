/**
 * Вставка картинки
 */
import { FC, useEffect, useState } from 'react';
import { Form, Icons, Image, Input, Modal } from '@alxgrn/telefrag-ui';
import { useEditorEventCallback } from '@handlewithcare/react-prosemirror';
import { Schema } from 'prosemirror-model';
import { startImageUpload } from '../../ImageUpload';

export interface Props {
    schema: Schema;
    isOpen: boolean;
    onClose: () => void;
}

const InsertImage: FC<Props> = ({ schema, isOpen, onClose }) => {
    const [ image, setImage ] = useState<File|undefined>(undefined);
    const [ title, setTitle ] = useState('');

    useEffect(() => {
        setTitle('');
        setImage(undefined);
    }, [ isOpen ]);

    const onFormSubmit = useEditorEventCallback((view) => {
        if (!view || !image) return;
        startImageUpload(view, image, schema, title);
        view.focus();
        onClose();
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h1>Вставка картинки</h1>
			<Form
				submit='Вставить'
                submitType='Success'
				onSubmit={onFormSubmit}
                onCancel={onClose}
			>
                <Image
                    id='image'
                    value={image}
                    onChange={setImage}
                    text={<span><Icons.Image/><br/>Выберите файл</span>}
                    required
                    label='Картинка'
                />
				<Input
					id='value'
					value={title}
					onChange={setTitle}
                    label='Подпись'
				/>
			</Form>
        </Modal>
    );
};

export default InsertImage;

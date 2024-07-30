/**
 * Всплывающее окно для ввода URL ссылки, картинки или видео
 */
import { FC, useEffect, useState } from 'react';
import Quill from 'quill';
import { Form, Input, Modal } from '@alxgrn/react-form';

const MAX_VALUE_LENGTH = 1024;

const text = {
    image: {
        title: 'Укажите ссылку на картинку',
        hint: undefined,
    },
    video: {
        title: 'Укажите ссылку на видео',
        hint: 'Поддерживаются: YouTube, RuTube, VK Video',
    },
    link: {
        title: 'Укажите URL ссылки',
        hint: undefined,
    }    
};

export type TQuillModalType = 'image'|'video'|'link';

type Props = {
    type: TQuillModalType;
    editor?: Quill | null;
    isOpen: boolean;
    onClose: () => void;
}

const QuillModal: FC<Props> = ({ type, editor, isOpen, onClose }) => {
    const [ value, setValue ] = useState('');

    useEffect(() => {
        setValue('');
    }, [ isOpen ]);

    const onSubmit = () => {
        if (editor) {
            const range = editor.getSelection(true);
            const tvalue = value.trim();
    
            if (tvalue && range) {
                if (type === 'link') {
                    editor.formatText(range.index, range.length, 'link', tvalue, Quill.sources.USER);
                } else {
                    editor.insertEmbed(range.index, type, tvalue, Quill.sources.USER);
                    editor.setSelection(range.index + 1, 0);
                }
            }
        }

        onClose();
    };

    if (!editor) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h1>{text[type].title}</h1>
			<Form
				submit='Сохранить'
				onSubmit={onSubmit}
			>
				<Input
					id='value'
					required={true}
					value={value}
					onChange={setValue}
					limit={MAX_VALUE_LENGTH}
                    bottom={text[type].hint}
                    autoFocus
				/>
			</Form>
        </Modal>
    );
};

export default QuillModal;

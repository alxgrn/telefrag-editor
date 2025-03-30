/**
 * Блок кнопок в меню
 */
import { FC, useEffect } from 'react';
import MenuBlock from './MenuBlock';
import { Schema } from "prosemirror-model";
import { TMenuItem } from './MenuItem';
import { EditorView } from 'prosemirror-view';
import './MenuBar.css';

type Props = {
    schema: Schema;
    items: TMenuItem[][];
    view: EditorView;
};

const MenuBar: FC<Props> = ({ schema, view, items }) => {

    //const dispatchTransaction = (tx: any) => {
    //    const editorState = this.state.editorState.apply(tx);
    //    this.setState({editorState});
    //};

    // Определим какие кнопки нужны в меню
    useEffect(() => {

    }, [ schema ]);

    return (<div className='MenuBar'>
        {items.map((item, index) => <MenuBlock key={index} items={item} view={view}/>)}
    </div>);
};

export default MenuBar;

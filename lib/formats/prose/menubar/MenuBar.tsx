import { FC } from 'react';
import { Schema } from "prosemirror-model";
import HeaderMenu from './elements/HeaderMenu';
import MakeBlockMenu from './elements/MakeBlockMenu';
import InlineMarks from './elements/InlineMarks';
import UndoRedo from './elements/UndoRedo';
import WrapBlockMenu from './elements/WrapBlockMenu';
import InsertBlocks from './elements/InsertBlocks';
import BlockCommands from './elements/BlockCommands';
import './MenuBar.css';

type Props = {
    schema: Schema;
};

export const MenuBar: FC<Props> = ({ schema }) => (
    <div className='MenuBar'>    
        <div className='MenuBlock'>
            <HeaderMenu schema={schema}/>
            <MakeBlockMenu schema={schema}/>
        </div>
        <InlineMarks schema={schema}/>
        <InsertBlocks schema={schema}/>
        <WrapBlockMenu schema={schema}/>
        <BlockCommands/>
        <UndoRedo/>
    </div>
);

export default MenuBar;

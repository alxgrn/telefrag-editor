import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

type Align = 'left'|'right'|'center'|'justify';

const Paragraph: FC<Props> = ({ node }) => (
    <p style={{ textAlign: node.attrs?.align as Align}}>
        {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
    </p>
);

export default Paragraph;

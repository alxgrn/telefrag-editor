
type Node = {
    type: string;
    content: Node[];
    attrs?: {
        [name: string]: string;
    };
};
/**
 * Отдает список всех идентификаторов изображений из документа
 * @param content сериализованный в строку контент в формате prose
 * @returns массив цифровых идентификаторов изображений в статье или `undefined` в случае ошибки
 */
export const getImageIdsFromProse = (content: string) => {
    try {
        const ids: number[] = [];
        const doc = JSON.parse(content);
        if (typeof doc !== 'object') throw new Error('Content is not object');
        if (doc.type !== 'doc') throw new Error('Content type does not have doc value');
        // console.dir(doc);
        // Рекурсивная функция обхода узлов     
        function descendants (node: Node, prefix: string) {
            // console.log(`${prefix} ${node.type}`);
            if (node.type === 'image' && node.attrs?.fid) {
                // fid в image может быть null|number|string|undefined
                const fid = parseInt(node.attrs?.fid + '');
                if (!isNaN(fid)) ids.push(fid);
            }
            if (!Array.isArray(node.content)) return;
            node.content.forEach(node => descendants(node, `${prefix}-`));
        };
        descendants(doc as Node, '-');
        console.log(ids);
        return ids;
    } catch (error) {
        console.error(`getImagesFromProse: ${error}`);
    }
};

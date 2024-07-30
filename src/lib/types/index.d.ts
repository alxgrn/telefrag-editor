/**
 * Статья
 */
export type TArticleType = 'long'|'blog'|'post';
export type TArticle = {
    id: number;
    type: TArticleType;
    user_id: number;
    cover_id: number | null;
    name: string|null;
    info: string|null;
    format: string|null;
    content: string|null;
    comments: number;
    created: string;
    modified: string;
    published: string|null;
    commented: string|null;
    is_published: boolean;
    likes_num: number;
    likes_sum: number;
};
/**
 * Комментарий
 */
export type TComment = {
    id: number;
    user_id: number;
    article_id: number;
    reply_to: number|null;
    replies: number;
    format: string;
    content: string;
    created: string;
    modified: string;
    replied: string|null;
    likes_num: number;
    likes_sum: number;
};
/**
 * Публикация
 * Это то, что мы получаем из редактора
 */
export type TPublicationFormat = 'delta';
export type TPublication = {
    format: TPublicationFormat;
    title?: string;
    content: string;
};
/**
 * Функция обновления содержимого статьи в большом редакторе
 * Возвращает undefined или сообщение об ошибке
 */
export type TEditorSaver = (data: TPublication) => Promise<string | undefined>;
/**
 * Функция обновления содержимого статьи в кратком редакторе
 */
export type TNotesSaver = (data: TPublication) => void;
/**
 * Функция загрузки картинки на сервер
 * Редактор дергает эту функцию, когда надо вставить картинку с диска
 * Возвращает идентификатор созданного файла картинки или сообщение об ошибке
 */
export type TImageUploader = (image: File) => Promise<number | string>;
/**
 * Функции создания и обновления публикации
 */
export type TCreatePublication = (data: TPublication) => void;
export type TUpdatePublication = (data: TPublication, publication_id: number) => void;
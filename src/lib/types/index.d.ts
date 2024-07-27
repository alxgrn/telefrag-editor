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
 * Функция загрузки картинки на сервер
 * Возвращает идентификатор созданного файла картинки или сообщение об ошибке
 */
export type TImageUploader = (image: File, article_id: number) => Promise<number | string>;
/**
 * Функция обновления содержимого статьи
 * Возвращает идентификатор созданного файла картинки или сообщение об ошибке
 */
export type TArticleFormat = 'delta';
export type TArticleSaver = (content: string, format: TArticleFormat, article_id: number) => Promise<string | undefined>;

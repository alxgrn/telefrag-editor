import { API_URL, EMPTY_IMAGE, VIDEO_IMAGE } from "../config";

/**
 * Преобразовывает полученный URL в формат пригодный для embed
 * @param stringURL 
 * @returns 
 */
export const sanitizeVideoURL = (stringURL: string) => {
    try {
        const url = new URL(stringURL);
        switch (url.hostname) {
            case 'vk.com': {
                let id: string | null;
                let oid: string | null;
                if (url.pathname === '/video_ext.php') {
                    // https://vk.com/video_ext.php?oid=197204573&id=456240080&hd=2
                    id = url.searchParams.get('id');
                    oid = url.searchParams.get('oid');
                } else if (url.pathname.startsWith('/video')) {
                    // https://vk.com/video-197204573_456240080
                    [ oid, id ] = url.pathname.slice(6).split('_');
                } else {
                    throw new Error();
                }
                if (!id || !oid) throw new Error();
                return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`;
            }
            case 'rutube.ru': {
                let videoId: string | null;
                if (url.pathname.startsWith('/video/')) {
                    // https://rutube.ru/video/cfdd6f62bb1bc0d071254e2500b535df/?r=wd
                    videoId = url.pathname.split('/')[2];
                } else if (url.pathname.startsWith('/play/embed/')) {
                    // https://rutube.ru/play/embed/8a6e620229308fc3a2aaa07c2692400c
                    videoId = url.pathname.split('/')[3];
                } else {
                    throw new Error();
                }
                if (!videoId) throw new Error();
                return `https://rutube.ru/play/embed/${videoId}`;
            }
            case 'youtube.com':
            case 'www.youtube.com': {
                let videoId: string | null;
                if (url.pathname === '/watch') {
                    // https://www.youtube.com/watch?v=gDSU6okPKXI
                    videoId = url.searchParams.get('v');
                } else if (url.pathname.startsWith('/live/')) {
                    // https://www.youtube.com/live/1dbTOwhNJpY?si=zrNveKUHRldx9h_q
                    videoId = url.pathname.split('/')[2];
                } else if (url.pathname.startsWith('/embed/')) {
                    // https://www.youtube.com/embed/gDSU6okPKXI?showinfo=0
                    videoId = url.pathname.split('/')[2];
                } else {
                    throw new Error();
                }
                if (!videoId) throw new Error();
                return `https://www.youtube.com/embed/${videoId}`;
            }
            case 'youtu.be':
                // https://youtu.be/gDSU6okPKXI?si=xurCvObeXVM3lJ8A
                return `https://www.youtube.com/embed${url.pathname}`;
            default:
                throw new Error();
        }
    } catch {
        return '';
    }
};
/**
 * Запрос ссылки на миниатюру видео
 * @param videoURL ссылка на видеоплеер обработанная через sanitizeVideoURL
 */
export const getVideoPreview = (videoURL: string) => {
    try {
        const url = new URL(videoURL);
        switch (url.hostname) {
            case 'www.youtube.com': {
                // `https://www.youtube.com/embed/${videoId}`
                const videoId = url.pathname.split('/')[2];
                return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
            case 'rutube.ru': {
                // `https://rutube.ru/play/embed/${videoId}`
                const videoId = url.pathname.split('/')[3];
                return `https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1`;
            }
            default:
                throw new Error();
        }
    } catch {
        return VIDEO_IMAGE;
    }
};
/**
 * Преобразует входные данные в URL пригодный для IMG
 * @param url строка с URL или идентификатор картинки на сервере или NULL
 * @returns URL картинки
 */
export const sanitizeImageURL = (url?: string | number | null) => {
    if (typeof url === 'string') return url;
    if (typeof url === 'number') return `${API_URL}/files/${url}`;
    return EMPTY_IMAGE;
};

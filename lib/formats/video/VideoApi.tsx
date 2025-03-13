/**
 * Загрузчик API для плееров VK и YouTube
 * За основу взята загрузка из https://github.com/gajus/youtube-player
 */
import load from 'load-script';

export type YouTubePlayer = {
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
};

export type YouTubeIframeApiType = {
    Player: any,
};

export type VkVideoIframeApiType = {
    VideoPlayer: Function,
};

declare global {
    interface Window {
        YT?: YouTubeIframeApiType;
        VK?: VkVideoIframeApiType;
        onYouTubeIframeAPIReady?: () => void;
    }
};

export const loadYouTubeIframeApi = (): Promise<YouTubeIframeApiType> => {
    /**
     * A promise that is resolved when window.onYouTubeIframeAPIReady is called.
     * The promise is resolved with a reference to window.YT object.
     */
    const iframeAPIReady = new Promise<YouTubeIframeApiType>((resolve, reject) => {
        // Проверяем не было ли API уже загружено ранее, если было, сразу возвращаем его
        if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
            resolve(window.YT);
            return;
        }        
        // Скрипт API еще не был загружен ранее, но могла быть кем-то создана
        // функция инициализации, сохраним ее для последующего вызова.
        const previous = window.onYouTubeIframeAPIReady;
        // Создадим свою функцию инициализации API и будем в ней ждать загрузки.
        window.onYouTubeIframeAPIReady = () => {
            if (previous) {
                previous();
            }
            // console.log(`onYouTubeIframeAPIReady called`);
            // Тут window.YT уже должен быть определен
            resolve(window.YT as YouTubeIframeApiType);
        };
        // Загружаем скрипт для работы с API
        const protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';
        load(protocol + '//www.youtube.com/iframe_api', (error) => {
            if (error) {
                reject(error);
                return;
            }
        });
    });

    return iframeAPIReady;
};


export const loadVkVideoIframeApi = (): Promise<VkVideoIframeApiType> => {
    // The promise is resolved with a reference to window.VK object.
    const iframeAPIReady = new Promise<VkVideoIframeApiType>((resolve, reject) => {
        // Проверяем не было ли API уже загружено ранее, если было, сразу возвращаем его
        if (window.VK && window.VK.VideoPlayer && window.VK.VideoPlayer instanceof Function) {
            resolve(window.VK);
            return;
        }
        // Загружаем скрипт для работы с API
        load('https://vk.com/js/api/videoplayer.js', (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(window.VK as VkVideoIframeApiType);
            return;
        });
    });

    return iframeAPIReady;
};

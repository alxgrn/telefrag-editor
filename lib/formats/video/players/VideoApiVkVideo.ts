/**
 * Загрузчик API для плеера VK
 * За основу взята загрузка из https://github.com/gajus/youtube-player
 */
import load from 'load-script';

export type VkVideoIframeApiType = {
    VideoPlayer: Function;
};

declare global {
    interface Window {
        VK?: VkVideoIframeApiType;
        onVkVideoAPIReady?: () => void;
    }
}

export const loadVkVideoIframeApi = (): Promise<VkVideoIframeApiType> => {
    // Проверяем, загружено ли API уже
    if (window.VK && window.VK.VideoPlayer && typeof window.VK.VideoPlayer === 'function') {
        return Promise.resolve(window.VK);
    }

    // Если API ещё не загружено, создаём промис
    return new Promise<VkVideoIframeApiType>((resolve, reject) => {
        // Убедимся, что обработчик не добавлен дважды
        if (!window.onVkVideoAPIReady) {
            window.onVkVideoAPIReady = () => {
                if (window.VK) {
                    resolve(window.VK);
                } else {
                    reject(new Error('VK Video API loaded, but VK object is not available.'));
                }
            };
        }

        // Загружаем скрипт
        load('https://vk.com/js/api/videoplayer.js', (error) => {
            if (error) {
                reject(new Error(`Failed to load VK Video API script: ${error}`));
            }
            // Если скрипт загрузился, но колбэк не сработал, подстрахуемся
            if (window.VK && window.VK.VideoPlayer) {
                resolve(window.VK);
            }
        });
    });
};

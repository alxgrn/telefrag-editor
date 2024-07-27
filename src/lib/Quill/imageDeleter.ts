/**
 * ВНИМАНИЕ: Этот компонент сейчас не используется. Мы удаляем
 * лишние картинки на сервере при сохранении статьи, а не в клиенте.
 * 
 * Перехватываем событие изменения содержимого редактора для
 * определения удаления картинок. Игнорируем все параметры вызова,
 * кроме первого, который содержит html готовый к отображению.
 */

import { CustomImageType } from "./CustomImage";
// Тут храним актуальный список картинок
let imageList: CustomImageType[] = [];

export const imageDeleter = (content: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = doc.getElementsByTagName('img');
    // Пройдем по всему списку и соберем новый массив картинок.
    // Могло добавиться или удалиться сразу несколько штук.
    const newList: CustomImageType[] = [];
    for(var i = 0; i < images.length; i++) {
        newList.push({
            src: images[i].getAttribute('src'),
            fid: images[i].getAttribute('fid'),
        });
    }
    // Если актуальный список картинок пуст, значит это или
    // первое обращение или на предыдущем шаге были удалены
    // все картинки.
    if(!imageList.length) {
        imageList = [...newList];
        console.log('== Получен новый список картинок ==');
        console.dir(imageList);
        return;
    }
    // Проверим все ли картинки из актуального списка остались
    // в новом. Если кого-то не найдем, значит его удалили.
    const deletedList: CustomImageType[] = [];
    imageList.forEach(image => {
        if(!newList.find(i => i.src === image.src)) {
            deletedList.push(image);
        }
    });
    // Если список удаленных картинок не пуст, значит надо
    // сказать серверу, что их надо удалить.
    if(deletedList.length) {
        console.log('== Обнаружены удаленные картинки ==');
        console.dir(deletedList);    
    }
    // Копируем в актульный список картинок список из вновь полученного
    // контента т.к. картинки могут не только удаляться, но и добавляться.
    imageList = [...newList];
};

export default imageDeleter;

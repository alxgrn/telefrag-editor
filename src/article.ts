import { TArticle } from "../lib/types";

export const article: TArticle = 
{
    "id": 20,
    "user_id": 1,
    "name": "Запуски на ресурсе",
    "info": "Механизм получения обратной связи и оценок для проектов",
    "format": "delta",
    "content": "{\"ops\":[{\"attributes\":{\"link\":\"/launches\"},\"insert\":\"Запуски\"},{\"insert\":\" – механизм получения обратной связи и оценок проектов.\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Примечание:\"},{\"insert\":\" это временный текст, на основе которого в дальнейшем предполагается создать справку о запусках на проекте. Подробнее об инициативе можно прочитать в \"},{\"attributes\":{\"link\":\"/article/175\"},\"insert\":\"отдельной статье\"},{\"insert\":\".\"},{\"attributes\":{\"blockquote\":true},\"insert\":\"\\n\"},{\"insert\":\"Есть несколько вариантов запусков, которые отличаются друг от друга тем, кто может принимать в них участие и кто может оценивать проекты. Коротко их можно описать так:\\nПубличная порка – принять участие могут любые проекты, заявка автоматически удовлетворяется; оценить проект может любой член сообщества.\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"Питч-сессия – оценивать проекты может узкий круг приглашенных экспертов; число заявок, как правило, ограничено и они проходят отбор организаторами.\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"Междусобойчик – участники запуска оценивают проекты друг друга.\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"Запуски ограничены во времени, т.е. у них есть дата начала оценки проектов, и дата окончания. Также есть дата, до которой можно подавать заявки.  Она может быть любой вплоть до даты окончания запуска. Предполагается что начинать подавать заявки можно сразу после объявления запуска, но можно и установить дату начала сбора заявок отдельно.\\nИдея ограниченности во времени заключается в том, что проекты развиваются (в том числе с учетом обратной связи от запусков) и через какое-то время им может потребоваться новая обратная связь по внесенным изменениям или от другого пула экспертов или аудитории. На ресурсе предполагается проведение регулярных запусков, участие в которых проекты могут планировать.\\nОтзыв на проект состоит из оценки (от 1 до 10) и текста отзыва, который может быть дополнен  перечислением положительных или негативных аспектов. Администратор проекта может оставить один ответ на каждый отзыв, в котором также оценивает насколько отзыв был полезен. В дальнейшем эта оценка может служить основой для подсчета рейтинга персоны как эксперта.\\n\"},{\"attributes\":{\"fid\":\"1635\",\"src\":\"/api/files/1635\"},\"insert\":{\"image\":{\"src\":\"/api/files/1635\",\"fid\":\"1635\"}}},{\"insert\":\"Сейчас оценки и отзывы видны во время запуска. Это сделано для отладки на время тестирования. В рабочем варианте результаты будут отображаться только после завершения запуска чтобы оценки одних участников, не влияли на решения других.\"},{\"attributes\":{\"blockquote\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}",
    "created": "2023-12-06T10:45:29.798Z",
    "modified": "2024-08-21T07:42:46.889Z",
    "published": "2024-05-27T12:47:34.770Z",
    "is_published": true,
    "cover_id": 413,
    "type": "long",
    "comments": 0,
    "commented": null,
    "likes_sum": 9,
    "likes_num": 9
};

# Music service on Nest.js
Интенсив на Nest.js, за недельку))) Фронта пока нету

### Реализовано
- Загрузка файлов на сервер
- Какой-никакой валидатор классов
- Авторизация на JWT
- Роли
- Создание дефолтных ролей при первой регистрации
- Ленивый поиск по трекам
- Потверждение аккаунта через почту
- Первый потвержденный юзер - обладает админской ролью
- Редактировать/удалять треки (и другие штуки) можно созданные только юзером которые создал этот объект, админ может всё :)

### ENV
Для запуска проекта необходимо создать файл .env, в папке backend
```env
PORT=80
POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=supersecretdbpassword
POSTGRES_DB=db
POSTGRES_PORT=5432
PRIVATE_KEY=topsecter
EMAIL_DEFAULT_FROM="Music API" <no-reply@example.com>
EMAIL_TRANSPORT=smtps://no-reply@example.com:password@smtp.example.net
```
Если используете Docker, .env требуется создать в корне проекта с таким содержимым:
```env
PORT=80
POSTGRES_USER=postgres
POSTGRES_PASSWORD=supersecretdbpassword
POSTGRES_DB=db
POSTGRES_PORT=5432
PRIVATE_KEY=SECRET
EMAIL_DEFAULT_FROM="Music API" <no-reply@example.com>
EMAIL_TRANSPORT=smtps://no-reply@example.com:password@smtp.example.net
```
Собираем и запускаем через docker compose:
```bash
docker-compose up
```
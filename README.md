# Music service on Nest.js
Интенсив на Nest.js, за недельку)))

### Реализовано
- Загрузка файлов на сервер
- Какой-никакой валидатор классов
- Авторизация на JWT
- Роли
- Создание дефолтных ролей при первой регистрации
- Первый потвержденный юзер - обладает админской ролью
- Редактировать/удалять треки (и другие штуки) можно созданные тобой, админ может :)

### ENV
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
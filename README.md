# Миры CD PROJEKT RED

Учебный проект Express/EJS/MongoDB по разделам 3–10 пособия. Основа — [ваш AIP_lectures, ветка task](https://github.com/VestaElam/AIP_lectures/tree/task), коммит 89ba51552ebf9aa4200f0b494d0c2288dffe4883. Сохранены дизайн, все шесть игр, фильтры, галерея, FAQ и русские тексты.

**Итоговая ветка: 10_8. Всего: 29 веток.** main — пункт 4.1; остальные ветки названы по подпунктам. [Полная таблица требований и проверок](docs/requirements.md).

## Запуск в Windows PowerShell

MongoDB должна быть запущена как служба. Команды ниже выполняются в PowerShell, после выхода из mongosh командой exit.

```powershell
cd C:\Users\Admin\Desktop\AIP\lectures
git fetch origin
git switch 10_8
npm ci
npm run seed
npm start
```

Открыть http://127.0.0.1:3000/. Остановка — Ctrl+C. Для другого порта: $env:PORT='3001' перед npm start. Проверено на Node.js 24.21.0.

В навигации нажать «Войти». Единая форма создаёт новый профиль или проверяет пароль существующего. Имя — 2–40 символов, пароль — 8–128. После входа доступны страницы всех шести игр. Выйти можно кнопкой «Выйти». Сессия действует одну минуту после последнего запроса страницы — это значение из пособия; после перерыва нужно войти снова.

## MongoDB

URI по умолчанию: mongodb://127.0.0.1:27017/cdpr_worlds_2026. При необходимости переопределяется переменной MONGODB_URI. Файлы базы хранятся у MongoDB, GitHub содержит код создания и посева.

| База / коллекция | Содержимое |
| --- | --- |
| cdpr_worlds_2026.cdpr_games | Все шесть игр: gameId, title, cover, desc, year, world, tag, subtitle, detail, facts, created |
| cdpr_worlds_2026.cdpr_players | Профили игроков: username, hashedPassword, salt, created; открытого password нет |
| cdpr_worlds_2026.cdpr_sessions | Сессии connect-mongo: greeting, counter, user_id после входа, срок expires |
| cdpr_worlds_2026.cdpr_games_demo | Только демонстрация driver из раздела 6, если запускался createCDPRDatabase.js |
| cdpr_mongoose_demo_2026 | Только демонстрация в ветках 7_1 и 7_2 |
| learn.unicorns, learn.unicorns_syntax | Отдельные упражнения MongoDB из раздела 3 |

Коллекции игроков и сессий могут быть пусты до первого входа или посещения. Просмотр через mongosh:

```javascript
use cdpr_worlds_2026
show collections
db.cdpr_games.find({}, {gameId:1,title:1})
db.cdpr_players.find({}, {username:1,created:1})
db.cdpr_sessions.find()
```

Повторный npm run seed не создаёт дублей и не стирает существующие поля. Не удаляйте базу приложения при проверке демонстрационных упражнений.

## Проверка

```powershell
npm test
node validateCDPRModel.js
node checkCDPRPlayer.js
```

14 автоматических тестов работают в отдельных временных базах, не меняя ваши игры, учётные записи и learn. [Браузерная проверка](verification/browser.json) охватывает десять размеров окна, карточки, галерею, изображения, форму, вход, выход и реальное истечение минутной cookie.

Конфигурация через переменные окружения: MONGODB_URI, SESSION_SECRET, PORT, HOST. Для локального задания есть значения по умолчанию. Секрет реального сервера следует задавать через SESSION_SECRET. Пример — .env.example; для подхвата файла с Node 24: node --env-file=.env ./bin/www. Сам .env не коммитится.

В 4.4 пособие требует ejs-locals 1.0.2. Он использует старый EJS: npm audit сохраняет две критические записи без исправления в пакете. Это ограничение описано в docs/requirements.md; вариант предназначен для локальной учебной проверки. Сервер по умолчанию слушает 127.0.0.1.

Изображения и названия принадлежат их правообладателям; учебный фанатский проект. Основа оформления — Electric Xtra / TemplateMo. Лицензия Bootstrap находится в public/vendor/bootstrap/LICENSE.

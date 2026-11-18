// Запись, чтение и проверка пароля в отдельной временной базе.
require('node:child_process').spawnSync(process.execPath, ['--test', 'test/player.test.js'], {cwd:__dirname,stdio:'inherit'}).status === 0 || (process.exitCode = 1);

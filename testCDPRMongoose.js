// Проверки модели выполняются в отдельной временной базе и не меняют каталог.
require('node:child_process').spawnSync(process.execPath, ['--test', 'test/model.test.js'], { cwd: __dirname, stdio: 'inherit' }).status === 0 || (process.exitCode = 1);

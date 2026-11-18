const router = require('express').Router();
router.get('/', (req,res) => res.send('Маршрутизатор каталога игр CD PROJEKT RED'));
router.get('/:gameId', (req,res) => res.send(req.params.gameId));
module.exports = router;

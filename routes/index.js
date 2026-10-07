var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'ELECTRIC XTRA' });
});

/* Пункт 4.3: три маршрута используют общий шаблон. */
router.get('/performance', function(req, res) {
  res.render('feature', {
    title: 'Lightning Fast Performance',
    picture: '/images/performance.svg',
    desc: 'Высокая скорость обработки данных и мгновенный отклик — основа цифровой инфраструктуры ELECTRIC XTRA. Этот раздел посвящён производительности, масштабированию и синхронизации в реальном времени.'
  });
});

router.get('/security', function(req, res) {
  res.render('feature', {
    title: 'Military-Grade Security',
    picture: '/images/security.svg',
    desc: 'Безопасность объединяет защиту данных, управление доступом и своевременное обнаружение угроз. ELECTRIC XTRA представляет эти технологии как важную часть цифрового будущего.'
  });
});

router.get('/network', function(req, res) {
  res.render('feature', {
    title: 'Global Neural Network',
    picture: '/images/network.svg',
    desc: 'Глобальная сеть соединяет устройства, приложения и людей. Этот раздел ELECTRIC XTRA посвящён совместимости платформ, интеллектуальной маршрутизации и устойчивой связи между цифровыми системами.'
  });
});

module.exports = router;

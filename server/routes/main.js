const { Router } = require('express');

const { mainPage } = require('../views/main');

const router = Router();

router.get('/', mainPage);

module.exports = router;

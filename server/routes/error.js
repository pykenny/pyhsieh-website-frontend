const { Router } = require('express');

const { NotFoundResponse } = require('../views/error');

const router = Router();

// Right now, we simply direct all failed requests to 404.
router.use(NotFoundResponse);

module.exports = router;

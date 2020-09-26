const express = require('express');
const router = express.Router();

const asyncWrapper = require('../middlewares/asyncWrapper');
const logger = require('../utils/logger')
const steal = require('../services/steal')

router.use(asyncWrapper(async (req, res, next) => {
    logger.debug('Something is happening.');
    next();
}));

router.get(['/', '/health-check'], asyncWrapper(async (req, res) => {
    await res.json({message: 'hooray! welcome to our api!'});
}));

router.post('/steal', asyncWrapper(async (req, res) => {
    const stealGamesRes = await steal();

    res.json({message: `Steal ${JSON.stringify(stealGamesRes)} games`})
}));

module.exports = router;

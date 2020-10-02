const express = require('express');
const router = express.Router();

const asyncWrapper = require('../middlewares/asyncWrapper');
const logger = require('../utils/logger')
const {stealAll, stealNewest} = require('../services/steal')
const {saveGames, getGames} = require('../services/persistence')
const {updateGames} = require('../services/gameService')

router.use(asyncWrapper(async (req, res, next) => {
    logger.debug('Something is happening.');
    next();
}));

router.get(['/', '/health-check'], asyncWrapper(async (req, res) => {
    await res.json({message: 'hooray! welcome to our api!'});
}));

router.get('/stealAll', asyncWrapper(async (req, res) => {
    const games = await getGames()
    res.json({games: games})
}))

router.post('/stealAll', asyncWrapper(async (req, res) => {
    const stealGamesRes = await stealAll();
    const saveResult = await saveGames(stealGamesRes)

    res.json({message: `Steal ${JSON.stringify(stealGamesRes.length)} games`, saveResult})
}));

router.post('/stealNewest', asyncWrapper(async (req, res) => {
    const newestGames = await stealNewest();

    const updatedGamesCount = await updateGames(newestGames)

    logger.debug('done')

    res.json({message: `${updatedGamesCount} games updated`})
}))

module.exports = router;

const monk = require("monk")
const logger = require("../utils/logger");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI

logger.debug(`mongourl: ${MONGO_URI}`);
const db = monk(MONGO_URI)
const gamesCollection = db.get('games')
const testGameCollection = db.get('test-games')

const saveGames = async (games) => {
    return await testGameCollection.insert(games)
}

const getGames = async () => {
    return await testGameCollection.find({});
}

const getGameByPsId = async (game) => {
    logger.debug(`getGameByPsId ps4Id ${game.ps4Id}`)
    return await testGameCollection.find({ps4Id: game.ps4Id})
}

const isGameContains = async (game) => {
    const res = await testGameCollection.find({ps4Id: game.ps4Id});
    logger.debug(`is game ${game.ps4Id} exist: ${res.length > 0}`)
    return res.length > 0;
}

module.exports = {saveGames, getGames, isGameContains, getGameByPsId}

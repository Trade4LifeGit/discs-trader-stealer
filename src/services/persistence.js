const monk = require("monk")
const logger = require("../utils/logger");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI
const PURE_GAMES_COLLECTION_NAME = process.env.PURE_GAMES_COLLECTION_NAME || "pure-games"
const DUMP_GAMES_COLLECTION_NAME = process.env.DUMP_GAMES_COLLECTION_NAME || "dump-games"

logger.debug(`mongourl: ${MONGO_URI}`);
logger.debug(`pure games collection name: ${PURE_GAMES_COLLECTION_NAME}`)
logger.debug(`dump games collection name: ${DUMP_GAMES_COLLECTION_NAME}`)

const db = monk(MONGO_URI)
const pureGamesCollection = db.get(PURE_GAMES_COLLECTION_NAME)
const dumpGamesCollection = db.get(DUMP_GAMES_COLLECTION_NAME)

const savePureGames = async (games) => {
    return await pureGamesCollection.insert(games)
}

const saveDumpGames = async (games) => {
    return await dumpGamesCollection.insert(games)
}

const getGames = async () => {
    return await pureGamesCollection.find({});
}

const getGameByPsId = async (game) => {
    logger.debug(`getGameByPsId ps4Id ${game.ps4Id}`)
    return await pureGamesCollection.find({ps4Id: game.ps4Id})
}

const isGameContains = async (game) => {
    const res = await pureGamesCollection.find({ps4Id: game.ps4Id});
    logger.debug(`is game ${game.ps4Id} exist: ${res.length > 0}`)
    return res.length > 0;
}

module.exports = {savePureGames, getGames, isGameContains, getGameByPsId, saveDumpGames}

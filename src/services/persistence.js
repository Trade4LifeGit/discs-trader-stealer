const monk = require("monk")
const logger = require("../utils/logger");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI

logger.debug(`mongourl: ${MONGO_URI}`);
const db = monk(MONGO_URI)
const gamesCollection = db.get('games')

const saveGames = async (games) => {
    return await gamesCollection.insert(games)
}

const getGames = async () => {
    return await gamesCollection.find({});
}

module.exports = {saveGames, getGames}

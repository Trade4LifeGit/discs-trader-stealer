const {isGameContains, saveGames} = require('./persistence')
const logger = require('../utils/logger')
const AsyncArray = require("../utils/AsyncArray");

const updateGames = async (games) => {
    const asyncGames = new AsyncArray(games);

    const filteredGames = await asyncGames.filterAsync(async game => !await isGameContains(game))

    logger.debug(`filtered games: ${filteredGames.length}`)

    if (filteredGames.length > 0) {
        const addedGamesResp = await saveGames(filteredGames)
        logger.debug(`added games length: ${JSON.stringify(addedGamesResp).length}`)
    }

    return filteredGames.length;
}

module.exports = {
    updateGames
}

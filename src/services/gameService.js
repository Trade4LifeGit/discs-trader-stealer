const {isGameContains, saveGames} = require('./persistence')
const {stealNewest} = require('./steal');
const logger = require('../utils/logger')
const AsyncArray = require("../utils/AsyncArray");

const processGamesFromPs = async (pages) => {
    const gamesFromPs4 = await stealNewest(pages);
    const asyncGames = new AsyncArray(gamesFromPs4);

    const filteredGames = await asyncGames.filterAsync(async game => !await isGameContains(game))

    logger.debug(`filtered games: ${filteredGames.length}`)

    return [gamesFromPs4, filteredGames]
}

const processNextPage = async (lastPage, totalFromPs4, totalFiltered) => {
    let page = lastPage + 30;
    logger.debug(`page number ${page}`)
    const [newPageFromPs4, newPageFiltered] = await processGamesFromPs([page])

    logger.debug(`${page} page. steal ${newPageFromPs4.length} from ps api`)
    logger.debug(`we dont have ${newPageFiltered.length} games in our database`)

    totalFromPs4 = [...totalFromPs4, ...newPageFromPs4]
    totalFiltered = [...totalFiltered, ...newPageFiltered]

    logger.debug(`from Ps total length ${totalFromPs4.length}`)
    logger.debug(`we dont have total ${totalFiltered.length}`)
    logger.info('-------------------------------------------------')

    if (newPageFromPs4.length > 0 && newPageFiltered.length > 0 && newPageFiltered.length === newPageFromPs4.length) {
        return await processNextPage(page, totalFromPs4, totalFiltered)
    }

    return totalFiltered;

}

const updateGames = async () => {
    const pages = [30, 60];

    let [fromPs4, filtered] = await processGamesFromPs(pages)

    logger.debug(`steal ${fromPs4.length} games from ps api`)
    logger.debug(`we dont have ${filtered.length} games in our database`)

    if (filtered.length > 0 && filtered.length === fromPs4.length) {
        filtered = await processNextPage(pages[pages.length - 1], fromPs4, filtered)
    }

    if (filtered.length > 0) {
        const addedGamesResp = await saveGames(filtered)
        logger.debug(`added games resp: ${addedGamesResp.length}`)
    }

    return filtered.length;
}

module.exports = {
    updateGames
}

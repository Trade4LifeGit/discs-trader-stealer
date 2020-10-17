const axios = require("axios");
const moment = require("moment")
const {saveDumpGames} = require('./persistence')
const {PS4_API_PATH, PS4_NEWEST_GAMES_API_PATH, WRONG_GAME_NAMES} = require('../resources/ps4Creds');
const logger = require('../utils/logger')

const ps4DefaultParams = {
    bucket: "games",
    size: "30"
}

const splitArrays = (...arrays) => arrays.reduce((result, currentArray) => [...result, ...currentArray], [])

const parseGame = game => ({
    ps4Id: game.id,
    title: game.attributes.name.trim(),
    description: game.attributes["long-description"],
    image: game.attributes['thumbnail-url-base'],
    releaseDate: game.attributes["release-date"],
    gameContentType: game.attributes["game-content-type"],
    prices: game.attributes.skus
        ? Object.keys(game.attributes.skus[0].prices).map(key => {
            return {userType: key, price: game.attributes.skus[0].prices[key]['actual-price'].display}
        })
        : null,
    psnURL: `https://store.playstation.com/en-us/product/${game.id}`,
    timestamp: moment()
    // metadataDump: game.attributes
})

const isGameTitleValid = title => !(title === "Game" || WRONG_GAME_NAMES.includes(title));

const handlePs4Request = async (buckets, apiPath) => {
    logger.debug(`gameBucketsNumber length: ${buckets.length}`)

    const promises = buckets.map(start =>
        axios.get(apiPath, {
            params: {
                ...ps4DefaultParams,
                start
            }
        })
    )

    logger.debug('prepare promises')

    const resultGamesResponse = await Promise.all(promises);
    const gamesArray = splitArrays(...resultGamesResponse.map(response => response.data.included))

    const [pureGames, dumpGames] = gamesArray
        .reduce((resultArrays, game) => (isGameTitleValid(game.attributes.name) && !game.attributes.parent)
        ? [[...resultArrays[0], parseGame(game)], resultArrays[1]]
        : [resultArrays[0], [...resultArrays[1], parseGame(game)]], [[], []]);

    logger.debug(`Total games: ${gamesArray.length}`)
    logger.debug(`Pure games: ${pureGames.length}`)
    logger.debug(`Dump games: ${dumpGames.length}`)

    await saveDumpGames(dumpGames)

    return pureGames
}

const stealAll = async () => {
    const gameBucketsNumber = []

    for (let i = 0; i <= 7890; i = i + 30) {
        gameBucketsNumber.push(i)
    }

    return await handlePs4Request(gameBucketsNumber, PS4_API_PATH)
}

const stealNewest = async (pages) => {
    return await handlePs4Request(pages, PS4_NEWEST_GAMES_API_PATH);
}

module.exports = {stealAll, stealNewest}

const axios = require("axios");
const {PS4_API_PATH, PS4_NEWEST_GAMES_API_PATH, WRONG_GAME_NAMES} = require('../resources/ps4Creds');
const logger = require('../utils/logger')

const ps4DefaultParams = {
    bucket: "games",
    size: "30"
}

const splitArrays = (...arrays) => arrays.reduce((result, currentArray) => [...result, ...currentArray], [])

const parseGame = game => ({
    ps4Id: game.id,
    title: game.attributes.name,
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
    metadataDump: game.attributes
})

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

    logger.debug(`resultGamesResponse length: ${resultGamesResponse.length}`);

    return splitArrays(...resultGamesResponse.map(response =>
        response.data.included
            .filter(game => !WRONG_GAME_NAMES.includes(game.attributes.name) && !game.attributes.parent)
            .map(game => parseGame(game))
    ))
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

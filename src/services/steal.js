const axios = require("axios");
const apiConstants = require('../resources/ps4Creds');
const logger = require('../utils/logger')

const steal = async () => {
    const gameBucketsNumber = []

    for (let i = 0; i <= 7890; i = i + 30) {
        gameBucketsNumber.push(i)
    }

    logger.debug(`gameBucketsNumber length: ${gameBucketsNumber.length}`)

    const promises = gameBucketsNumber.map(start =>
        axios.get(apiConstants.PS4_API_PATH, {
            params: {
                bucket: "games",
                size: "30",
                start: start
            }
        })
    )

    logger.debug('prepare promises')

    const resultGamesResponse = await Promise.all(promises);

    logger.debug(`resultGamesResponse length: ${resultGamesResponse.length}`);

    return resultGamesResponse.flatMap(response =>
        response.data.included
            .filter(game => !apiConstants.WRONG_GAME_NAMES.includes(game.attributes.name) && !game.attributes.parent)
            .map(game => {
                return {
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
                }
            })
    )
}

module.exports = steal

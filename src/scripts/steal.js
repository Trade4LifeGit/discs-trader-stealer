const axios = require("axios");
const apiConstants = require('../resources/ps4Creds');
const logger = require('../utils/logger')

const gameBucketsNumber = []

for (let i = 0; i <= 7890; i = i + 30) {
    gameBucketsNumber.push(i)
}

const promises = gameBucketsNumber.map(start =>
    axios.get(apiConstants.PS4_API_PATH, {
        params: {
            bucket: "games",
            size: "30",
            start: start
        }
    })
)

Promise.all(promises).then(response => {
    let resultGames = response.flatMap(resp =>
        resp.data.included
            .filter(game => !apiConstants.WRONG_GAME_NAMES.includes(game.attributes.name) && !game.attributes.parent)
            .map(game => {
                return {
                    ps4Id: game.id,
                    name: game.attributes.name,
                    imageUrl: game.attributes['thumbnail-url-base'],
                    prices: game.attributes.skus
                        ? Object.keys(game.attributes.skus[0].prices).map(key => {
                            return {userType: key, price: game.attributes.skus[0].prices[key]['actual-price'].display}
                        })
                        : null
                };
            })
    )

    logger.debug(`resultGames length: ${resultGames.length}`);

    const fs = require('fs');
    fs.writeFile("testGames.json", JSON.stringify(resultGames), function (err) {
        if (err) {
            console.error('Crap happens');
        }
    });
})

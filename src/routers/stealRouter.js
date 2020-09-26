const express = require('express');
const axios = require("axios");

const apiConstants = require('../resources/ps4Creds');
const asyncWrapper = require('../middlewares/asyncWrapper');
const logger = require('../utils/logger')

const router = express.Router();

router.use(asyncWrapper(async (req, res, next) => {
    logger.debug('Something is happening.');
    next();
}));

router.get(['/', '/health-check'], asyncWrapper(async (req, res) => {
    await res.json({message: 'hooray! welcome to our api!'});
}));

router.get('/steal', asyncWrapper(async (req, res) => {
    axios.get(apiConstants.PS4_API_PATH, {params: Object.assign({bucket: "games"}, req.query)})
        .then(response => {
                const gameArray = response.data.included
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
                    });
                res.send(gameArray)
            }
        );
}));

module.exports = router;

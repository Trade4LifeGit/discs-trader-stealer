const express = require('express');
const axios = require("axios");

const apiConstants = require('../resources/ps4Creds');
const asyncMiddleWare = require('../middlewares/asyncMiddleware');

const router = express.Router();

router.use(asyncMiddleWare(async (req, res, next) => {
    console.log('Something is happening.');
    next();
}));

router.get(['/', '/health-check'], asyncMiddleWare(async (req, res) => {
    await res.json({message: 'hooray! welcome to our api!'});
}));

router.get('/steal', asyncMiddleWare(async (req, res) => {
    axios.get(apiConstants.PS4_API_PATH, {params: Object.assign({bucket: "games"}, req.query)})
        .then(response => {
                const gameArray = response.data.included
                    .filter(game => !apiConstants.WRONG_GAME_NAMES.includes(game.attributes.name) && !game.attributes.parent)
                    .map(game => {
                        return {
                            ps4Id: game.id,
                            name: game.attributes.name,
                            imageUrl: game.attributes['thumbnail-url-base'],
                        };
                    });
                res.send(gameArray)
            }
        );
}));

module.exports = router;
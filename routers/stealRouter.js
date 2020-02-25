const express = require('express');
const axios = require("axios");

const apiCreds = require('../resources/ps4Creds');
const asyncMiddleWare = require('../middlewares/asyncMiddleware');

const router = express.Router();

router.use(asyncMiddleWare(async (req, res, next) => {
    console.log('Something is happening.');
    next();
}));

router.get(['/', '/health-check'], asyncMiddleWare(async (req, res) => {
    res.json({message: 'hooray! welcome to our api!'});
}));

router.get('/steal', asyncMiddleWare(async (req, res) => {
    console.log("req.query:", req.query);
    axios.get(apiCreds.PS4_API_PATH, {params: Object.assign({bucket: "games"}, req.query)})
        .then(response => {
                res.send(response.data.included.map(game => game.attributes.name))
            }
        );
}));

module.exports = router;
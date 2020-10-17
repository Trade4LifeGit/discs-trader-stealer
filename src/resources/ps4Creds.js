const PS4_API_PATH = 'https://store.playstation.com/valkyrie-api/en/US/999/container/STORE-MSF77008-ALLGAMES';
const PS4_NEWEST_GAMES_API_PATH = 'https://store.playstation.com/valkyrie-api/en/US/999/container/STORE-MSF77008-NEWGAMESGRID';
const WRONG_GAME_NAMES = ['Pre-Order', 'Downloadable Game', 'Game', 'Full Game', 'Bundle', 'Full Game and Add-On Content', 'DCL - The Game', 'Add-On Content', "Play First Trial"];
const EDITIONS = ["Standard Edition", "Digital Deluxe Edition", "Deluxe Edition", "Ultimate Edition",
    "Gold Edition", "Standard Edition", "COMPLETE EDITION", "Console Edition", "Anniversary Edition", "Enhanced Edition", "Edition", "Pre-Order"]
const NO_SPECIAL_CHARACTERS_REGEX = /[^a-zA-Z 0-9\s:]/g;
const NO_EXTRA_SPACES_REGEX = /\s+/g;
const LAST_COLON_REGEX = /:$/

module.exports = Object.freeze({
    PS4_API_PATH,
    WRONG_GAME_NAMES,
    PS4_NEWEST_GAMES_API_PATH,
    EDITIONS,
    NO_SPECIAL_CHARACTERS_REGEX,
    NO_EXTRA_SPACES_REGEX,
    LAST_COLON_REGEX
});

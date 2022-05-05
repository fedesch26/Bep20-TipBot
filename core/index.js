const { bot, Keyboard, Router, InlineKeyboard, Composer } = require('./bot');
const database = require('./database');
const BnbManager = require('./bep20Api/index');

module.exports = {
  bot,
  Keyboard,
  Router,
  BnbManager,
  InlineKeyboard,
  Composer,
  database,
};

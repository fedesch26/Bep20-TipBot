const { bot, Composer, database } = require('../core');
const { createClient } = require('../libs');
const { parse_mode } = require('../libs/navigations');
const { privateKeyText } = require('../libs/templates');
const users = database('users');
const botDB = database('botdata');
const composer = new Composer();

composer.callbackQuery('genqr', async (ctx, next) => {
  let user = await users.findOne({ id: ctx.from.id });
  let qr =
    'https://api.qrserver.com/v1/create-qr-code?size=1000x1000&data=' +
    user.wallet;

  ctx
    .replyWithPhoto(qr, { caption: `${user.wallet}`, parse_mode: parse_mode })
    .then(next);
});

bot.use(composer);

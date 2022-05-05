const { bot, Composer, database } = require('../core');
const { createClient } = require('../libs');
const { parse_mode, actbtn2 } = require('../libs/navigations');
const { privateKeyText } = require('../libs/templates');
const users = database('users');
const botDB = database('botdata');
const composer = new Composer();

composer.callbackQuery('ppkey', async (ctx, next) => {
  let user = await users.findOne({ id: ctx.from.id });
  console.log(user);
  let privateKey = user.privateKey;
  await ctx.editMessageText(privateKeyText(privateKey), {
    reply_markup: actbtn2,
    parse_mode: parse_mode,
    disable_web_page_preview: true,
  });
  await next();
});

bot.use(composer);

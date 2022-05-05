const { bot, Composer, database } = require('../core');
const { accountHandler } = require('../handlers');
const composer = new Composer();
const { account } = require('../libs/navigations');
const { startBot, parse_mode, accountBtn } = require('../libs/navigations');
const { startInGroup, accountText } = require('../libs/templates');
const users = database('users');

composer.hears(account, accountHandler);
composer.command('account', accountHandler);
composer.callbackQuery('account', async (ctx, next) => {
  const user = await users.findOne({ id: ctx.from.id });
  //console.log(user);
  ctx.editMessageText(accountText(ctx.from, user.wallet, user.joined), {
    reply_markup: accountBtn,
    parse_mode: parse_mode,
    disable_web_page_preview: true,
  });
  await next();
});

bot.use(composer);

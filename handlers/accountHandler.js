const { database } = require('../core');
const { startBot, parse_mode, accountBtn } = require('../libs/navigations');
const { startInGroup, accountText } = require('../libs/templates');
const users = database('users');

const accountHandler = async (ctx, next) => {
  if (ctx.chat.type != 'private') {
    await ctx.reply(startInGroup, {
      reply_markup: startBot,
      parse_mode: parse_mode,
    });
  } else {
    const user = await users.findOne({ id: ctx.from.id });
    //console.log(user);
    ctx.reply(accountText(ctx.from, user.wallet, user.joined), {
      reply_markup: accountBtn,
      parse_mode: parse_mode,
      disable_web_page_preview: true,
    });
  }
  await next();
};

module.exports = accountHandler;

const { parse_mode } = require('../libs/navigations');
const { help } = require('../libs/templates');

const helpHandler = async (ctx, next) => {
  if (ctx.chat.type != 'private') {
    return true;
  } else {
    ctx.reply(help, { parse_mode: parse_mode });
  }
  await next();
};

module.exports = helpHandler;

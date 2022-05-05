const { bot, Composer, database } = require('../core');
const composer = new Composer();
const { templates } = require('../libs');

composer.hears(/lbt\s/i, async (ctx, next) => {
  await next();
});

bot.use(composer);

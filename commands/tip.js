const { bot, Composer, database } = require('../core');
const { tipHandler } = require('../handlers');
const composer = new Composer();
const { templates } = require('../libs');

composer.command('tip', tipHandler);

bot.use(composer);

const { bot, Composer, database } = require('../core');
const { helpHandler } = require('../handlers');
const composer = new Composer();
const { templates } = require('../libs');
const { help } = require('../libs/navigations');

composer.command('help', helpHandler);
composer.hears(help, helpHandler);

bot.use(composer);

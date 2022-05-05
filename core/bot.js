const {
  Bot,
  Keyboard,
  session,
  Composer,
  GrammyError,
  HttpError,
  BotError,
  InlineKeyboard,
} = require('grammy');
const { Router } = require('@grammyjs/router');
const { start } = require('./middlewares');
const { bot_token } = require('./config');
const { limit } = require('@grammyjs/ratelimiter');
const bot = new Bot(bot_token);

bot.use(session({ initial: () => ({ step: 'idle' }) }));

bot.use(limit());

bot.catch(async (err) => {
  const ctx = err.ctx;
  const e = err.error;
  if (e instanceof GrammyError) {
    await ctx.reply('Error in Request: ' + e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact telegram:', e);
  } else if (e instanceof BotError) {
    console.error('Something Happened', e);
  } else {
    await ctx.reply('unknown error: ' + e);
    console.error('New Error: ', e);
  }
});

start(bot);

module.exports = { bot, Keyboard, Router, InlineKeyboard, Composer };

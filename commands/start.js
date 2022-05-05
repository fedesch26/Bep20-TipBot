const { bot, Composer, database, InlineKeyboard } = require('../core');
const { createClient } = require('../libs');
const {
  startKeyboard,
  addToGrp,
  parse_mode,
  startBot,
} = require('../libs/navigations');
const composer = new Composer();
const {
  startText,
  addTogroupText,
  startInGroup,
} = require('../libs/templates');
const users = database('users');
const botDB = database('botdata');
composer.command('start', async (ctx, next) => {
  if (ctx.chat.type != 'private') {
    const startMe = new InlineKeyboard().url(
      'Start Bot',
      'https://t.me/' + ctx.me.username + '/?start',
    );
    await ctx.reply(startInGroup, {
      reply_markup: startMe,
      parse_mode: parse_mode,
    });
  } else {
    const botdata = await botDB.findOne({ bot_id: 123456 });
    if (!botdata) {
      await botDB.create({
        bot_id: 123456,
        admin: ctx.from.id,
        approved_tokens: [
          {
            tokenName: 'LBT',
            contractAddress: '0x03eb5cf7c2fa04978a9584e16e1e4e763910e69f',
            total_supply: 25000000,
            decimal: 8,
          },
        ],
      });
    }
    await ctx.reply(startText(ctx.from), {
      reply_markup: startKeyboard(),
      parse_mode: parse_mode,
      disable_web_page_preview: true,
    });

    const addMe = new InlineKeyboard().url(
      '⚡ Add To Group ⚡',
      'https://t.me/' + ctx.me.username + '?startgroup=true',
    );
    await ctx.reply(addTogroupText, {
      reply_markup: addMe,
      parse_mode: parse_mode,
    });

    let user = await users.findOne({ id: ctx.from.id });
    if (!user) {
      const bnbApi = createClient('mainnet');
      let newAccount = (await bnbApi).createAccount('user' + ctx.from.id);
      await users.create({
        id: ctx.from.id,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        wallet: newAccount.wallet.address,
        privateKey: newAccount.wallet.privateKey,
        keystore: [newAccount.keystore],
      });
    }
  }
  await next();
});

bot.use(composer);

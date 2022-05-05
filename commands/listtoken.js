const { InlineKeyboard } = require('grammy');
const { bot, Composer, database, Router } = require('../core');
const { admin } = require('../core/config');
const { list } = require('../libs/navigations');
let botdata = database('botdata');
let aList = database('listing');
let allTokens = database('tokenslist');
let router = new Router((ctx) => ctx.session.step);

const composer = new Composer();

composer.hears(list, async (ctx, next) => {
  let { approved_tokens } = await botdata.findOne({ bot_id: 123456 });

  var text = `🔎 *Supported BEP20 Tokens In Bot*\n\nBNB`;

  for (var i in approved_tokens) {
    text += `,${approved_tokens[i].tokenName}`;
  }
  text += `\n\n❓ *Can't find your token why don't you send it for listing in Bot*`;
  ctx.reply(text, {
    reply_markup: new InlineKeyboard().text('Add My Token', 'addtoken'),
    parse_mode: 'Markdown',
  });

  await next();
});

composer.callbackQuery('addtoken', async (ctx, next) => {
  let user = await aList.findOne({ id: ctx.from.id });
  let duration = 99;
  if (user) {
    duration = (new Date() - new Date(user.timer)) / 1000 / 60 / 60;
  }
  if (duration >= 24 || ctx.from.id == admin) {
    let msg = await ctx.editMessageText(
      `✅ <b>Bep20 Token Listing Operation!</b>

  Send Me The Token Contract Address That You Want To Get Listed?
  `,
      { parse_mode: 'HTML' },
    );
    ctx.session.step = 'addContract';
    ctx.session.msg_id = msg.message_id;
  } else {
    var time_passed = Math.abs(duration - 24);
    var hours = Math.floor(time_passed);
    var minutes = Math.floor((time_passed - hours) * 60);
    var seconds = Math.floor(((time_passed - hours) * 60 - minutes) * 60);
    await ctx.answerCallbackQuery({
      text: `⏳ Listing Cooldown: ${hours}:${minutes}:${seconds} hrs`,
      show_alert: false,
    });
  }
  await next();
});

router.route('addContract', async (ctx) => {
  const msg = ctx.msg?.text || ' ';
  let user = await aList.findOne({ id: ctx.from.id });
  await ctx.deleteMessage();
  if (
    msg == '/start' ||
    msg == '/Start' ||
    msg == '/START' ||
    msg == 'cancel' ||
    msg == 'Cancel'
  ) {
    ctx.session.step = 'idle';
    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.session.msg_id,
      '<b>⛔ Operation Cancelled!</b>',
      { parse_mode: 'HTML' },
    );
    return;
  }
  if (msg.charAt(0) != '0' || msg.charAt(1) != 'x') {
    ctx.session.step = 'idle';
    if (user) {
      await aList.updateOne(
        { id: ctx.from.id },
        { $set: { timer: new Date() } },
      );
    } else {
      await aList.create({
        id: ctx.from.id,
        timer: new Date(),
      });
    }
    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.session.msg_id,
      '<b>⛔ Operation Cancelled!</b>\n\nInvalid Contract Address',
      { parse_mode: 'HTML' },
    );
  } else {
    ctx.session.token_contract = msg;
    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.session.msg_id,
      '✅ <b>Bep20 Token Listing Operation!</b>\n\n🔎 <b>Contract Address:</b> <code>' +
        msg +
        '</code>\n\nSend me the token symbol now?',
      { parse_mode: 'HTML' },
    );
    ctx.session.step = 'addToken';
  }
});

router.route('addToken', async (ctx) => {
  ctx.deleteMessage();
  const msgg = ctx.msg?.text || ' ';
  let user = await aList.findOne({ id: ctx.from.id });
  let msg = msgg.toUpperCase();
  if (user) {
    await aList.updateOne({ id: ctx.from.id }, { $set: { timer: new Date() } });
  } else {
    await aList.create({
      id: ctx.from.id,
      timer: new Date(),
    });
  }

  if (msg.length > 8) {
    ctx.session.step = 'idle';
    await ctx.api.editMessageText(
      ctx.from.id,
      ctx.session.msg_id,
      '<b>⛔ Operation Cancelled!</b>\n\nInvalid Token Symbol',
      { parse_mode: 'HTML' },
    );
  } else {
    let { approved_tokens } = await botdata.findOne({ bot_id: 123456 });
    var is_valid = true;
    for (var i in approved_tokens) {
      if (
        approved_tokens.tokenName == msg ||
        approved_tokens.contractAddress == ctx.session.token_contract
      ) {
        is_valid = false;
        break;
      }
    }
    if (!is_valid) {
      await ctx.api.editMessageText(
        ctx.from.id,
        ctx.session.msg_id,
        '<b>⛔ Operation Cancelled!</b>\n\nToken Already Available',
        { parse_mode: 'HTML' },
      );
    } else {
      ctx.session.step = 'idle';
      ctx.session.tokenSymbol = msg;
      await ctx.api.editMessageText(
        ctx.from.id,
        ctx.session.msg_id,
        `✅ <b>List Bep20 Token Operation</b>\n\n` +
          `🔎 <b>Contract Address:</b> <code>${ctx.session.token_contract}</code>\n` +
          `🔤 <b>Symbol:</b> <code>${msg}</code>\n\n` +
          `What will you like to do?`,
        {
          reply_markup: new InlineKeyboard()
            .text('⚡ Request Listing', 'sendreq')
            .row()
            .text('❌ Delete Request', 'delreq'),
          parse_mode: 'HTML',
        },
      );
    }
  }
});

const encode = (text) => {
  Buffer.from(text).toString('base');
};

composer.callbackQuery('sendreq', async (ctx, next) => {
  let user = await aList.findOne({ id: ctx.from.id });
  let tokenList = await allTokens.findOne({ id: 123456 });
  var sym = ctx.session.tokenSymbol;
  var addr = ctx.session.token_contract;
  if (!tokenList) {
    await allTokens.create({
      id: 123456,
    });
  }
  var tokenId = Pencode(ctx.from.id + '_' + sym);
  var newToken = {
    id: tokenId,
    contract: addr,
    symbol: sym,
    by_user: ctx.from.id,
  };
  let duration = 99;
  if (user) {
    duration = (new Date() - new Date(user.timer)) / 1000 / 60 / 60;
  }
  if (duration >= 0) {
    await ctx.editMessageText(
      '✅ Your Listing Request have been sent to the token manager',
    );

    await allTokens.updateOne({ id: 123456 }, { $push: { tokens: newToken } });

    var key = new InlineKeyboard()
      .text('✅ Approve Request', 'approve ' + tokenId)
      .row()
      .text('❌ Decline Request', 'decline ' + sym + '_' + ctx.from.id);
    var text =
      `🆕 <b>Token Listing Request</b>\n\n` +
      `🔎 <b>Contract:</b> <a href="https://bscscan.com/token/${addr}">${addr}</a>\n` +
      `🆔 <b>Symbol:</b> <code>${sym}</code>\n\n` +
      `👮‍♂️ What do you want to do?`;
    await ctx.api.sendMessage(admin, text, {
      reply_markup: key,
      parse_mode: 'HTML',
    });
  } else {
    var time_passed = Math.abs(duration - 24);
    var hours = Math.floor(time_passed);
    var minutes = Math.floor((time_passed - hours) * 60);
    var seconds = Math.floor(((time_passed - hours) * 60 - minutes) * 60);
    await ctx.answerCallbackQuery({
      text: `⏳ Listing Cooldown: ${hours}:${minutes}:${seconds} hrs`,
      show_alert: false,
    });
  }
  await next();
});

composer.callbackQuery('delreq', async (ctx, next) => {
  ctx.editMessageText('⛔ <b>Listing request deleted successfully</b>');
  await next();
});

composer.callbackQuery(/approve [a-zA-Z]/i, async (ctx, next) => {
  let tokenId = ctx.match.input.split(' ')[1];
  let { tokens } = await allTokens.findOne({ id: 123456 });
  let token;
  for (var i in tokens) {
    if (tokens[i].id == tokenId) {
      token = tokens[i];
      break;
    }
  }

  var newArray = tokens.filter(removeToken);

  function removeToken(tokens) {
    return tokens.id != tokenId;
  }

  const chunk = {
    tokenName: token.symbol,
    contractAddress: token.contract,
    decimal: 8,
  };

  await botdata.updateOne(
    { bot_id: 123456 },
    { $push: { approved_tokens: chunk } },
  );

  await ctx.editMessageText('✅ Token Successfully Listed!');

  await ctx.api.sendMessage(
    token.by_user,
    `✅ <b>Your request to list ${token.symbol} was approved by token manager</b>`,
    {
      parse_mode: 'HTML',
    },
  );

  await allTokens.updateOne({ id: 123456 }, { $set: { tokens: newArray } });
  await next();
});

composer.callbackQuery(/decline [a-zA-Z]+_[0-9]/i, async (ctx, next) => {
  let params = ctx.match.input.split(' ')[1].split('_');
  let id = params[1];
  let symbol = params[0];

  await ctx.editMessageText('✅ Request Successfully deleted');

  await ctx.api.sendMessage(
    id,
    `⛔ <b>Your request to list ${symbol} was declined by token manager</b>`,
    {
      parse_mode: 'HTML',
    },
  );
  await next();
});

bot.use(router);

bot.use(composer);

function Pencode(text) {
  return Buffer.from(text).toString('base64');
}

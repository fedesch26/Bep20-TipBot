const { bot, Composer, database } = require('../core');
const { createClient } = require('../libs');
const { parse_mode, actbtn1 } = require('../libs/navigations');
const { onBalLoading } = require('../libs/templates');
const users = database('users');
const botDB = database('botdata');
const composer = new Composer();

composer.callbackQuery('mybalance', async (ctx, next) => {
  const user = await users.findOne({ id: ctx.from.id });
  console.log(user);
  //console.log(user.keystore);
  const bnbApi = createClient('main');
  const botdata = await botDB.findOne({ bot_id: 123456 });
  let approvedTokens = botdata.approved_tokens;
  console.log(approvedTokens);
  let balText = await ctx.editMessageText(onBalLoading, {
    parse_mode: parse_mode,
  });
  console.log(balText);
  let msg_id = balText.message_id;
  let mainText = '<b>✅ Tokens balance in your wallet</b>';

  let firstbal = await (await bnbApi).getBnbBalance(user.wallet);
  //   then(res => {
  //       console.log(res)
  //   })

  mainText += '\n<b>- BNB:</b> ' + firstbal;

  for (let i = 0; i < approvedTokens.length; i++) {
    if (approvedTokens[i]) {
      var tokenContract = approvedTokens[i].contractAddress;
      var token = approvedTokens[i].tokenName;
      var bal = await (
        await bnbApi
      ).getBEPTokenBalance(tokenContract, user.wallet);

      mainText += '\n<b>- ' + token + '</b>: ' + bal;
    }
  }
  mainText += `\n\n<b>About Binance Smart Chain</b>
<i>This is dual-chain architecture that empower its users to build their decentralized apps and digital assets on one blockchain and take advantage of the fast trading to exchange on the other.</i>`;

  await ctx.api.editMessageText(ctx.from.id, msg_id, mainText, {
    reply_markup: actbtn1,
    parse_mode: parse_mode,
  });

  await next();
});

bot.use(composer);

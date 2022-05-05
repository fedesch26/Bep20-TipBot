const { database } = require('../core/index');
const users = database('users');
const botdb = database('botdata');
const {
  createClient,
  createBscTransfer,
  createBnbTransfer,
} = require('../libs');
const { tip, tipSuccess } = require('../libs/templates');

const tipHandler = async (ctx, next) => {
  const bnbApi = createClient('mainnet');
  if (ctx.chat.type == 'private') {
    return;
  }
  let callUser = ctx.update.message.from.id;
  let targetUser;
  let exists = false;
  if (ctx.update.message.reply_to_message != undefined) {
    if (ctx.message.reply_to_message.from.is_bot == true) {
       ctx.reply(tip('You Can not tip Bots'), {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
       });
      return;
    } else if (ctx.message.reply_to_message.from.id == callUser) {
       await ctx.reply(tip('You Can not tip yourself'), {
         reply_to_message_id: ctx.message.message_id,
         parse_mode: 'HTML',
       });
      return;
    } else {
      targetUser = ctx.message.reply_to_message.from.id;
    }
  } else {
    return;
  }
  if (!ctx.match) {
     ctx.reply(tip('No Parameters Passed'), {
       reply_to_message_id: ctx.message.message_id,
       parse_mode: 'HTML',
     });
    return;
  } else {
    exists = true;
  }

  if (exists && targetUser) {
    let arr = ctx.match.split(' ');
    if (arr.length < 3) {
      ctx.reply(tip('Insufficient Parameters'), {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
      });
      return;
    }
    let amount = arr[1] * 1;

    if (isNaN(amount)) {
      ctx.reply(tip('Invalid Amount'), {
        reply_to_message_id: ctx.message.message_id,
        parse_mode: 'HTML',
      });
    }
    let cur = arr[2];
    cur = cur.toUpperCase();
    if (cur == 'BNB') {
      let checkUser = await users.findOne({ id: callUser });
      let checkTarget = await users.findOne({ id: targetUser });
      if (!checkUser) {
        await ctx.reply(tip('No Accounts Found'), {
          reply_to_message_id: ctx.message.message_id,
          parse_mode: 'HTML',
        });
        return;
      }
      if (!checkTarget) {
        let newAccount2 = (await bnbApi).createAccount(
          'user' + ctx.message.reply_to_message.from.id,
        );
        await users.create({
          id: ctx.message.reply_to_message.from.id,
          username: ctx.message.reply_to_message.from.username,
          first_name: ctx.message.reply_to_message.from.first_name,
          last_name: ctx.message.reply_to_message.from.last_name,
          wallet: newAccount2.wallet.address,
          privateKey: newAccount2.wallet.privateKey,
          keystore: [newAccount2.keystore],
        });
      }

      let receiver = ctx.message.reply_to_message.from;

      let msg = await ctx.reply(
        `⛔ <i>Tipping</i> ${format(receiver)} <i>${amount} ${cur}</i>`,
        { parse_mode: 'HTML', reply_to_message_id: ctx.message.message_id },
      );

      let transfer = await createBnbTransfer(
        'tip',
        callUser,
        targetUser,
        null,
        amount,
      );
      try {
        if (transfer.status) {
          await ctx.api.editMessageText(
            ctx.chat.id,
            msg.message_id,
            tipSuccess(receiver, transfer.txid, amount, cur),
            {
              parse_mode: 'HTML',
              reply_to_message_id: ctx.message.message_id,
              disable_web_page_preview: true,
            },
          );
        } else {
          ctx.api.editMessageText(
            ctx.chat.id,
            msg.message_id,
            tip(transfer.message),
            {
              parse_mode: 'HTML',
              reply_to_message_id: ctx.message.message_id,
            },
          );
        }
      } catch (e) {
        return;
      }
    } else {
      let { approved_tokens } = await botdb.findOne({ bot_id: 123456 });
      let isValid;
      let tokenData;
      for (var i in approved_tokens) {
        tokenData = approved_tokens[i];
        console.log(i);
        if (tokenData.tokenName == cur) {
          isValid = true;
          console.log(isValid);
          break;
        }
      }
      if (isValid) {
        let checkUser = await users.findOne({ id: callUser });
        let checkTarget = await users.findOne({ id: targetUser });
        if (!checkUser) {
          await ctx.reply(tip('No Accounts Found'), {
            reply_to_message_id: ctx.message.message_id,
            parse_mode: 'HTML',
          });
          return;
        }

        if (!checkTarget) {
          let newAccount2 = (await bnbApi).createAccount(
            'user' + ctx.message.reply_to_message.from.id,
          );
          await users.create({
            id: ctx.message.reply_to_message.from.id,
            username: ctx.message.reply_to_message.from.username,
            first_name: ctx.message.reply_to_message.from.first_name,
            last_name: ctx.message.reply_to_message.from.last_name,
            wallet: newAccount2.wallet.address,
            privateKey: newAccount2.wallet.privateKey,
            keystore: [newAccount2.keystore],
          });
        }

        let receiver = ctx.message.reply_to_message.from;

        let msg = await ctx.reply(
          `⛔ <i>Tipping</i> ${format(receiver)} <i>${amount} ${cur}</i>`,
          { parse_mode: 'HTML', reply_to_message_id: ctx.message.message_id },
        );

        let transfer = await createBscTransfer(
          'tip',
          callUser,
          targetUser,
          amount,
          tokenData.contractAddress,
          null,
        );
        try {
          if (transfer.status) {
            await ctx.api.editMessageText(
              ctx.chat.id,
              msg.message_id,
              tipSuccess(receiver, transfer.txid, amount, cur),
              {
                parse_mode: 'HTML',
                reply_to_message_id: ctx.message.message_id,
                disable_web_page_preview: true,
              },
            );
          } else {
            ctx.api.editMessageText(
              ctx.chat.id,
              msg.message_id,
              tip(transfer.message),
              {
                parse_mode: 'HTML',
                reply_to_message_id: ctx.message.message_id,
              },
            );
          }
        } catch (e) {
          return;
        }
      } else {
        ctx.reply(tip('Invalid Bep20 Token'), {
          reply_to_message_id: ctx.message.message_id,
          parse_mode: 'HTML',
        });
      }
    }
  }
  await next();
};

module.exports = tipHandler;

const format = ({ first_name, last_name, username, id }) => {
  var fullname;
  if (!username && !last_name) {
    fullname = `<a href="tg://user?id=${id}">${first_name}</a>`;
  } else if (username) {
    fullname = '@' + username;
  } else if (last_name) {
    fullname = `<a href="tg://user?id=${id}">${first_name}</a>`;
  }
  return fullname;
};

const { InlineKeyboard, Keyboard } = require('grammy');
const account = 'π My Account';
const help = 'β Help/FAQ';
const list = 'π List My Token';
const navigation = {
  account: account,

  addToGrp: new InlineKeyboard().url(
    'β‘ Add To Group β‘',
    'https://t.me/SwBep20TipBot?startgroup=true',
  ),

  help: help,
  list: list,
  startKeyboard: function () {
    return new Keyboard().text(account).row().text(help).row().text(list);
  },
  parse_mode: 'HTML',
  startBot: new InlineKeyboard().url(
    'Start Bot',
    'https://t.me/botusername/?start',
  ),
  accountBtn: new InlineKeyboard()
    .text('π°Balance', 'mybalance')
    .text('π Qr Code', 'genqr')
    .row()
    .text('π View Private Key', 'ppkey')
    .row(),
  actbtn1: new InlineKeyboard()
    .text('π Account', 'account')
    .text('π Qr Code', 'genqr')
    .row()
    .text('π View Private Key', 'ppkey')
    .row(),
  actbtn2: new InlineKeyboard()
    .text('π°Balance', 'mybalance')
    .text('π Qr Code', 'genqr')
    .row()
    .text('π€ Account', 'account')
    .row(),
};

module.exports = navigation;

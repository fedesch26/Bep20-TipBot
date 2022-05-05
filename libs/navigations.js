const { InlineKeyboard, Keyboard } = require('grammy');
const account = '🆔 My Account';
const help = '❓ Help/FAQ';
const list = '📚 List My Token';
const navigation = {
  account: account,

  addToGrp: new InlineKeyboard().url(
    '⚡ Add To Group ⚡',
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
    .text('💰Balance', 'mybalance')
    .text('📃 Qr Code', 'genqr')
    .row()
    .text('🔐 View Private Key', 'ppkey')
    .row(),
  actbtn1: new InlineKeyboard()
    .text('👁 Account', 'account')
    .text('📃 Qr Code', 'genqr')
    .row()
    .text('🔐 View Private Key', 'ppkey')
    .row(),
  actbtn2: new InlineKeyboard()
    .text('💰Balance', 'mybalance')
    .text('📃 Qr Code', 'genqr')
    .row()
    .text('👤 Account', 'account')
    .row(),
};

module.exports = navigation;

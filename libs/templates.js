const templates = {
  startText: (from) =>
    `🤖 <b>Welcome ${format(from)}</b>,
<i>I am a Telegram Tipping Bot fully intergrated with the <a href="https://bscscan.com">Binance Smart Chain(BSC)</a>. Click the menu to get started tipping your group members bep20 tokens.</i>

🗃 <b>Listing Tokens</b>
<i>Your bep20 token is not supported by the bot? You can register it in bot easily just click "List My Token" and do the steps</i>
 
ℹ️ For more info on how using bot you might want to check the Help button or just send /help`,
  tip: (reason) => {
    if (!reason) {
      return ``;
    } else {
      return `❌ <b>Tipping Failed</b>\n${reason}`;
    }
  },
  tipSuccess: (from, txid, amount, cur) => {
    return `✅ <b>Tip Done</b>
${format(
  from,
)} received <a href="https://bscscan.com/tx/${txid}">${amount} ${cur}</a>`;
  },
  help: `🧸<b> HELP/FAQ SECTION</b>


📍 <b>About</b>
<i>I am a telegram tip bot fully intergrated with the Binance Smart Chain (BSC).</i>

🤔<b> How To Use</b>
<i>I automatically generate a wallet address for you, The default supported bep20 token is Binance Coin (BNB). Deposit funds, Transfer to others telegram members, Export your private key and more.</i>


🎁 <b>Tipping</b>
<i>To start tipping you need a minimum balance of 0.001 BNB in your account to cover network fees for each transaction because all transactions in bot are broadcasted over the Binance Smart chain in real time.
To tip a user, reply to his message and use the format </i>
<i>Format -> </i><code>/tip [amount] [currency]</code>
<i>Example: </i><code>/tip 0.05 BNB</code> <i>or</i> <code>/give 10 BNB</code>

🗳 <b>Withdrawing</b>
<i>To withdraw your balance from bot you also need a minimum of 0.001 bnb to cover the network fee, you can also export your private key to a outer wallet,
Format -> </i><code>/withdraw [amount] [currency] [address]</code>
<i>Example: </i><code>/withdraw 0.05 BNB 0x57365dA85E06D7*********</code> <i>or</i> 
<code>/send 0.05 BNB 0x57365dA85E06D7*********</code>

🗃 <b>Whitelisting</b>
<i>Your bep20 token not supported by {botname} You might be interested in whitelisting your token. Just click the button LIST MY TOKEN to get started. Note: The token managers reserves the right to refuse any token.</i>

⛔️ <b>Disclaimer</b>
<i>It is recommended to export or save your private key in case anything happens to your telegram accounts.
All private keys are stored in {botname} database and used to automate and sign transactions for you.</i>`,
  account: (from, wallet) => {},
  list: ``,
  addTogroupText:
    '✅ Hey add me to your group!, click on the button below and choose the group and have fun tipping your friends your favorite bep20 tokens.\n\nAlso join my announcements channel to get updates on future version of me.',
  startInGroup: '🎊 <b>Thanks For Adding Me To Your Group</b>🎊',
  accountText: (from, wallet, joined) => {
    var time = joined.toLocaleString('en-US', { timeZone: 'Africa/Accra' });
    return `✅ <b>Account Information</b>

👤 <b>Account:</b> <code>${from.id}|${from.first_name}</code>
⏰ <b>Joined:</b> <code>${time}</code>

🧰 <b>Wallet: </b>
<code>${wallet}</code>
<a href="https://bscscan.com/address/${wallet}">${wallet}</a>

<b>About Binance Smart Chain</b>
<i>This is dual-chain architecture that empower its users to build their decentralized apps and digital assets on one blockchain and take advantage of the fast trading to exchange on the other.</i>`;
  },
  onBalLoading: `<i>⛔ Getting all balances.....</i>`,
  privateKeyText: (key) => `🔐 <b>Private Key:</b>
<code>${key}</code>

<i>With this private keys you have full control over your wallet. It is recommended to write these down in a safe place in case you are not able to access Telegram for any reason.
This private key can be used with an official bsc wallet to send your tokens to any account you wish. It is used by {botname} to sign transactions for you.</i>

✅ <b>Recommended wallets</b>
-<a href="https://trustwallet.com/">Trust Wallet (mobile)</a>,
- <a href="https://m.safepal.io/">Safepal wallet (mobile/hardware)</a>
- <a href="https://metamask.io/">MetaMask Wallet (mobile/extension)</a>
-<a href="https://mathwallet.org/en-us/">Math Wallet (mobile/extension)</a>
-<a href="https://unstoppable.money/">Unstoppable Wallet (mobile)</a>`,
};

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

module.exports = templates;

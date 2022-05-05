const { BnbManager } = require('../core');

const createClient = async (net) => {
  var bnbapi;
  if (!net) {
    net = 'mainnet';
  }

  if (net == 'mainnet') {
    bnbapi = new BnbManager('https://bsc-dataseed.binance.org/');
  } else {
    bnbapi = new BnbManager('https://bsc-dataseed.binance.org/');
  }

  return bnbapi;
};

module.exports = createClient;

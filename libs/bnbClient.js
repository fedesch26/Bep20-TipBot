const { BnbManager } = require('../core');

const createClient = async (net) => {
  var bnbapi;
  if (!net) {
    net = 'testnet';
  }

  if (net == 'testnet') {
    bnbapi = new BnbManager('https://bsc-dataseed1.binance.org');
  } else {
    bnbapi = new BnbManager('https://bsc-dataseed1.binance.org');
  }

  return bnbapi;
};

module.exports = createClient;

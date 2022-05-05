const { BnbManager } = require('../core');

const createClient = async (net) => {
  var bnbapi;
  if (!net) {
    net = 'testnet';
  }

  if (net == 'testnet') {
    bnbapi = new BnbManager('https://data-seed-prebsc-1-s1.binance.org:8545');
  } else {
    bnbapi = new BnbManager('https://bsc-dataseed1.binance.org:443');
  }

  return bnbapi;
};

module.exports = createClient;

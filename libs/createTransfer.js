const { database } = require('../core');
const createClient = require('./bnbClient');

const users = database('users');
const botdata = database('botdata');

const createBnbTransfer = async (action, userId, targetId, wallet, amount) => {
  const bnbApi = await createClient('main');
  const user = await users.findOne({ id: userId });
  const userBal = await (await bnbApi).getBnbBalance(user.wallet);
  if (action == 'tip') {
    const target = await users.findOne({ id: targetId });
    try {
      if (userBal < 0.001 || userBal < amount) {
        return { status: false, message: 'Insufficient funds' };
      }
      let transfer = await bnbApi.sendBNB(
        user.keystore[0],
        'user' + userId,
        target.wallet,
        amount,
        56,
      );
      console.log('final', transfer);
      return {
        status: true,
        message: 'transaction successful',
        txid: transfer,
      };
    } catch (e) {
      console.log(e);
      return { status: false, message: e };
    }
  } else {
    try {
      if (userBal < 0.001 || userBal < amount) {
        return { status: false, message: 'Insufficient funds' };
      }
      console.log('inital', amount);
      let transfer = await bnbApi.sendBNB(
        user.keystore[0],
        'user' + userId,
        wallet,
        amount,
        56,
      );
      return {
        status: true,
        message: 'transaction successful',
        txid: transfer,
      };
    } catch (error) {
      console.log(error);
      return { status: false, message: error };
    }
  }
};

const createBscTransfer = async (
  action,
  userId,
  targetId,
  amount,
  contract,
  wallet,
) => {
  const bnbApi = await createClient('main');
  const user = await users.findOne({ id: userId });
  let firstbal = await bnbApi.getBnbBalance(user.wallet);
  var bal = await bnbApi.getBEPTokenBalance(contract, user.wallet);

  if (firstbal < 0.001) {
    console.log(firstbal);
    return { status: false, message: 'Insufficient funds' };
  }

  if (bal < amount || bal == 0) {
    console.log(bal);
    return { status: false, message: 'Insufficient funds' };
  }
  if (action == 'tip') {
    const target = await users.findOne({ id: targetId });
    try {
      var createTip = await bnbApi.sendToken(
        user.keystore[0],
        'user' + userId,
        contract,
        target.wallet,
        amount,
        1,
      );
      return {
        status: true,
        message: 'transfer succesful',
        txid: createTip.transactionHash,
      };
    } catch (e) {
      console.log(e);
      return { status: false, message: 'An Error Happened' };
    }
  } else {
    try {
      var createTip = await bnbApi.sendToken(
        user.keystore[0],
        'user' + userId,
        contract,
        wallet,
        amount,
        56,
      );
      return {
        status: true,
        message: 'transfer succesful',
        txid: createTip.transactionHash,
      };
    } catch (error) {
      return { status: false, message: 'An Error Happened' };
    }
  }
};

module.exports = {
  createBnbTransfer,
  createBscTransfer,
};

const { database } = require('.');
const { createClient } = require('../libs');
const users = database('users');

const presentNumber = (_number, _bool) => {
  var options = _bool ? { minimumFractionDigits: 6 } : {};
  return parseFloat(_number).toLocaleString(undefined, options);
};

const proofNumber = (number) => {
  if (
    number.toString().charAt(0) == '0' &&
    number.toString().charAt(1) == 'x'
  ) {
    return false;
  } else if (isNaN(number)) {
    return false;
  } else if (!isNaN(number)) {
    return true;
  }
};

const proofAccount = async (user) => {
  var callingAccount = await getAccount(user.id);
  if (!callingAccount) {
    return '⚠ Recipent or Sender have not yet generated an account';
  } else {
    return callingAccount;
  }
};

const logCall = async (user) => {
  var timestamp = new Date();
  await timestamp.setSeconds(timestamp.getSeconds() + 10);

  await users.findOneAndUpdate(
    { id: user.id },
    { $set: { call: timestamp.getTime() } },
  );
};

const getCall = async (user) => {
  let user = await users.findOne({ id: user.id });
  return user.call;
};

module.exports = {
  getCall,
  logCall,
  proofAccount,
  presentNumber,
  proofNumber,
};

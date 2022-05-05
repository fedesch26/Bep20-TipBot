const templates = require('./templates');
const createClient = require('./bnbClient');
const { createBnbTransfer, createBscTransfer } = require('./createTransfer');

module.exports = {
  templates,
  createClient,
  createBscTransfer,
  createBnbTransfer,
};

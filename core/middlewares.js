const { run } = require('@grammyjs/runner');

const start = async (bot) => {
  await bot.api.deleteWebhook({ drop_pending_updates: true });

  run(bot);
};

module.exports = {
  start,
};

const rainHandler = async (ctx, next) => {
  await next();
};

module.exports = rainHandler;

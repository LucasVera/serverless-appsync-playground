
const sleepMs = (ms) => new Promise((resolve, reject) => setTimeout(() => {
  console.log(`done waiting ${ms} ms`);
}), ms);

module.exports.handler = async (event, context) => {
  await sleepMs(1500);

  return {};
};

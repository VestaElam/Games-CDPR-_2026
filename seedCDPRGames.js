const { MongoClient } = require('mongodb');
const { mongoUrl } = require('./config/database');
const { data } = require('./cdprGameData');

async function seedGames(db) {
  const collection = db.collection('cdpr_games');
  await collection.createIndex({ gameId: 1 }, { unique: true });
  for (const source of data) {
    await collection.updateOne({ gameId: source.gameId }, { $setOnInsert: { ...source, created: new Date() } }, { upsert: true });
    // Дополняем старый посев только отсутствующими полями; правки пользователя сохраняются.
    for (const [key, value] of Object.entries(source)) {
      await collection.updateOne({ gameId: source.gameId, [key]: { $exists: false } }, { $set: { [key]: value } });
    }
    await collection.updateOne({ gameId: source.gameId, created: { $exists: false } }, { $set: { created: new Date() } });
  }
  return collection.countDocuments();
}
if (require.main === module) {
  const client = new MongoClient(mongoUrl);
  client.connect().then(() => seedGames(client.db()))
    .then(count => console.log('Каталог CDPR, документов:', count))
    .catch(error => { console.error(error.message); process.exitCode = 1; })
    .finally(() => client.close());
}
module.exports = { seedGames };

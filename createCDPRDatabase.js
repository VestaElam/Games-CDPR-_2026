const { MongoClient } = require('mongodb');
const { mongoUrl } = require('./config/database');
const { data } = require('./cdprGameData');
const client = new MongoClient(mongoUrl);
async function main() {
  await client.connect();
  const collection = client.db().collection('cdpr_games_demo');
  await collection.createIndex({ gameId: 1 }, { unique: true });
  for (const game of data) await collection.updateOne({gameId:game.gameId}, {$setOnInsert:game}, {upsert:true});
  console.log('Демонстрация MongoDB driver, игр:', await collection.countDocuments());
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => client.close());

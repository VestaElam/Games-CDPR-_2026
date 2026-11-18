const {MongoClient}=require('mongodb');
const {mongoUrl}=require('./config/database');
const games=require('./public/javascripts/games');
const client=new MongoClient(mongoUrl);
async function main(){
 await client.connect();const collection=client.db().collection('cdpr_games_demo');
 await collection.createIndex({gameId:1},{unique:true});
 for(const game of games)await collection.updateOne({gameId:game.id},{$setOnInsert:{gameId:game.id,title:game.name,world:game.world}},{upsert:true});
 console.log('MongoDB driver: сохранено игр',await collection.countDocuments());
}
main().catch(error=>{console.error(error.message);process.exitCode=1}).finally(()=>client.close());

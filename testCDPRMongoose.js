const mongoose=require('mongoose');
// Отдельная демонстрационная база; каталог приложения не изменяется.
const mongoUrl=process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cdpr_mongoose_demo_2026';
const schema=new mongoose.Schema({title:String});
schema.methods.describe=function(){return this.title+' — игра из мира CD PROJEKT RED';};
const CDPRDemoGame=mongoose.model('CDPRDemoGame',schema);
async function main(){
 await mongoose.connect(mongoUrl);
 const game=new CDPRDemoGame({title:'Ведьмак 3: Дикая Охота'});
 await game.save();
 console.log(game.describe());
}
main().catch(error=>{console.error(error.message);process.exitCode=1}).finally(()=>mongoose.disconnect());

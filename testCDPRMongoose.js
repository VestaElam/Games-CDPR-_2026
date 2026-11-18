const mongoose=require('mongoose');
// Отдельная демонстрационная база; каталог приложения не изменяется.
const mongoUrl=process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cdpr_mongoose_demo_2026';
const CDPRDemoGame=mongoose.model('CDPRDemoGame',{title:String});
async function main(){
 await mongoose.connect(mongoUrl);
 const game=new CDPRDemoGame({title:'Ведьмак 3: Дикая Охота'});
 await game.save();
 console.log('Сохранена игра: '+game.title);
}
main().catch(error=>{console.error(error.message);process.exitCode=1}).finally(()=>mongoose.disconnect());

const {test,before,after} = require('node:test');
const assert = require('node:assert/strict');
const {randomUUID} = require('node:crypto');
const {spawn} = require('node:child_process');
const path = require('node:path');
const {MongoClient} = require('mongodb');
const database = 'cdpr_guide_test_' + randomUUID().replaceAll('-', '');
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/' + database;
process.env.SESSION_SECRET = 'CDPR-isolated-integration-tests-session-secret';
process.env.NODE_ENV = 'test';
const client = new MongoClient(process.env.MONGODB_URI);
let app, server, base;
const ids = ['cyberpunk','witcher3','phantom','thronebreaker','gwent','witcher2'];
function browserClient() {
  let cookie = '';
  return {
    get cookie() {return cookie;},
    set cookie(value) {cookie=value;},
    async request(url,options={}) {
      const response = await fetch(base+url, {redirect:'manual',...options,headers:{Cookie:cookie,...options.headers}});
      for (const header of response.headers.getSetCookie()) {
        const pair = header.split(';')[0], name = pair.split('=')[0];
        cookie = [...cookie.split('; ').filter(x=>x&&!x.startsWith(name+'=')),pair].join('; ');
      }
      return {status:response.status,headers:response.headers,body:await response.text()};
    },
    async login(username='БелыйВолк',password='SilverSword2026') {
      return this.request('/logreg',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({username,password})});
    }
  };
}
function sessionId(browser) {return decodeURIComponent(browser.cookie.match(/connect.sid=([^;]+)/)[1]).slice(2).split('.')[0];}
before(async()=>{
  await client.connect();
  await require('../seedCDPRGames').seedGames(client.db());
  app = require('../app');
  await app.locals.ready;
  server = app.listen(0,'127.0.0.1');
  await new Promise(resolve=>server.once('listening',resolve));
  base = 'http://127.0.0.1:' + server.address().port;
});
after(async()=>{
  if(server) await new Promise(resolve=>server.close(resolve));
  if(app) await app.locals.sessionStore.close();
  await require('mongoose').disconnect();
  if(client.db().databaseName===database) await client.db().dropDatabase();
  await client.close();
});
test('10.8: гостю доступны главная и вход, все шесть игр закрыты',async()=>{
  const guest=browserClient();
  const home=await guest.request('/');assert.equal(home.status,200);
  assert.equal((home.body.match(/class="game-card"/g)||[]).length,6);
  assert.match(home.body,/Войди или создай профиль игрока/);
  assert.equal((await guest.request('/logreg')).status,200);
  for(const id of ids) {
    const page=await guest.request('/games/'+id);
    assert.equal(page.status,302);assert.equal(page.headers.get('location'),'/');
  }
  assert.equal((await guest.request('/witcher3')).status,404);
  assert.equal((await guest.request('/users')).status,404);
});
test('9.1–9.4: cookie, MongoDB, счётчик и независимые сессии',async()=>{
  const visitor=browserClient();
  const first=await visitor.request('/');
  assert.match(first.body,/id="visitCounter">1/);
  const sidCookie=first.headers.getSetCookie().find(x=>x.startsWith('connect.sid='));
  assert.match(sidCookie,/HttpOnly/);assert.match(sidCookie,/SameSite=Lax/);
  const ms=new Date(sidCookie.match(/Expires=([^;]+)/)[1]).getTime()-Date.now();
  assert.ok(ms>57000&&ms<=60000);
  assert.match(visitor.cookie,/cdprGreeting=/);
  await visitor.request('/stylesheets/cdpr.css');
  assert.match((await visitor.request('/')).body,/id="visitCounter">2/);
  const session=await client.db().collection('cdpr_sessions').findOne({_id:sessionId(visitor)});
  assert.equal(JSON.parse(session.session).counter,2);
  assert.equal(JSON.parse(session.session).greeting,'Welcome to CD PROJEKT RED');
  assert.match((await browserClient().request('/')).body,/id="visitCounter">1/);
  // Истекшую сессию отвергает сервер, даже если браузер ещё прислал старую cookie.
  await client.db().collection('cdpr_sessions').updateOne({_id:session._id},{$set:{expires:new Date(Date.now()-1000)}});
  assert.match((await visitor.request('/')).body,/id="visitCounter">1/);
  assert.notEqual(sessionId(visitor),session._id);
});
test('10.3–10.6: регистрация, смена SID, повторный вход и ошибка пароля',async()=>{
  const player=browserClient();await player.request('/');const anonymousId=sessionId(player);
  assert.equal((await player.login()).status,302);assert.notEqual(sessionId(player),anonymousId);
  assert.equal(await client.db().collection('cdpr_sessions').countDocuments({_id:anonymousId}),0);
  const home=await player.request('/');assert.match(home.body,/Привет, <strong>БелыйВолк<\/strong>/);
  const stored=await client.db().collection('cdpr_players').findOne({username:'БелыйВолк'});
  assert.equal(stored.password,undefined);assert.ok(!JSON.stringify(stored).includes('SilverSword2026'));
  const wrong=browserClient();const failure=await wrong.login('БелыйВолк','WrongPassword2026');
  assert.equal(failure.status,401);assert.match(failure.body,/alert alert-danger/);assert.match(failure.body,/Неверный пароль/);
  assert.equal((await wrong.request('/games/witcher3')).status,302);
  const existing=browserClient();assert.equal((await existing.login()).status,302);
  assert.equal(await client.db().collection('cdpr_players').countDocuments({username:'БелыйВолк'}),1);
  assert.ok(!(await existing.request('/logreg')).body.includes('alert alert-danger'));
});
test('8.3, 8.4, 9.5: все страницы и меню читают актуальные данные MongoDB',async()=>{
  const player=browserClient();await player.login();
  for(const id of ids) {
    const record=await client.db().collection('cdpr_games').findOne({gameId:id});
    const result=await player.request('/games/'+id);
    assert.equal(result.status,200);assert.ok(result.body.includes('<h1>'+record.title+'</h1>'));
    assert.ok(result.body.includes(record.desc));assert.ok(result.body.includes(record.cover));
  }
  const catalog=client.db().collection('cdpr_games');
  const original=await catalog.findOne({gameId:'gwent'});
  try {
    await catalog.updateOne({gameId:'gwent'},{$set:{title:'ГВИНТ: обновлённое имя',desc:'Описание непосредственно из MongoDB'}});
    const page=await player.request('/games/witcher3');assert.match(page.body,/ГВИНТ: обновлённое имя/);
    assert.match((await player.request('/games/gwent')).body,/Описание непосредственно из MongoDB/);
    assert.match((await player.request('/')).body,/Описание непосредственно из MongoDB/);
  } finally {await catalog.updateOne({gameId:'gwent'},{$set:{title:original.title,desc:original.desc}});}
  assert.equal((await player.request('/games/not-in-catalog')).status,404);
});
test('10.7: выход уничтожает MongoDB-сессию и закрывает доступ со старой cookie',async()=>{
  const player=browserClient();await player.login();
  assert.match((await player.request('/')).body,/action="\/logout" method="post"/);
  const oldCookie=player.cookie, id=sessionId(player);
  assert.equal((await player.request('/logout')).status,404);
  assert.equal((await player.request('/games/witcher3')).status,200);
  const result=await player.request('/logout',{method:'POST'});
  assert.equal(result.status,302);assert.match(result.headers.getSetCookie().join(' '),/connect.sid=;/);
  assert.equal(await client.db().collection('cdpr_sessions').countDocuments({_id:id}),0);
  player.cookie=oldCookie;assert.equal((await player.request('/games/witcher3')).status,302);
});
test('10.3: некорректные формы, NoSQL-параметры и HTML обрабатываются без создания игроков',async()=>{
  const guest=browserClient();const before=await client.db().collection('cdpr_players').countDocuments();
  for(const body of [ {}, {username:{$ne:null},password:'SilverSword2026'}, {username:'<script>alert(1)</script>',password:'SilverSword2026'}, {username:'Ведьмак',password:'short'}, {username:'Ведьмак',password:['SilverSword2026']}]) {
    const result=await guest.request('/logreg',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    assert.equal(result.status,400);assert.ok(!result.body.includes('<script>alert(1)</script>'));
  }
  assert.equal(await client.db().collection('cdpr_players').countDocuments(),before);
  const large=await guest.request('/logreg',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'Ведьмак',password:'x'.repeat(20000)})});
  assert.equal(large.status,413);
});
test('10.8: удалённый профиль больше не даёт доступ через существующую сессию',async()=>{
  const player=browserClient();await player.login('УдалённыйВедьмак');
  await client.db().collection('cdpr_players').deleteOne({username:'УдалённыйВедьмак'});
  assert.equal((await player.request('/games/cyberpunk')).status,302);
});
test('9.3: вход сохраняется после запуска нового процесса Express',async()=>{
  const player=browserClient();await player.login();
  const child=spawn(process.execPath,['bin/www'],{cwd:path.resolve(__dirname,'..'),env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe'],windowsHide:true});
  let errors='';child.stderr.on('data',chunk=>errors+=chunk);
  try {
    const port=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('Server start timeout: '+errors)),10000);
      child.stdout.on('data',chunk=>{const match=String(chunk).match(/Listening on port (\d+)/);if(match){clearTimeout(timer);resolve(match[1]);}});
      child.once('exit',code=>{clearTimeout(timer);reject(Error('Server exited '+code+': '+errors));});
    });
    const result=await fetch('http://127.0.0.1:'+port+'/games/witcher3',{headers:{Cookie:player.cookie},redirect:'manual'});
    assert.equal(result.status,200);assert.match(await result.text(),/Ведьмак 3/);
  } finally {child.kill();await new Promise(resolve=>child.once('exit',resolve));}
});

const {test,before,after} = require('node:test');
const assert = require('node:assert/strict');
const {randomUUID} = require('node:crypto');
const mongoose = require('mongoose');
const {CDPRPlayer} = require('../models/cdprPlayer');
const database = 'cdpr_guide_test_' + randomUUID().replaceAll('-', '');
before(async()=>{await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', {dbName:database});await CDPRPlayer.init();});
after(async()=>{if(mongoose.connection.name===database)await mongoose.connection.dropDatabase();await mongoose.disconnect();});
test('10.2: хеш с солью, виртуальный пароль и дата создания', async()=>{
 const first=await CDPRPlayer.create({username:'БелыйВолк',password:'SilverSword2026'});
 const second=await CDPRPlayer.create({username:'НочнойГород',password:'SilverSword2026'});
 assert.notEqual(first.salt,second.salt);assert.notEqual(first.hashedPassword,second.hashedPassword);
 assert.equal(first.checkPassword('SilverSword2026'),true);assert.equal(first.checkPassword('wrong'),false);
 const raw=await CDPRPlayer.collection.findOne({_id:first._id});
 assert.equal(raw.password,undefined);assert.ok(raw.created instanceof Date);assert.ok(!JSON.stringify(raw).includes('SilverSword2026'));
 const publicPlayer=await CDPRPlayer.findById(first._id);assert.equal(publicPlayer.salt,undefined);assert.equal(publicPlayer.hashedPassword,undefined);
});
test('10.2: обязательные поля и уникальное имя игрока',async()=>{
 await assert.rejects(CDPRPlayer.create({username:'БезПароля'}),error=>Boolean(error.errors.hashedPassword&&error.errors.salt));
 await assert.rejects(CDPRPlayer.create({username:'БелыйВолк',password:'SilverSword2026'}),error=>error.code===11000);
});

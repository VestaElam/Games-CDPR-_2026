// Пункт 3.4. Отдельная коллекция для упражнений, чтобы сохранить итог пункта 3.3.
db = db.getSiblingDB('learn');
if (db.unicorns_syntax.countDocuments({}) === 0) {
  db.unicorns_syntax.insertMany(db.unicorns.find({}).toArray());
}
const unicorns = db.unicorns_syntax;

// 1. name: вместо name=; правильное имя Roodles.
printjson(unicorns.updateOne({ name: 'Roodles' }, { $inc: { weight: -10 } }));
// 2. В пособии ошибочно unicorn вместо unicorns.
printjson(unicorns.updateOne({ name: 'Kenny' }, { $set: { weight: 603 } }));
// 3. Условия в одном аргументе find; поля gender нет, используется color.
printjson(unicorns.find({ color: 'black', weight: { $gt: 500 } }, { _id: 0 }).toArray());
// 4. Направление сортировки: -1 — по убыванию.
printjson(unicorns.find({}, { _id: 0 }).sort({ vampires: -1 }).toArray());
// 5. Фильтр должен быть объектом.
printjson(unicorns.find({ name: 'Pilot' }, { _id: 0 }).toArray());
// 6. updateOne принимает отдельные объекты фильтра и изменения.
printjson(unicorns.updateOne({ name: 'Pilot' }, { $pull: { loves: 'apple' } }));
// 7. color и weight должны быть в одном фильтре.
printjson(unicorns.find({ color: 'white', weight: { $lt: 500 } }, { _id: 0 }).toArray());
// 8. $inc — оператор верхнего уровня в объекте изменения.
printjson(unicorns.updateOne({ name: 'Pilot' }, { $inc: { vampires: 2 } }));
// 9. Добавлены фигурные скобки вокруг изменения, исправлены кавычки.
printjson(unicorns.updateOne({ name: 'Roodles' }, { $inc: { weight: -10 } }));
// 10. Оператор $gt с префиксом $.
printjson(unicorns.find({ color: 'white', weight: { $gt: 500 } }, { _id: 0 }).toArray());
// 11. $gte вместо несуществующего $ghe.
printjson(unicorns.find({ $or: [{ loves: 'apple' }, { vampires: { $gte: 63 } }] }, { _id: 0 }).toArray());

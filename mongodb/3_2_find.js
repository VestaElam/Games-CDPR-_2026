// Пункт 3.2. Выполнить после посева, до UPDATE.
db = db.getSiblingDB('learn');
function result(number, filter, countOnly) {
  print('Задание ' + number);
  printjson(countOnly ? db.unicorns.countDocuments(filter) : db.unicorns.find(filter, { _id: 0, name: 1 }).toArray());
}
result(1, { color: 'black', weight: { $gt: 700 } });
result(2, { color: { $ne: 'black' }, weight: { $gte: 701 } });
result(3, { vampires: { $exists: false } });
result(4, { color: 'white', weight: { $lt: 500 } });
result(5, { weight: { $ne: 600 } }, true);
result(6, { color: 'black', $or: [{ loves: 'watermelon' }, { weight: { $gt: 900 } }] });
result(7, { $or: [{ loves: 'apple' }, { loves: 'carrot' }] }, true);
result(8, { $nor: [{ loves: 'apple' }, { loves: 'carrot' }] }, true);
// В условии задания 9 — виноград или морковка; в решении пособия опечатка: lemon.
result(9, { $or: [{ loves: 'grape' }, { loves: 'carrot' }] });
result(10, { $or: [{ loves: 'apple' }, { vampires: { $gte: 63 } }] });

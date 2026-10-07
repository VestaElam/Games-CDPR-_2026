// Пункт 3.3. Выполнять один раз на исходных 12 документах.
// Повторный запуск пропускает уже выполненные относительные изменения.
db = db.getSiblingDB('learn');
if (!db.unicorns.findOne({ name: 'Aurora', weight: 450 }) ||
    !db.unicorns.findOne({ name: 'Roodles', weight: 575 }) ||
    !db.unicorns.findOne({ name: 'Pilot', vampires: 54 })) {
  print('UPDATE пропущен: упражнения уже выполнены или данные отличаются от исходных.');
} else {
  print('11. Roodles похудел на 10');
  printjson(db.unicorns.updateOne({ name: 'Roodles' }, { $inc: { weight: -10 } }));
  print('12. Pilot убил ещё 2 вампиров');
  printjson(db.unicorns.updateOne({ name: 'Pilot' }, { $inc: { vampires: 2 } }));
  print('13. Aurora полюбила сахар');
  printjson(db.unicorns.updateOne({ name: 'Aurora' }, { $push: { loves: 'sugar' } }));
  print('14. Aurora привита');
  printjson(db.unicorns.updateOne({ name: 'Aurora' }, { $set: { vaccinated: true } }));
  print('15. Привитые единороги');
  printjson(db.unicorns.find({ vaccinated: true }, { _id: 0 }).toArray());
  print('16. Dunx разлюбил виноград');
  printjson(db.unicorns.updateOne({ name: 'Dunx' }, { $pull: { loves: 'grape' } }));
  print('17. Вес Aurora увеличился вдвое');
  printjson(db.unicorns.updateOne({ name: 'Aurora' }, { $mul: { weight: 2 } }));
}
printjson(db.unicorns.find({ name: { $in: ['Roodles', 'Pilot', 'Aurora', 'Dunx'] } }, { _id: 0 }).toArray());

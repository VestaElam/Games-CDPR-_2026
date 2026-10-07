// Пункт 3.1. Запуск из корня проекта: mongosh --file mongodb/3_1_seed.js
// Создание и удаление демонстрируем только на отдельной новой базе.
const demo = db.getSiblingDB('learn_creation_demo_2026');
if (demo.getCollectionNames().length === 0) {
  demo.unicorns.insertOne({ name: 'Aurora', color: 'white', weight: 450 });
  printjson({ demoDatabase: demo.getName(), collections: demo.getCollectionNames(), count: demo.unicorns.countDocuments({}) });
  printjson(demo.dropDatabase());
} else {
  print('Демонстрация удаления пропущена: база уже существует и содержит данные.');
}
db = db.getSiblingDB('learn');

const unicorns = [
  { name: 'Horny', birthday: new Date(1992, 2, 13, 7, 47), loves: ['carrot', 'papaya'], weight: 600, color: 'black', vampires: 63 },
  { name: 'Aurora', birthday: new Date(1991, 0, 24, 13, 0), loves: ['carrot', 'grape'], weight: 450, color: 'white', vampires: 43 },
  { name: 'Unicrom', birthday: new Date(1973, 1, 9, 22, 10), loves: ['energon', 'redbull'], weight: 984, color: 'black', vampires: 182 },
  { name: 'Roodles', birthday: new Date(1979, 7, 18, 18, 44), loves: ['apple'], weight: 575, color: 'black', vampires: 99 },
  { name: 'Solnara', birthday: new Date(1985, 6, 4, 2, 1), loves: ['apple', 'carrot', 'chocolate'], weight: 550, color: 'white', vampires: 80 },
  { name: 'Ayna', birthday: new Date(1998, 2, 7, 8, 30), loves: ['strawberry', 'lemon'], weight: 733, color: 'white', vampires: 40 },
  { name: 'Kenny', birthday: new Date(1997, 6, 1, 10, 42), loves: ['grape', 'lemon'], weight: 690, color: 'black', vampires: 39 },
  { name: 'Raleigh', birthday: new Date(2005, 4, 3, 0, 57), loves: ['apple', 'sugar'], weight: 421, color: 'black', vampires: 2 },
  { name: 'Leia', birthday: new Date(2001, 9, 8, 14, 53), loves: ['apple', 'watermelon'], weight: 601, color: 'white', vampires: 33 },
  { name: 'Pilot', birthday: new Date(1997, 2, 1, 5, 3), loves: ['apple', 'watermelon'], weight: 650, color: 'black', vampires: 54 },
  { name: 'Nimue', birthday: new Date(1999, 11, 20, 16, 15), loves: ['grape', 'carrot'], weight: 540, color: 'white' },
  { name: 'Dunx', birthday: new Date(1976, 6, 18, 18, 18), loves: ['grape', 'watermelon'], weight: 704, color: 'black', vampires: 165 }
];

// Данные добавляются только в пустую коллекцию, существующие документы сохраняются.
if (db.unicorns.countDocuments({}) === 0) {
  printjson(db.unicorns.insertMany(unicorns));
} else {
  print('Коллекция уже содержит данные: посев пропущен.');
}
printjson({ database: db.getName(), collections: db.getCollectionNames(), count: db.unicorns.countDocuments({}) });

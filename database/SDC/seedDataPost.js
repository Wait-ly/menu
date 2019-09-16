const { createMenu, createDish, foodCategories, mainCategories, subCatMap, subCatArr } = require('./generateData.js');
const faker = require('faker');
const fs = require('fs');
const Promise = require('bluebird');
const { menuSeed, dishSeed, itemSubCatJoinSeed, connectDB, disconnectDB, truncateTables } = require('./postgresqlSchema.js');

let dishCounter = 0;
let menuCounter = 0;
let subCatItemJoinCounter = 0;
const numMenusTotal = 1000000;
const numMenusPerWrite = 10000;
let subCatItemJoin = '';
let menuFilePath = './database/SDC/menus.csv';
let dishFilePath = './database/SDC/dishes.csv';
let subCatItemJoinPath = './database/SDC/subCatItemJoin.csv';
let menuFile = fs.createWriteStream(menuFilePath);
let dishFile = fs.createWriteStream(dishFilePath);
let subCatItemJoinFile = fs.createWriteStream(subCatItemJoinPath);
let dishesInfo = '';
let menuInfo = '';
let dishIds = [];
let dish = '';
let menu = '';
menuFile.write('id,name\n');
dishFile.write('id,name,description,price,subCategory\n');
subCatItemJoinFile.write('id,subcat_id,item_id\n');

var secondsToReadableTime = (timeInSeconds) => {
  var hours = 0;
  var minutes = 0;
  var seconds = timeInSeconds;
  hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  var result = '';
  if (hours > 0) {
    result += `${hours.toFixed(0)} hours, `;
  }
  if (minutes > 0) {
    result += `${minutes.toFixed(0)} minutes, `;
  }
  if (seconds > 0) {
    result += `${seconds.toFixed(2)} seconds`;
  }
  return result;
}

const createDishes = () => {
  for (let j = 0; j < 45; j++) {
    dishCounter++;
    dish = createDish(dishCounter);
    dish.name = faker.lorem.word();
    dish.subCategory = subCatArr[Math.floor( j / 3 )];
    dishIds.push(dishCounter);
    dishesInfo += `${dish.id},${dish.name},${dish.description},${dish.price},${dish.subCategory}\n`;
  }
}

const createMenus = () => {
  for (let i = 0; i < numMenusPerWrite; i++) {
    createDishes();
    menuCounter++;
    menu = createMenu(dishIds);
    menuInfo += `${menuCounter},${faker.lorem.word()}\n`;
    dishIds = [];
    mainCategories.forEach((category) => {
      foodCategories[category].forEach((subCategory) => {
        menu[category][subCategory].forEach((item) => {
          subCatItemJoinCounter++;
          subCatItemJoin += `${subCatItemJoinCounter},${subCatMap[subCategory]},${item}\n`;
        });
      });
    });
  }
  console.log(`% Completion with creation: ${(menuCounter / numMenusTotal * 100).toFixed(2)}%`);
  projectedTime = (((Date.now() - start) / menuCounter).toFixed(6) / 1000) * numMenusTotal;
  console.log(`Projected amount of time to create ${numMenusTotal} menus to DB: ${secondsToReadableTime(projectedTime)}`);
}

const write = (writer, data) => {
  return new Promise((resolve) => {
    if (!writer.write(data)) {
      writer.once('drain', resolve)
    }
    else {
      resolve()
    }
  })
}

const start = Date.now();
let elapsed = 0;
let projectedTime = 0;
connectDB( async (err) => {
  if (err) {
    console.log(err);
  } else {
    const passes = numMenusTotal / numMenusPerWrite;
    console.log(passes);
    for (var i = 1; i <= passes; i++) {
      createMenus();
      await write(menuFile, menuInfo);
      await write(dishFile, dishesInfo);
      await write(subCatItemJoinFile, subCatItemJoin);
      dishesInfo = '';
      menuInfo = '';
      subCatItemJoin = '';
    }
    dishSeed(() => {
      menuSeed(() => {
        itemSubCatJoinSeed(() => {
          console.log(`CSV files have been generated`);
          elapsed = ((Date.now() - start) / 1000).toFixed(2);
          console.log(`Done, seeded ${menuCounter} menus and ${dishCounter} dishes in ${secondsToReadableTime(elapsed)}.`);
          disconnectDB();
        });
      });
    });
  }
});
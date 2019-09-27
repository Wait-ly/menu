const { createMenu, createDish, foodCategories, mainCategories, mainCategoriesMap, subCatMap, subCatArr } = require('./generateData.js');
const faker = require('faker');
const fs = require('fs');
const Promise = require('bluebird');
const { menuSeed, dishSeed, itemSubCatJoinSeed, menuCatSeed, connectDB, disconnectDB, truncateTables } = require('./postgresqlSchema.js');

let dishCounter = 0;
let menuCounter = 0;
let subCatItemJoinCounter = 0;
let menuCatJoinCounter = 0;

const numMenusTotal = 10000000;
const numMenusPerWrite = 10000;
const dishesPerMenu = 10;

let menuFilePath = '/home/ec2-user/menu/database/SDC/menus_1.csv';
let dishFilePath = '/home/ec2-user/menu/database/SDC/dishes_1.csv';
let subCatItemJoinPath = '/home/ec2-user/menu/database/SDC/subCatItemJoin_1.csv';


let menuFile = fs.createWriteStream(menuFilePath);
let dishFile = fs.createWriteStream(dishFilePath);
let subCatItemJoinFile = fs.createWriteStream(subCatItemJoinPath);


menuFile.write('id,name\n');
dishFile.write('id,name,description,price,business_id,subcat_id,cat_id\n');
subCatItemJoinFile.write('id,subcat_id,item_id\n');


let dishesInfo = '';
let menuInfo = '';
let subCatItemJoin = '';


let dishIds = [];
let dish = '';
let menu = '';

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
let arr = [];
Object.keys(foodCategories).forEach((cat) => {
  arr = arr.concat(foodCategories[cat]);
})
const totalSubCats = arr.length;
const itemsPerSubCat = Math.floor(dishesPerMenu / totalSubCats);
const itemsPerCat = mainCategories.map((cat) => {
  return foodCategories[cat].length * itemsPerSubCat;
});

const createDishes = () => {
  for (let j = 0; j < dishesPerMenu; j++) {
    dishCounter++;
    dish = createDish(dishCounter);
    dishIds.push(dishCounter);
    let subCatId = Math.floor(j / 1) + 1;
    if (subCatId === 4) {
      subCatId = 1;
    } else if (subCatId > 4) {
      subCatId -= 1;
    }
    dishesInfo += `${dish.id},${dish.name},${dish.description},${dish.price},${menuCounter},${subCatId},${Math.floor(j / 2) + 1}\n`;
  }
}

const createMenus = () => {
  for (let i = 0; i < numMenusPerWrite; i++) {
    menuCounter++;
    createDishes();
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
//    for (let i = 1; i <= passes; i++) {
//      createMenus();
//      await write(menuFile, menuInfo);
//      await write(dishFile, dishesInfo);
//      await write(subCatItemJoinFile, subCatItemJoin);
//      dishesInfo = '';
//      menuInfo = '';
//      subCatItemJoin = '';
//
//    }
    elapsed = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`CSV files have been generated.`);
    console.log(`Done, generated table info for ${menuCounter} menus and ${dishCounter} dishes in ${secondsToReadableTime(elapsed)}.`);
    console.log(`onto seeding...`);
    menuSeed(menuFilePath, (err) => {
      if (err) {
        console.log(err);
        disconnectDB();
      } else {
        elapsed = ((Date.now() - start) / 1000).toFixed(2);
        console.log(`1 - seeded menus table, elapsed time: ${secondsToReadableTime(elapsed)}`);
        dishSeed(dishFilePath, (err) => {
          if (err) {
            console.log(err);
            disconnectDB();
          } else {
            elapsed = ((Date.now() - start) / 1000).toFixed(2);
            console.log(`2 - seeded dishes table, elapsed time: ${secondsToReadableTime(elapsed)}`);
            itemSubCatJoinSeed(subCatItemJoinPath, (err) => {
              if (err) {
                console.log(err);
                disconnectDB();
              } else {
                console.log('3 - seeded subCatItemJoin table');
                elapsed = ((Date.now() - start) / 1000).toFixed(2);
                console.log(`Done, seeded ${menuCounter} menus and ${dishCounter} dishes in ${secondsToReadableTime(elapsed)}.`);
                disconnectDB();
              }
            });
          }
        });
      }
    });
  }
});

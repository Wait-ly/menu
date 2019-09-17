const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'menus' });
const fs = require('fs');
const { createMenu, createDish, foodCategories, mainCategories, subCatMap, subCatArr } = require('./generateData.js');

// CREATE TABLE menus.dishes (
//   restaurant_id int,
//   category TEXT,
//   subCategory TEXT,
//   name TEXT,
//   description TEXT,
//   price decimal,
//   PRIMARY KEY (restaurant_id, category, subCategory)
// );
let dishCounter = 1;
let menuCounter = 1;
const menuTotal = 10000000;
const dishesPerMenu = 10;
let itemCSV = '';

let menuItemsFilePath = './database/SDC/cassandraMenus.csv';
let menuItemsFile = fs.createWriteStream(menuItemsFilePath);
menuItemsFile.write('restaurant_id,category,subCategory,name,description,price\n');

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

const createDishes = (total) => {
  let dishes = {};
  for (let i = 0; i < total; i++) {
    dishes[dishCounter] = createDish(dishCounter);
    dishCounter++;
  }
  return dishes;
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

const createMenus = async (chunkTotal) => {
  for (let i = 0; i < chunkTotal; i++) {
    let dishes = createDishes(dishesPerMenu);
    let dishIds = Object.keys(dishes).map((dishId) => {
      // console.log(dishes[dishId])
      return dishes[dishId].id;
    })
    let menu = createMenu(dishIds);

    mainCategories.forEach((category) => {
      foodCategories[category].forEach((subCategory) => {
        menu[category][subCategory].forEach((dishId) => {
          itemCSV += `${menuCounter},'${category}','${subCategory}','${dishes[dishId].name}','${dishes[dishId].description}',${dishes[dishId].price}\n`
        });
      });
    });
    menuCounter++;
  }
  elapsed = (Date.now() - start) / 1000;
  console.log(`% Completion with creation: ${(menuCounter / menuTotal * 100).toFixed(2)}%`);
  projectedTime = (((Date.now() - start) / menuCounter).toFixed(6) / 1000) * menuTotal;
  console.log(`Projected amount of time to create ${menuTotal} menus to DB: ${secondsToReadableTime(projectedTime)}`);
}

const start = Date.now();
let elapsed = start;

const run = async (total) => {
  let chunkTotal = total / 10000;
  for (let i = 0; i < 10000; i++) {
    createMenus(chunkTotal);
    await write(menuItemsFile, itemCSV);
    itemCSV = '';
  }
}

run(menuTotal);




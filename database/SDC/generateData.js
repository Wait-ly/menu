const faker = require('faker');
const Chance = require('chance');

const foodCategories = { 'Breakfast': [ 'Skillets', 'Omelets', 'Side Orders' ],
                              'Lunch': [ 'Starters', 'Soups and Salads', 'Entrees' ],
                              'Dinner': [ 'Appetizers', 'Main', 'Sides' ],
                              'Dessert': [ 'Ice Cream', 'Pies', 'Shakes' ],
                              'Drinks': [ 'Soft Drinks', 'Beer', 'Wine' ]
};
const mainCategories = Object.keys(foodCategories);
let subCatIds = 1;
let subCatMap = {};
let subCatArr = [];
mainCategories.forEach((category) => {
  foodCategories[category].forEach((subCat) => {
    if (!subCatMap[subCat]) {
      subCatArr.push(subCat);
      subCatMap[subCat] = subCatIds;
      subCatIds++;  
    }
  });
});
let numSubCat = subCatArr.length;
// Dish Generation
const createDish = (i) => {
  const desc = faker.lorem.sentence();
  const dish = {
    id: i,
    description: desc,
    price: (Math.random() * 100 + 5).toFixed(2),
  };
  return dish;
};

// Menu Generation
const createMenu = (dishIds) => {
  let menu = {};
  let dIds = dishIds;
  let numDishes = dishIds.length;
  mainCategories.forEach((category) => {
    let obj = {};
    foodCategories[category].forEach((subCategory) => {
      let itemList = dIds.slice(0,Math.floor(numDishes / numSubCat));
      dIds = dIds.slice(Math.floor(numDishes / numSubCat));
      obj[subCategory] = itemList;
    });
    menu[category] = obj;
  });
  return menu;
}

module.exports = {
  createMenu,
  createDish,
  foodCategories,
  mainCategories,
  subCatMap,
  subCatArr
};

// const start = Date.now();
// let data = createData();
// let elapsed = Date.now() - start;
// elapsed = (elapsed / 1000).toFixed(2);
// console.log(`Completed data generation, took ${secondsToReadableTime(elapsed)} to generate ${numMenus} menus.`);

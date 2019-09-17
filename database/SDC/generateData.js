const faker = require('faker');
const Chance = require('chance');

const foodCategories = { 'Breakfast': [ 'Entrees', 'Side Orders' ],
                              'Lunch': [ 'Starters', 'Entrees' ],
                              'Dinner': [ 'Appetizers', 'Main' ],
                              'Dessert': [ 'Ice Cream', 'Shakes' ],
                              'Drinks': [ 'Soft Drinks', 'Alcohol' ]
};
const mainCategories = Object.keys(foodCategories);
const mainCategoriesMap = {};
mainCategories.forEach((cat, idx) => {
  mainCategoriesMap[cat] = idx + 1;
})
let subCatIds = 1;
let subCatMap = {};
let subCatArr = [];
mainCategories.forEach((category, idx) => {
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
    name: faker.lorem.word(),
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
  mainCategoriesMap,
  subCatMap,
  subCatArr
};
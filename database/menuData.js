/* eslint-disable no-plusplus */
const faker = require('faker');
const Chance = require('chance');

const chance = Chance();

const mealOptions = ['Cocktails', 'Bar', 'Dinner', 'Brunch', 'Cheese', 'Lunch', 'Dessert'];

const foodCategories = ['Raw Bar', 'Snacks', 'Appetizers', 'Cheese', 'Absinthe Classics', 'Entrees', 'Sides', 'Small Plates', 'Soups & Salads', 'Pastries', 'Main', 'Desserts', 'After-dinner Spirits', 'Selection of Brandy', 'Selected Single-malt Scotches', 'Port, Sherry, & Madeira', 'Dessert Wines', 'Selection of Tea', 'Cocktails'];

const createMenu = (id) => {
  const rngArr = (array, max) => chance.pickset(array, chance.integer({ min: 1, max }));
  const rng = () => chance.integer({ min: 4, max: 12 });
  const createDish = () => {
    const desc = faker.lorem.sentence();
    const dish = {
      description: desc,
      price: chance.floating({ min: 5, max: 200, fixed: 2 }),
    };
    return dish;
  };

  const createCategory = () => {
    const category = {};
    const rando = rng();
    for (let i = 0; i < rando; i++) {
      const dishName = faker.lorem.word();
      category[dishName] = createDish();
    }
    return category;
  };

  const createMeal = () => {
    const meal = {};
    const categories = rngArr(foodCategories, foodCategories.length);

    for (let i = 0; i < categories.length; i++) {
      meal[categories[i]] = createCategory();
    }
    return meal;
  };

  const createAMenu = () => {
    const menu = { id };
    const meals = rngArr(mealOptions, mealOptions.length);
    for (let i = 0; i < meals.length; i++) {
      menu[meals[i]] = createMeal();
    }
    return menu;
  };

  return createAMenu();
};

module.exports = { createMenu };

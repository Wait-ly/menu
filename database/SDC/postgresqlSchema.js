const { Client } = require('pg');
const fs = require('fs');
const { createMenu, createDish, foodCategories, mainCategories, subCatMap, subCatArr } = require('./generateData.js');

// const foodCategories = { 'Breakfast': [ 'Skillets', 'Omelets', 'Side Orders' ],
//                               'Lunch': [ 'Starters', 'Soups and Salads', 'Entrees' ],
//                               'Dinner': [ 'Appetizers', 'Main', 'Sides' ],
//                               'Dessert': [ 'Ice Cream', 'Pies', 'Shakes' ],
//                               'Drinks': [ 'Soft Drinks', 'Beer', 'Wine' ]
// };
// const mainCategories = Object.keys(foodCategories);
// let subCatIds = 1;
// let subCatMap = {};
// let subCatArr = [];
// mainCategories.forEach((category) => {
//   foodCategories[category].forEach((subCat) => {
//     if (!subCatMap[subCat]) {
//       subCatArr.push(subCat);
//       subCatMap[subCat] = subCatIds;
//       subCatIds++;
//     }
//   });
// });

let categoriesQuery = `INSERT INTO categories (id, name) VALUES `;
mainCategories.forEach((cat, idx) => {
  categoriesQuery += `(${idx+1},'${cat}'),`;
});
categoriesQuery = categoriesQuery.slice(0,categoriesQuery.length - 1) + `;`;
let subCategoriesQuery = `INSERT INTO subcategories (id, name) VALUES `;
Object.keys(subCatMap).forEach((subCat) => {
  subCategoriesQuery += `(${subCatMap[subCat]},'${subCat}'),`;
});
subCategoriesQuery = subCategoriesQuery.slice(0,subCategoriesQuery.length - 1) + `;`;
let catSubCatJoinQuery = `INSERT INTO catsubcatjoin (id, category_id, subcat_id) VALUES `;
let catSubCatCounter = 1;
mainCategories.forEach((cat, idx) => {
  foodCategories[cat].forEach((subCat) => {
    catSubCatJoinQuery += `(${catSubCatCounter},${idx + 1},${subCatMap[subCat]}),`;
    catSubCatCounter++;
  });
});
catSubCatJoinQuery = catSubCatJoinQuery.slice(0,catSubCatJoinQuery.length - 1) + `;`;
let menuCatJoinQuery = `INSERT INTO menuCategoryJoin (id, menu_id, category_id) `;
let menuCatJoinCounter = 1;
for (let i = 1; i <= 10000000; i++) {
  mainCategories.forEach((cat, idx) => {
    menuCatJoinQuery += `(${menuCatJoinCounter},${i},${idx+1}),`;
    menuCatJoinCounter++;
  });
}
menuCatJoinQuery += `;`;

const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'opentable',
  password: 'letstacoboutit'
});

const createTablesQuery = `DROP TABLE IF EXISTS menuitems; CREATE TABLE menuItems (
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  price float(2)  NOT NULL,
  subCategory VARCHAR(150) NOT NULL,
  PRIMARY KEY (id)
);
DROP TABLE IF EXISTS menus;

CREATE TABLE menus (
  id int NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);
DROP TABLE IF EXISTS menuCategoryJoin;

CREATE TABLE menuCategoryJoin (
  id int NOT NULL,
  menu_id int NOT NULL,
  category_id int NOT NULL,
  PRIMARY KEY (id)
);
DROP TABLE IF EXISTS subcategories;

CREATE TABLE subcategories (
  id int NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id int NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS catSubcatJoin;

CREATE TABLE catSubcatJoin (
  id int NOT NULL,
  category_id int NOT NULL,
  subcat_id int NOT NULL,
  PRIMARY KEY (id)
);
DROP TABLE IF EXISTS subcatItemJoin;

CREATE TABLE subcatItemJoin (
  id int NOT NULL,
  subcat_id int NOT NULL,
  item_id int NOT NULL,
  PRIMARY KEY (id)
);`;


client.connect()
  .then(() => {
    createTables();
  });
const createTables = () => {
  client.query(createTablesQuery, (err, result) => {
    if (err) {
      console.log('=======================================ERROR WILL ROBINSON, ERROR BEEP BOOP=======================================');
      console.log(err);
    } else {
      console.log('success');
      client.query(categoriesQuery, (err, result) => {
        if (err) {
          console.log('=======================================ERROR WILL ROBINSON, ERROR BEEP BOOP=======================================');
          console.log(err);
        } else {
          console.log('success');
          client.query(subCategoriesQuery, (err, result) => {
            if (err) {
              console.log('=======================================ERROR WILL ROBINSON, ERROR BEEP BOOP=======================================');
              console.log(err);
            } else {
              console.log('success');
              client.query(catSubCatJoinQuery, (err, result) => {
                if (err) {
                  console.log('=======================================ERROR WILL ROBINSON, ERROR BEEP BOOP=======================================');
                  console.log(err);
                } else {
                  console.log('success');
                  client.query(menuCatJoinQuery, (err, result) => {
                    if (err) {
                      console.log('=======================================ERROR WILL ROBINSON, ERROR BEEP BOOP=======================================');
                      console.log(err);
                    } else {
                      console.log('success');
                      module.exports.disconnectDB();
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

module.exports.connectDB = (callback) => {
  client.connect(callback);
}
module.exports.disconnectDB = (callback) => {
  client.end();
}

module.exports.truncateTables = (callback) => {
  client.query(`TRUNCATE menuItems; TRUNCATE menus;`, callback);
}


module.exports.dishSeed = (callback) => {
  client.query(`COPY menuItems FROM '/Users/user01/Desktop/git_tutorial/work/Menu/database/SDC/dishes.csv' CSV HEADER;`, callback)
}

module.exports.menuSeed = (callback) => {
  client.query(`COPY menus FROM '/Users/user01/Desktop/git_tutorial/work/Menu/database/SDC/menus.csv' CSV HEADER;`, callback)
}

module.exports.itemSubCatJoinSeed = (callback) => {
  client.query(`COPY menus FROM '/Users/user01/Desktop/git_tutorial/work/Menu/database/SDC/subCatItemJoin.csv' CSV HEADER;`, callback);
}
// client.query('SELECT $1::text as message', ['Hello world!'], (err, result) => {
//   if (err) {
//     console.log('=======================================ERROR WILL ROBINSON, ERROR BEEP BOOP=======================================');
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// })

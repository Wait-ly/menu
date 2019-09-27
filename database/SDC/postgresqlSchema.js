const { Client } = require('pg');
const fs = require('fs');
const { createMenu, createDish, foodCategories, mainCategories, subCatMap, subCatArr } = require('./generateData.js');

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


const client = new Client({
  user: 'power_user',
  host: '172.31.13.175',
  database: 'opentable',
  password: 'letstacoboutit'
});

const createTablesQuery = ` 
DROP TABLE IF EXISTS subcatItemJoin;
DROP TABLE IF EXISTS catSubcatJoin;
DROP TABLE IF EXISTS menuitems;
DROP TABLE IF EXISTS menus;
DROP TABLE IF EXISTS subcategories;
DROP TABLE IF EXISTS categories;

CREATE TABLE menus (
  id int NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE subcategories (
  id int NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE categories (
  id int NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE menuItems (
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  price float(2)  NOT NULL,
  business_id INT NOT NULL,
  subcat_id INT NOT NULL,
  cat_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (business_id) REFERENCES menus(id),
  FOREIGN KEY (cat_id) REFERENCES categories(id),
  FOREIGN KEY (subcat_id) REFERENCES subcategories(id)
);

CREATE TABLE catSubcatJoin (
  id int NOT NULL,
  category_id int NOT NULL,
  subcat_id int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (subcat_id) REFERENCES subcategories(id)
);

CREATE TABLE subcatItemJoin (
  id int NOT NULL,
  subcat_id int NOT NULL,
  item_id int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (subcat_id) REFERENCES subcategories(id),
  FOREIGN KEY (item_id) REFERENCES menuitems(id)
);`;


//client.connect()
//  .then(() => {
//    createTables();
//  })
//  .catch((err) => {
//    console.log(`Hit an error:       `, err)
//  });
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

module.exports.connectDB = (callback) => {
  client.connect(callback);
}
module.exports.disconnectDB = (callback) => {
  client.end();
}

module.exports.truncateTables = (callback) => {
  client.query(`TRUNCATE menuItems; TRUNCATE menus;`, callback);
}


module.exports.dishSeed = (path, callback) => {
  client.query(`COPY menuItems FROM '${path}' CSV HEADER;`, callback);
}

module.exports.menuSeed = (path, callback) => {
  client.query(`COPY menus FROM '${path}' CSV HEADER;`, callback);
}

module.exports.itemSubCatJoinSeed = (path, callback) => {
  client.query(`COPY subcatitemjoin FROM '${path}' CSV HEADER;`, callback);
}

module.exports.menuCatSeed = (path, callback) => {
  client.query(`COPY menucategoryjoin FROM '${path}' CSV HEADER;`, callback);
}


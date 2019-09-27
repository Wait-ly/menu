/* eslint-disable no-console */
const { Client } = require('pg');

const client = new Client({
  user: 'power_user',
  host: '52.53.196.227',
  database: 'opentable',
  password: 'letstacoboutit'
});

let maxMenuItemsId = 0;
let maxMenuId = 0;

client.connect()
  .then(() => {
    console.log('Connected to Postgresql database!');
    client.query('SELECT max(id) from menuitems; SELECT max(id) from menus;', (err, result) => {
      maxMenuItemsId = result[0].rows[0].max;
      maxMenuId = result[1].rows[0].max;
      console.log(`Max id in menuitems table: `, maxMenuItemsId);
      // maxMenuItemsId = result.rows[0].max;
    })
  });
// Postgresql functions
const { foodCategories, mainCategories, mainCategoriesMap, subCatMap, subCatArr } = require('./SDC/generateData.js');

let revSubCatMap = {};
Object.keys(subCatMap).forEach((subCatName) => {
  revSubCatMap[subCatMap[subCatName]] = subCatName;
});

let revCatMap = {};
Object.keys(mainCategoriesMap).forEach((catName) => {
  revCatMap[mainCategoriesMap[catName]] = catName;
});

const createMenuPG = (id, menu, callback) => {
  // console.log(menu);
  let newMenu = menu;
  let name = newMenu.name;
  delete newMenu.name;
  client.query(`INSERT INTO menus(id, name) values(${id}, '${name}');`, (err, result) => {
    if (err) {
      console.log(`Error at inserting new menu listing:   `, err);
      callback(err);
    } else {
      console.log(`inserted new menu listing, moving on to menuitems`);
      let menuItemsQuery = 'INSERT INTO menuitems (id, name, description,price,business_id,subcat_id,cat_id) values';
      // console.log(newMenu);
      Object.keys(newMenu).forEach((category) => {
        let catId = mainCategoriesMap[category];
        Object.keys(newMenu[category]).forEach((subCategory) => {
          let subCatId = subCatMap[subCategory];
          Object.keys(newMenu[category][subCategory]).forEach((menuItemName) => {
            let menuItem = newMenu[category][subCategory][menuItemName];
            maxMenuItemsId++;
            let thisMenuItem = `(${maxMenuItemsId},'${menuItemName}','${menuItem.description}',${menuItem.price},${id},${subCatId},${catId}),`;
            // console.log(thisMenuItem);
            menuItemsQuery += thisMenuItem;
            // console.log(`Max MenuItem ID: `, maxMenuItemsId);
          });
        });
      });
      menuItemsQuery = menuItemsQuery.slice(0,menuItemsQuery.length - 1) + ';';
      // console.log(menuItemsQuery);
      client.query(menuItemsQuery, (err, result) => {
        if (err) {
          console.log(`Error at inserting new menu items:   `, err);
          callback(err);
        } else {
          callback('success');
        }
      })
    }
  });
}

const readMenuPG = (id, callback) => {
  // console.log(`Reading menu at id=${id}`);
  const query = `select menus.name AS BUSINESS, menuitems.name, menuitems.description, menuitems.price, subcategories.name AS Subcategory, categories.name AS Category from menus, menuitems, subcategories, categories where menus.id=${id} and menuitems.business_id = menus.id and menuitems.subcat_id = subcategories.id AND menuitems.cat_id=categories.id;`;
  // console.log(query);
  client.query(query, (err, result) => {
    if (err) {
      callback(err);
    } else {
      // console.log(result.rows);
      let menu = {};
      result.rows.forEach((menuItem) => {
        let { name, description, price, category, subcategory } = menuItem;
        if (!menu[category]) {
          menu[category] = {};
        }
        if (!menu[category][subcategory]) {
          menu[category][subcategory] = {};
        }
        menu[category][subcategory][name] = {};
        menu[category][subcategory][name].description = description;
        menu[category][subcategory][name].price = price.toString();
      });
      // console.log(`Here's the menu object we are going to send back:\n        `, menu);
      callback(menu);
    }
  });
}

const updateMenuPG = (id, menu, callback) => {
  let newMenu = menu;
  client.query(`DELETE from menus where id=${id}`, (err, result) => {
    if (err) {
      console.log(`Error at deleting from menus table:`, err);
      callback(err);
    } else {
      client.query(`DELETE from menuItems where business_id=${id}`, (err, result) => {
        if (err) {
          console.log(`Error at deleting from menuItems:   `, err);
          callback(err);
        } else {
          createMenuPG(id, menu, callback);
        }
      });
    }
  });
}

const deleteMenuPG = (id, callback) => {
  client.query(`DELETE from menuitems where business_id=${id}`, (err) => {
    console.log(`Deleted from menuitems table`);
    if (err) {
      callback(err);
    } else {
      client.query(`DELETE from menus where id=${id} CASCADE;`, (err) => {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          console.log('Deleted from menus');
          callback('successfully deleted');
        }
      })
    }
  });
}

// Cassandra functions


module.exports = {  createMenuPG,
                    readMenuPG,
                    updateMenuPG,
                    deleteMenuPG
                 };

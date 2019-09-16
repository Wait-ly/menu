# Project Name

> Project description

## Related Projects

  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Some usage instructions

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```
## CRUD API

### CREATE

Route: 'POST /api/menu/:id'

  **Description**: Creates a menu entry in the database (as defined by property ':id' within the url).
               Responds with the result of the query execution.
               Expects a menu object with the following structure:

    let menu = { 
      mealType: {
        category: {
          dishName: {
            description: 'Braised lambshank over cauliflower mash',
            price: 23.95
          },...
        },...
      },...
    }

  **mealType**: Breakfast, lunch, dinner, brunch, etc.

  **category**: Appetizers, Sides, Entrees, Drinks, Desserts, etc.

  **dishName**: Name of a menu item.

  **description**: Description of menu item.

  **price**: price in $USD of menu item.

### READ

Route: 'GET /api/menu/:id'

  **Description**: Responds with a menu object for the associated business ID (':id').
               Menu will be in the structure as defined in the 'create' section.

### UPDATE

Route: 'PUT /api/menu/:id'

  **Description**: Updates a menu for the associated business ID with whatever menu object is provided.
                
### DELETE

Route: 'DELETE /api/menu/:id'

  **Description**: Deletes menu for the specified business ID (':id').


###Schemas

Postgresql: See diagram

Cassandra:

create keyspace menus with replication = {}

CREATE TABLE menuItems (
    id int,
    category VARCHAR(30),
    subCategory VARCHAR(30),
    name VARCHAR(30), // is text overkill?
    description VARCHAR(200),
    price decimal, // decimals
    PRIMARY KEY (id, category, subCategory)
)

Postgresql:

-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'menuItem'
-- 
-- ---
// add foreign keys into main table schemas : done
DROP TABLE IF EXISTS menuItems;
		
CREATE TABLE menuItems (
  id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  price float(2)  NOT NULL,
  subCategory VARCHAR(150) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'businesses'
-- 
-- ---

DROP TABLE IF EXISTS menus;
		
CREATE TABLE menus (
  id int NOT NULL,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'menuCategoryJoin'
-- 
-- ---

DROP TABLE IF EXISTS menuCategoryJoin;
		
CREATE TABLE menuCategoryJoin (
  id int NOT NULL,
  menu_id int NOT NULL,
  category_id int NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'subcategories'
-- 
-- ---

DROP TABLE IF EXISTS subcategories;
		
CREATE TABLE subcategories (
  id int NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'categories'
-- 
-- ---

DROP TABLE IF EXISTS categories;
		
CREATE TABLE categories (
  id int NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'catSubcatJoin'
-- 
-- ---

DROP TABLE IF EXISTS catSubcatJoin;
		
CREATE TABLE catSubcatJoin (
  id int NOT NULL,
  category_id int NOT NULL,
  subcat_id int NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table 'subcatItemJoin'
-- 
-- ---

DROP TABLE IF EXISTS subcatItemJoin;
		
CREATE TABLE subcatItemJoin (
  id int NOT NULL,
  subcat_id int NOT NULL,
  item_id int NOT NULL,
  PRIMARY KEY (id)
);

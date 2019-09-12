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

Route: '/api/menu/create'

  **Description**: Creates a menu entry in the database (as defined by property 'id' within the menu object).
               Responds with the result of the query execution.
               Expects a menu object with the following structure:

    let menu = {
      id: integer, 
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

Route: '/api/:id/menu/read'

  **Description**: Responds with a menu object for the associated business ID (':id').
               Menu will be in the structure as defined in the 'create' section.

### UPDATE

Route: '/api/menu/update'

  **Description**: Updates a menu for the associated business ID with whatever menu object is provided.
                
### DELETE

Route: '/api/:id/menu/delete'

  **Description**: Deletes menu for the specified business ID (':id').
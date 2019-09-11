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

Route: '/api/:L/menu/create'

Description: Creates a menu for the associated business ID (as defined by parameter ':L').
             If a menu is already created for said business it will be overwritten with the menu
             included in the body of the request.
             Will respond with either 'success' or the error encountered.
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

mealType: Breakfast, lunch, dinner, brunch, etc.
category: Appetizers, Sides, Entrees, Drinks, Desserts, etc.
dishName: Name of a menu item.
description: Description of menu item.
price: price in $USD of menu item.

### READ

Route: '/api/:L/menu/read'

Description: Responds with a menu object for the associated business ID.
             Menu will be in the structure as defined in the 'create' section.

### UPDATE

Route: '/api/:L/menu/update'

Description: Updates a menu for the associated business ID. 
             Expects an object that follows the structure of the existing menu.
             If the specified mealType, category or dishName is not already present
             in the menu, it will be added to the menu.
             Will respond with either 'success' or the error encountered.

### DELETE

Route: '/api/:L/menu/delete'

Description: Deletes a menu, or menu element, from the menu for the specified business.
             If the entire menu is to be deleted, no object is required in the request body.
             If only certain elements are to be deleted, then they must be defined up to the 'dishName' level.

For example, given the following menu:

    let menu = {
      Dinner: {
        Entrees: {
          'Lamb Shank': {
            description: 'Braised lambshank over cauliflower mash',
            price: 23.95
          },...
        },
        Drinks: {
          'Old Fashioned': {
            description: 'Bourbon, maraschino cherry, toasted orange peel, raw sugar cane juice',
            price: 13.50
          },
          'White Wine Spritzer': {
            description: 'Chilled chardonnay, club soda and lime slice'
          },...
        },...
      },
      Desserts: {
        Wines: {
          'Chocolate Wine': {
            description: 'Traditional dessert wine from the Andes mountains',
            price: 12.50
          },...
        },
        'Cold Dishes': {
          'Lemon Tart': {
            description: 'Traditional lemon pie decorated with seasonal fruits',
            price: 8.95
          }
        }
      }
    }


To delete the 'Lamb Shank' entree, the request object would be structured as follows:

    let request = {
      Dinner: {
        Entrees: ['Lamb Shank']
      }
    }

To delete the drinks section the request would be slightly different:

    let request = {
      Dinner: {
        Drinks: 'all'
      }
    }

Deleting the 'Desserts' category follows the same structure as deleting a section:

    let request = {
      Desserts: 'all'
    }

To delete all at the same time:

    let request = {
      Dinner: {
        entrees: ['Lamb Shank'],
        Drinks: 'all'
      },
      Desserts: 'all'
    }
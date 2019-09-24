'use strict';

module.exports = {
  generateRandomMenuIdTop90
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomMenuIdTop90(userContext, events, done) {
  // generate data with Faker:

  const menuIds = [];
  for (let i = 0; i < 100; i++) {
    menuIds.push(Math.floor((Math.random() * 1000000)) + 9000000);
  }
  // add variables to virtual user's context:
  userContext.vars.menuIds = menuIds;
  // continue with executing the scenario:
  return done();
}

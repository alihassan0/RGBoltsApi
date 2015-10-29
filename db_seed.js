#! /usr/bin/env node

var Promise = require('bluebird');
var mongoose = require('mongoose');
var inquirer = require("inquirer");
// Connecting to mongodb
mongoose.connect('mongodb://localhost/test_db');

var Users = require('./models/Users.js');

// Clearing the database
// TODO: make a generic one by passing the collections to be cleared
clearDatabase = function() {
  mongoose.connection.collections['users'].remove(function(err) {
    if (err) {
      throw err;
    }
  });
  console.log('database cleaned');
};

seed = function() {
  console.log('Database seed started ...');
  Users.create({
    levels: [{
      levelName: 'level_01',
      numberOfBlocks: 10,
      elapsedTime: 5
    }]
  });

  Users.create({
    levels: [{
      levelName: 'level_01',
      numberOfBlocks: 10,
      elapsedTime: 10
    }, {
      levelName: 'level_02',
      numberOfBlocks: 20,
      elapsedTime: 15
    }]
  });

  Users.create({
    levels: [{
      levelName: 'level_03',
      numberOfBlocks: 30,
      elapsedTime: 20
    }]
  });

  Users.create({
    levels: [{
      levelName: 'level_01',
      numberOfBlocks: 10,
      elapsedTime: 12
    }]
  });

  console.log('Seed completed');
};

inquirer.prompt({
  type: 'confirm',
  message: 'Do you need to clear the database ?',
  name: 'clear',
  default: 'Y'
}, function(answers) {
  if (answers['clear']) {
    Promise.fulfilled().then(clearDatabase()).then(seed()).then(function() {
      process.exit(0);
    });
  } else {
    Promise.fulfilled().then(seed()).then(function() {
      process.exit(0);
    });
  }
});

module.exports = {
  seed: seed,
  clearDatabase: clearDatabase
};

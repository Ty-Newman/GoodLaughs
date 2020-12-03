'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Laughs', [{
      body: 'Out of the red, my doctor told me I was colorblind.',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
     body: 'A burger walks into a bar. The bartender says \'Sorry, we don\'t serve food here\’.',
     userId: 2,
     createdAt: new Date(),
     updatedAt: new Date()
    },
    {
      body: 'Time flies like an arrow. Fruit flies like a banana.',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
     },
     {
      body: 'I\'m thinking of reasons to go to Switzerland. The flag is a big plus.',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
     },
     {
      body: 'A backwards poet writes inverse.',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
     },
     {
      body: 'What did the grape say when it was stepped on? Nothing, it just let out a little wine.',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      body: 'Have you played the updated kids\' game? I Spy With My Little iPhone.',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      body: 'A perfectionist walks into a bar and immediately leaves. Apparently, the bar wasn’t set high enough.',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      body: 'My three favorite things are eating my family and not using commas.',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      body: 'My brother is so cheap that when he dies, he\’s going to walk toward the light and turn it off.',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      body: 'Two guys stole a calendar. They got six months each.',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      body: 'Guy staring at an ambulance in front of Whole Foods: “Somebody must have accidentally eaten gluten.”',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
   },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Laughs', null, {});
  }
};

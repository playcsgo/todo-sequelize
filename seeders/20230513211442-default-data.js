'use strict';
const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '0000'
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('Users', [{
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
        createdAt: new Date(),
        updatedAt: new Date()
      }], {})
      .then(userId => queryInterface.bulkInsert('Todos',
      Array.from({ length: 10 }).map((_, i) =>
        ({
          name: `name-${i}`,
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), {}))
},
down: (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete('Todos', null, {})
    .then(() => queryInterface.bulkDelete('Users', null, {}))
}
}
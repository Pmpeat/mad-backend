'use strict';
const hashPassword = require('../utils/hashPassword');
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return Promise.all([
      queryInterface.bulkInsert(
        'users',
        [
          {
            firstName: 'mad',
            lastName: 'superadmin',
            email: 'superadmin@gmail.com',
            password: hashPassword("secret"),
            createdByUserId:null
          },
        ],
        {}
      ),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return Promise.all([queryInterface.bulkDelete('users', null, {})]);
  }
};

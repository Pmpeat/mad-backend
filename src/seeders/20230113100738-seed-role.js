'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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
        'roles',
        [
          {
            name: 'Mad',
            createdByUserId:null
          },
          {
            name: 'Admin',
            createdByUserId:null
          },
          {
            name: 'Chief',
            createdByUserId:null
          },
          {
            name: 'Employee',
            createdByUserId:null
          },
        ],
        {}
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return Promise.all([queryInterface.bulkDelete('roles', null, {})]);
  },
};

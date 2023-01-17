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
        'user_roles',
        [
          {
            userId: 1,
            roleId: 1
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
    return Promise.all([queryInterface.bulkDelete('user_roles', null, {})]);
  },
};

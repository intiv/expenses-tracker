'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('transactions', 'userId', {transaction: t})
      ])
    });
    // return queryInterface.createTable('transactions', {
    //   id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true
    //   },
    //   userId: {
    //     type: Sequelize.INTEGER
    //   },
    //   quantity: {
    //     type: Sequelize.DECIMAL(8,2),
    //     allowNull: false,
    //     validate: {
    //       min: {
    //         args: [0.01],
    //         msg: 'Quantity must be greater than 0'
    //       }
    //     }
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATEONLY
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATEONLY
    //   }
    // });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

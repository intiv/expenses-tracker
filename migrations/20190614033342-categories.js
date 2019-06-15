'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('categories', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Expense',
        validate: {
          notEmpty: true,
          isIn: {
            args: [['Expense', 'Income']],
            msg: 'Category must be either an Expense or an Income'
          }
        }
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: 1
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      }
    });

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};

const Sequelize = require('sequelize');
const db = require('../connect.js');
const User = require('./users.js');
const Category = require('./categories.js');

const Bento = db.define('bento', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  id_hash: Sequelize.STRING,
  description: Sequelize.STRING,
  nori_count: Sequelize.INTEGER,
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  visit_count: Sequelize.INTEGER,
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  category_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'categories',
      key: 'id'
    }
  }
});

module.exports = Bento;
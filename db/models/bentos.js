const Sequelize = require('sequelize');
const db = require('../index.js');
const User = require('./users.js');
const Category = require('./categories.js');

const Bento = db.define('bento', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  nori_count: Sequelize.INTEGER,
  private: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
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
      model: Category,
      key: 'id'
    }
  }
});

module.exports = Bento;
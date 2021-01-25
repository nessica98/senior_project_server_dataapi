require('dotenv').config()

module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    DB: process.env.DB,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
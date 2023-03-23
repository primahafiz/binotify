const path = require('path')
require('dotenv').config()

module.exports={
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    DIALECT: process.env.DIALECT,
    port: process.env.PORT,
}
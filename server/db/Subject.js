const Sequelize = require('sequelize');
const db = require('./db');

const Subject = db.define('subject', {
    name: {
        type: Sequelize.STRING,
    }
})

// Subject.addUser = function(user) {

//     console.log(this.__proto__)
// }
module.exports = Subject;
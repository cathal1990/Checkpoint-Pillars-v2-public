const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },

  userType: {
    type: Sequelize.STRING,
    defaultValue: 'STUDENT',
    allowNull: false,
    validate: {
      isIn: [['STUDENT', 'TEACHER']],
    }
  },

  isStudent: {
    type: Sequelize.DataTypes.VIRTUAL,
    get() {
      return this.userType === 'STUDENT' ? true : false;
    }
  },

  isTeacher: {
    type: Sequelize.DataTypes.VIRTUAL,
    get() {
      return this.userType === 'TEACHER' ? true : false;
    }
  }
});

User.findUnassignedStudents = async function() {
  const students = await User.findAll({
    where: {
      userType: 'STUDENT',
      mentorId: null,
    }
  })

  const promise = new Promise((resolve, reject) => {
    if (students) {
      resolve(students);
    }
    else {
      reject();
    }
  })
  return promise;
}

User.findTeachersAndMentees = async function() {
  const teachers = await User.findAll({
    where: {
      userType: 'TEACHER',
    },
    include: {
      model: User, as: 'mentees',
  }})

  return teachers
}



/**
 * We've created the association for you!
 *
 * A user can be related to another user as a mentor:
 *       SALLY (mentor)
 *         |
 *       /   \
 *     MOE   WANDA
 * (mentee)  (mentee)
 *
 * You can find the mentor of a user by the mentorId field
 * In Sequelize, you can also use the magic method getMentor()
 * You can find a user's mentees with the magic method getMentees()
 */

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });

module.exports = User;

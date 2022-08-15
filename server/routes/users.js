const router = require('express').Router();
const { parse } = require('pg-protocol');
const {
  models: { User },
} = require('../db');

/**
 * All of the routes in this are mounted on /api/users
 * For instance:
 *
 * router.get('/hello', () => {...})
 *
 * would be accessible on the browser at http://localhost:3000/api/users/hello
 *
 * These route tests depend on the User Sequelize Model tests. However, it is
 * possible to pass the bulk of these tests after having properly configured
 * the User model's name and userType fields.
 */

// Add your routes here:

router.get('/unassigned', async (req, res, next) => {
  try{
    const unassigned = await User.findUnassignedStudents();
    res.status(200).send(unassigned)
  }
  catch(err) {
    next(err)
  }
})

router.get('/teachers', async (req, res, next) => {
  try{
    const teachers = await User.findTeachersAndMentees();
    res.status(200).send(teachers)
  }
  catch(err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try{

    const id = req.params.id || 'invalid';
    if (!parseInt(req.params.id, 10)) { return res.sendStatus(400) }

    const deleted = await User.destroy({
      where: {
        id: id,
      }
    })

    if (deleted === 1) {
      res.sendStatus(204)
    }else {
      res.sendStatus(404)
    }
  }
  catch(err) {
    next(err)
  }
})

module.exports = router;

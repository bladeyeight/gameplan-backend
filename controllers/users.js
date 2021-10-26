// Dependencies
const bcrypt = require('bcrypt');
const express = require('express');
const userRouter = express.Router();
const User = require('../models/user.js');

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));

// Routes / Controllers
const userController = require('./controllers/users');
app.use('/users', userController);



// New (registration page)
userRouter.get('/new', async (req, res) => {
	try {
        // send all users
        res.json(await User.find({
          currentUser: req.session.currentUser
        }));
    } catch (error) {
        //send error
        res.status(400).json(error);
    }
});


// Create (registration route)
userRouter.post('/', async (req, res) => {
    //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    User.create(req.body, (error, createdUser) => {
        res.redirect('/');
    });
});
// Export User Router
module.exports = userRouter;
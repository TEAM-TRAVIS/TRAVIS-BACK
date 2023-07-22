// const UserModel = require('../models/userModel');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

exports.getMainPage = (req, res) => {
  const { name } = req.user;
  res.render('main', { name });
};

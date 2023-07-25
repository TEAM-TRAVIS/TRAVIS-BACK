const UserModel = require('../models/userModel');
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

exports.getMainPage = (req, res) => {
  try {
    console.log('메인페이지다');
    res.render('main');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

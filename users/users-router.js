const express = require('express');
const jwt = require('jsonwebtoken');
const Users = require('./users-model');
const restricted = require('../auth/restricted-middleware');

const router = express.Router();

const authError = {
  message: 'Invalid creds',
};

router.get('/', restricted, (req, res) => {
  console.log('endpoint hit');
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json(authError);
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json(authError);
      }
      req.token = decoded;
      console.log(decoded);
      Users.find().then(users => res.status(200).json(users));
    });
  }
});

module.exports = router;

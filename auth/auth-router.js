const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model');

router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await Users.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: 'Username is already taken',
      });
    }

    res.status(201).json(await Users.add(req.body));
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  const authError = {
    message: 'Invalid Credentials',
  };

  try {
    const { username, password } = req.body;

    const user = await Users.findBy({ username }).first();
    if (!user) {
      console.log('username:', username);
      return res.status(401).json(authError);
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      console.log(
        'submitted password: ',
        password + 'user password:',
        user.password
      );
      return res.status(401).json(authError);
    }

    const payload = {
      userId: user.id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.json({
      message: `Hello ${user.username}!`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

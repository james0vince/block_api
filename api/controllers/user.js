const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const CONSTANTS = require('../../lib/constants');

exports.user_signup = (req, res) => {
  User.findOne({ email: req.body.email })
  .exec()
  .then(doc => {
    if (doc) {
      res.status(409).json({
        message: 'Email exists'
      });
    } else {
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({
            error
          });
        }

        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
          profile: {
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              address: req.body.address
          },
          roles: [CONSTANTS.roles.USER]
        });

        user.save()
        .then(() => {
          res.status(201).json({
            message: 'User created'
          });
        })
        .catch(err => {
          res.status(200).json({ error: err });
        });
      });
    }
  })
  .catch();
};

exports.user_login = (req, res) => {
  User.findOne({ email: req.body.email })
  .exec()
  .then(user => {
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }

      if (result) {
        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
            roles: user.roles,  
            kyc: false
          },
         process.env.JWT_KEY,
         {
           expiresIn: '1h'
         }
       );
        return res.status(200).json({
          message: 'Auth successful',
          userId: user._id,
          expiresIn: 3600,
          token
        });
      }

      return res.status(401).json({
        message: 'Auth failed'
      });
    });
  })
  .catch(err => {
    res.status(200).json({ error: err });
  });
};

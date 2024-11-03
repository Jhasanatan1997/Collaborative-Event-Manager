const express = require("express");
const authController = require("../controllers/authController");
const errors = require('../utils/errors/error');
const validator = require('../validators/validator');
const { signupSchema, loginSchema } = require('../validators/schema/user-schema')

const router = express.Router();



router.post('/register', async (req, res, next) => {
  
    try {
      await validator.validateSchema(req.body, signupSchema );
      const result = await authController.register(req,res);
      res.status(201).json(result);
  
    } catch (error) {
      next(error);
    }
  });


router.post('/login', async (req, res, next) => {
  
    try {
      await validator.validateSchema(req.body, loginSchema );
      const result = await authController.login(req,res);
      res.status(200).json(result);
  
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
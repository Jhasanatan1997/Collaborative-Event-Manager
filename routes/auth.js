const express = require("express");
const authController = require("../controllers/authController");
const errors = require('../utils/errors/error');
const validator = require('../validators/validator');
const { signupSchema, loginSchema } = require('../validators/schema/user-schema')
const googleAuth = require("../utils/googleAuth");

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



router.get("/google", (req, res) => {
  const authURL = googleAuth.getAuthURL();
  res.redirect(authURL);
});

router.get("/google/callback", async (req, res) => {

  const code = req.query.code;

  try {
      const { tokens } = googleAuth.getToken(code);
      googleAuth.setCredentials(tokens);
      res.status(200).json({ message: "Google authentication successful", tokens });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
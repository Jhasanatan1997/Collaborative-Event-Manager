const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errors = require('../utils/errors/error');
const logUtil = require('../utils/logger');

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new errors.DuplicateData("Email already in use.");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({ name, email, passwordHash });
        await newUser.save();

        return { success: true, message: "User registered successfully." };

    } catch (error) {
        logUtil.appLogger(
            'error',
            req.body.email,
            'login',
            error.status,
            error.message
        );
        throw error;
    }
};


// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new errors.AuthenticationError('Invalid email or password')
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new errors.AuthenticationError('Invalid email or password');
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        return { token, user: { id: user._id, name: user.name, email: user.email } };

    } catch (error) {
        logUtil.appLogger(
            'error',
            req.body.email,
            'login',
            error.status,
            error.message
        );
        throw error;
    }
};
//create endpoints for user registration and login
//hash passwords using bcrypt

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

const { JWT_SECRET } = require('../config');

//user registration
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    //username check
    if (!username) {
      return res.status(400).json({ error: 'Invalid username' });
    }

    //password check
    if (!password || password.length < 7) {
      return res.status(400).json({ error: 'Password must be at least 7 characters long' });
    }

    //role check
    if (!['Admin', 'Faculty', 'Student'].includes(role)){
      return res.status(400).json({ error: 'Invalid role (Admin/ Faculty/ Student)' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role });

    res.status(201).json({ message: 'User registered successfully', user });

  } catch (error) {
    res.status(500).json({ error: error.message });
  
  }
};


//user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    
    }

    const token = jwt.sign({id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
    
  } catch (error) {
        res.status(500).json({ error: error.message });
  
    }
}
 
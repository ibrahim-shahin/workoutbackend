const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" })
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill out the missing fields" })
    }

    //find the user by email
    const user = await User.findOne({ email })

    if (user) {
      // check if the password is correct
      const match = await bcrypt.compare(password, user.password)

      if (match) {
        // create a token
        const token = createToken(user._id)
        return res.status(200).json({ email, token })
      }
      else {
        return res.status(400).json({ error: "Password is incorrect" })
      }
    }
    else {
      return res.status(400).json({ error: "Email doesn't exist" })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      throw Error('Please fill out the missing fields')
    }

    const exists = await User.findOne({ email })

    if (exists) {
      throw Error('Email already in use')
    }

    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minNumbers: 1, minUppercase: 0,  minSymbols: 0 })) {
      throw new Error('Password is not strong enough. It should be at least 8 characters long and contain at least one lowercase letter, and one number.');
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await User.create({ email, password: hash })
    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = { signupUser, loginUser }
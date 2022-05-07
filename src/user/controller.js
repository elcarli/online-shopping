const { User, Product } = require("../db");
const jwt = require("jsonwebtoken")
require('dotenv').config()

async function getAll(req, res, next) {
  try {
    const result = await User.find({}, '-password')
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getOne({ params: { id } }, res, next) {
  try {
    const user = await User.findById(id, '-password')
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function signin({ body: { name, email, password } }, res, next) {
  try {
    const users = await User.find({ email: email })
    if (users.length > 0) {
      res.status(400).json({ message: 'email already registered' })
    } else {
      const newUser = {
        name, email, password
      }
      let result = await User.create(newUser)

      const data = result.toObject()
      delete data.password

      res.status(201).json(data)
    }
  } catch (error) {
    next(error)
  }
}

async function edit({ params: { id }, body }, res, next) {
  try {
    const user = await User.findById(id, '-password')
    if (user) {
      Object.assign(user, body)
      const result = await user.save()
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'User does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function deleteOne({ params: { id } }, res, next) {
  try {
    const result = await User.findByIdAndDelete(id)
    if (result) {
      res.status(200).send(true)
    } else {
      res.status(404).send(false)
    }
  } catch (error) {
    next(error)
  }
}

async function productsByUser({ params: { id } }, res, next) {
  try {
    const user = await User.findById(id)
    if (user) {
      const products = await Product.find({ user: id })
      res.status(200).json(products)
    } else {
      res.status(404).json({ message: 'User does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function login({ body: { email, password } }, res, next) {
  try {
    if (!(email && password)) {
      res.status(400).json({ message: "All input is required"});
    }

    const user = await User.findOne({ email: email });
    const match = await user.isValidPassword(password)

    if (user && match) {
      // Create token
      const data = user.toObject()
      delete data.password
      const token = jwt.sign(data, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: '15m'
      })

      res.status(200).json({ data, token });
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAll,
  getOne,
  signin,
  edit,
  deleteOne,
  productsByUser,
  login
}
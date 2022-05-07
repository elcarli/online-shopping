const { Product, User } = require("../db");

async function getAll(req, res, next) {
  try {
    const result = await Product.find()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getOne({ params: { id } }, res, next) {
  try {
    const result = await Product.findById(id).populate('user', '-password')
    if (result) {
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'Product does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function create({ body: { name, description, price, stock, userId } }, res, next) {
  try {
    const user = await User.findById(userId)
    if (user) {
      const newProduct = {
        name, description, price, stock, user: user.id
      }
      const result = await Product.create(newProduct)
      res.status(201).json(result)
    } else {
      res.status(404).json({ message: 'User does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function edit({ params: { id }, body }, res, next) {
  try {
    const product = await Product.findById(id)
    if (product) {
      Object.assign(product, body)
      const result = await product.save()
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'Product does not exist' })
    }
    
  } catch (error) {
    next(error)
  }
}

async function deleteOne({ params: { id } }, res, next) {
  try {
    const result = await Product.findByIdAndDelete(id)
    if (result) {
      res.status(200).send(true)
    } else {
      res.status(404).send(false)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  edit,
  deleteOne
}
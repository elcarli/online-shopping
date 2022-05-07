const { Order, User } = require("../db");

async function getAll(req, res, next) {
  try {
    const result = await Order.find()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getOne({ params: { id } }, res, next) {
  try {
    const result = await Order.findById(id).populate('user', '-password')
    if (result) {
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'Order does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function create({ body: { details, userId } }, res, next) {
  try {
    const user = await User.findById(userId)
    if (user) {
      const newOrder = {
        details, user: user.id
      }
      const result = await Order.create(newOrder)
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
    const order = await Order.findById(id)
    if (order) {
      Object.assign(order, body)
      const result = await order.save()
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'Order does not exist' })
    }
    
  } catch (error) {
    next(error)
  }
}

async function deleteOne({ params: { id } }, res, next) {
  try {
    const result = await Order.findByIdAndDelete(id)
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
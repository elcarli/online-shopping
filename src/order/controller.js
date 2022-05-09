const { Order, User, Product } = require("../db");
require('dotenv').config();
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
      let total = 0
      const detailsCalculated = []

      for (let detail of details) {
        detail = await detailForProductQuantity(detail.product, detail.quantity)
        total += detail.subtotal
        detailsCalculated.push(detail)
      }
      const newOrder = {
        details: detailsCalculated, user: user.id, total
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

async function detailForProductQuantity(productId, quantity) {
  try {
    const product = await Product.findById(productId)

    if (product.stock < quantity) {
      console.log("ERROR STOCK")
      throw `Only can sell ${product.stock} of ${product.name}`
    }

    // UPDATE Product STOCK
    product.stock = product.stock - quantity
    await product.save()

    const newDetail = {
      product: productId,
      productName: product.name,
      quantity,
      priceOnDate: product.price,
      subtotal: quantity * product.price
    }

    return newDetail
  }
  catch (error) {
    throw error
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

const getOrderAmount = async (orderId) => {
  const order = await Order.findById(orderId)

  return order.total;
};

async function createPaymentIntent(req, res, next) {
  const { orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: await getOrderAmount(orderId),
    currency: "usd",  // DOES NOT ACCEPT "cop"
    automatic_payment_methods: {
      enabled: true,
    },
  });

  await Order.findByIdAndUpdate(orderId, { paymentReference: paymentIntent.id })

  res.send({
    clientSecret: paymentIntent.client_secret,
  });

}

function renderPayOrder(req, res, next) {
  res.render('index', { ORDER_ID: req.params.orderId })
}

module.exports = {
  getAll,
  getOne,
  create,
  edit,
  deleteOne,
  createPaymentIntent,
  renderPayOrder
}
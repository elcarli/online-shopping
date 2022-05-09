var express = require('express');
const checkObjectId = require('../helpers/checkObjectId');
var router = express.Router();

const { create, deleteOne, edit, getAll, getOne, createPaymentIntent } = require('./controller');

router.get('/',  getAll);
router.get('/:id', checkObjectId, getOne);
router.post('/', create);
router.put('/:id', checkObjectId, edit);
router.delete('/:id', checkObjectId, deleteOne)
router.post('/create-payment-intent', createPaymentIntent) 

module.exports = router;
var express = require('express');
const checkObjectId = require('../helpers/checkObjectId');
const isAuth = require('../helpers/isAuth');
var router = express.Router();

const { deleteOne, edit, getAll, getOne, productsByUser } = require('./controller');

router.get('/', getAll);

router.get('/:id',
  checkObjectId,
  isAuth,
  getOne);

router.put('/:id',
  checkObjectId,
  isAuth,
  edit);

router.delete('/:id',
  checkObjectId,
  isAuth,
  deleteOne)

router.get('/:id/products',
  checkObjectId,
  productsByUser);

module.exports = router;
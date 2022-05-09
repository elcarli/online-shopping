var express = require('express');
var router = express.Router();

const { signin, login, renderPayOrder } = require('../user/controller');

router.get('/:orderId', renderPayOrder);
router.post('/', signin);
router.post('/login', login);

module.exports = router;
const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewere/check-auth');

//import controller
const OrdersController = require('../controller/orders-controller'); 

//handle incoming GET requests to /orders
router.get('/', checkAuth, OrdersController.order_get_all);

router.post('/', checkAuth, OrdersController.order_store_order);

router.get('/:orderId', checkAuth, OrdersController.order_get_order);

router.delete('/:orderId', checkAuth, OrdersController.order_delete_order);

module.exports = router;
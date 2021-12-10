const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewere/check-auth');

//import controller
const CategoryController = require('../controller/category-controller');

//handle incoming GET requests to /category
//router.get('/', checkAuth, CategoryController.get_all);
router.get('/', CategoryController.get_all);

router.get('/:categoryId', checkAuth, CategoryController.show);

router.post('/', checkAuth, CategoryController.store);

router.patch('/:categoryId', checkAuth, CategoryController.update);

router.delete('/:categoryId', checkAuth, CategoryController.delete);

module.exports = router;
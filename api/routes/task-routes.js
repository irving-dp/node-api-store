const express = require('express');
const router = express.Router();

/** import controller */
const TaskController = require('../controller/task-controller');

/** handle incoming GET */
router.get('/', TaskController.get_all);
router.post('/', TaskController.store);
router.put('/:taskId', TaskController.update );
router.delete('/:taskId', TaskController.delete );
module.exports = router;
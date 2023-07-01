const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const checkAuth = require('../../middleware/auth');

router.get('/todos', checkAuth, todoController.getAll);
router.post('/todos', checkAuth, todoController.addTask);
router.put('/todos/:id', checkAuth, todoController.updateTask);
router.delete('/todos/:id', checkAuth, todoController.deleteTask);
router.put('/todos/:id/complete', checkAuth, todoController.completeTask);
router.get('/todos/search/:id', checkAuth, todoController.search);
router.post('/todos/:id/files', checkAuth, todoController.uploadFiles);
router.post('/todos/:id/labels', checkAuth, todoController.setLabels);
router.post('/todos/:id/priority', checkAuth, todoController.setPriority);
router.post('/todos/:id/due_date', checkAuth, todoController.setDueDate);

module.exports = router;
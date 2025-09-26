const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/todo.controller');

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/stats', ctrl.stats);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;

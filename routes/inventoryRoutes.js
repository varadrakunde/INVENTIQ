const express = require('express');
const router = express.Router();

const {
  createInventoryPart,
  getAllInventory,
  getInventoryById,
  updateInventoryPart,
  deleteInventoryPart,
} = require('../controllers/inventoryController');

router.get('/', getAllInventory);
router.get('/:id', getInventoryById);
router.post('/', createInventoryPart);
router.put('/:id', updateInventoryPart);
router.delete('/:id', deleteInventoryPart);

module.exports = router;

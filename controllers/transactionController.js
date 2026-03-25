const Transaction = require('../models/Transaction');
const Inventory = require('../models/Inventory');

const recordTransactionIn = async (req, res, next) => {
  try {
    const { productId, quantity, referenceDocument, remarks } = req.body;

    
    if (!productId || !quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'productId and quantity are required.',
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be at least 1.',
      });
    }

    const product = await Inventory.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found.',
      });
    }

    const transaction = await Transaction.create({
      productId,
      quantity,
      transactionType: 'IN',
      referenceDocument,
      remarks,
    });

    product.currentStock += quantity;
    await product.save();

    res.status(201).json({
      status: 'success',
      message: 'Stock updated successfully',
      transaction: {
        transactionType: transaction.transactionType,
        quantity: transaction.quantity,
        transactionDate: transaction.transactionDate,
      },
      updatedProduct: {
        partName: product.partName,
        newStockLevel: product.currentStock,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format.',
      });
    }
    next(error);
  }
};

const recordTransactionOut = async (req, res, next) => {
  try {
    const { productId, quantity, referenceDocument, remarks } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'productId and quantity are required.',
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be at least 1.',
      });
    }

    const product = await Inventory.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found.',
      });
    }

    if (product.currentStock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: `Insufficient stock. Available: ${product.currentStock}, Requested: ${quantity}`,
      });
    }

    const transaction = await Transaction.create({
      productId,
      quantity,
      transactionType: 'OUT',
      referenceDocument,
      remarks,
    });

    product.currentStock -= quantity;
    await product.save();

    res.status(201).json({
      status: 'success',
      message: 'Stock updated successfully',
      transaction: {
        transactionType: transaction.transactionType,
        quantity: transaction.quantity,
        transactionDate: transaction.transactionDate,
      },
      updatedProduct: {
        partName: product.partName,
        newStockLevel: product.currentStock,
      },
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format.',
      });
    }
    next(error);
  }
};

module.exports = {
  recordTransactionIn,
  recordTransactionOut,
};

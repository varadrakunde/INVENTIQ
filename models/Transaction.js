const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    transactionType: {
      type: String,
      enum: {
        values: ['IN', 'OUT'],
        message: 'Transaction type must be either IN or OUT',
      },
      required: [true, 'Transaction type is required'],
    },
    referenceDocument: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);

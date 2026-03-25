const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    partName: {
      type: String,
      required: [true, 'Part name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true,
      unique: true,
      uppercase: true,
    },
    vehicleType: {
      type: [String],
      enum: {
        values: ['2W', '3W', '4W', 'EV'],
        message: 'vehicleType must be one of: 2W, 3W, 4W, EV',
      },
      required: [true, 'At least one vehicleType is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    minStockLevel: {
      type: Number,
      default: 0,
      min: [0, 'minStockLevel cannot be negative'],
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
    },
    compatibleModels: {
      type: [String],
      default: [],
    },
    specifications: {
      emissionStandard: { type: String, trim: true },
      fuelType:         { type: String, trim: true },
      voltage:          { type: String, trim: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);

const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');

const createInventoryPart = async (req, res, next) => {
  try {
    const {
      partName,
      sku,
      vehicleType,
      price,
      minStockLevel,
      supplierId,
      compatibleModels,
      specifications,
    } = req.body;

    if (!partName || !sku || !price || !vehicleType || vehicleType.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'partName, sku, price, and vehicleType are required.',
      });
    }

    const existingSku = await Inventory.findOne({
      sku: sku.toUpperCase(),
    });

    if (existingSku) {
      return res.status(409).json({
        status: 'error',
        message: `A part with SKU "${sku.toUpperCase()}" already exists.`,
      });
    }

    if (supplierId) {
      const supplierExists = await Supplier.findById(supplierId);
      if (!supplierExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Supplier not found. Provide a valid supplierId.',
        });
      }
    }

    const part = await Inventory.create({
      partName,
      sku,
      vehicleType,
      price,
      minStockLevel,
      supplierId,
      compatibleModels,
      specifications,
    });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        _id:          part._id,
        partName:     part.partName,
        sku:          part.sku,
        currentStock: part.currentStock,
        price:        part.price,
        supplierId:   part.supplierId,
        createdAt:    part.createdAt,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

const getAllInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.find().populate('supplierId', 'companyName contactPerson phone');

    res.status(200).json({
      status: 'success',
      count: inventory.length,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

const getInventoryById = async (req, res, next) => {
  try {
    const part = await Inventory.findById(req.params.id).populate('supplierId', 'companyName contactPerson phone');

    if (!part) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: part,
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

const updateInventoryPart = async (req, res, next) => {
  try {
    const { partName, price, minStockLevel, supplierId, compatibleModels, specifications } = req.body;

    const part = await Inventory.findById(req.params.id);

    if (!part) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found.',
      });
    }

    if (supplierId) {
      const supplierExists = await Supplier.findById(supplierId);
      if (!supplierExists) {
        return res.status(404).json({
          status: 'error',
          message: 'Supplier not found.',
        });
      }
      part.supplierId = supplierId;
    }

    if (partName !== undefined) part.partName = partName;
    if (price !== undefined) part.price = price;
    if (minStockLevel !== undefined) part.minStockLevel = minStockLevel;
    if (compatibleModels !== undefined) part.compatibleModels = compatibleModels;
    if (specifications !== undefined) part.specifications = specifications;

    const updated = await part.save();

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID format.',
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        status: 'error',
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

const deleteInventoryPart = async (req, res, next) => {
  try {
    const part = await Inventory.findById(req.params.id);

    if (!part) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found.',
      });
    }

    await part.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully.',
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
  createInventoryPart,
  getAllInventory,
  getInventoryById,
  updateInventoryPart,
  deleteInventoryPart,
};

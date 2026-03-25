const Inventory = require('../models/Inventory');
const Supplier = require('../models/Supplier');

const getSummary = async (req, res, next) => {
  try {
    const totalDistinctParts = await Inventory.countDocuments();

    const inventory = await Inventory.find();
    const totalInventoryValueINR = inventory.reduce((sum, item) => {
      return sum + (item.price * item.currentStock);
    }, 0);

    const lowStockItems = await Inventory.find({
      $expr: { $lt: ['$currentStock', '$minStockLevel'] },
    });
    const lowStockItemCount = lowStockItems.length;

    res.status(200).json({
      status: 'success',
      data: {
        totalDistinctParts,
        totalInventoryValueINR,
        lowStockItemCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getLowStockItems = async (req, res, next) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ['$currentStock', '$minStockLevel'] },
    }).populate('supplierId', 'phone');

    const formattedItems = lowStockItems.map(item => ({
      productId: item._id,
      partName: item.partName,
      sku: item.sku,
      currentStock: item.currentStock,
      minStockLevel: item.minStockLevel,
      supplierPhone: item.supplierId?.phone || 'N/A',
    }));

    res.status(200).json({
      status: 'success',
      count: formattedItems.length,
      data: formattedItems,
    });
  } catch (error) {
    next(error);
  }
};

const getValuation = async (req, res, next) => {
  try {
    const inventory = await Inventory.find();

    const totalValueINR = inventory.reduce((sum, item) => {
      return sum + (item.price * item.currentStock);
    }, 0);

    const breakdownByVehicleType = {
      '2W': 0,
      '3W': 0,
      '4W': 0,
      'EV': 0,
    };

    inventory.forEach(item => {
      const itemValue = item.price * item.currentStock;
      item.vehicleType.forEach(type => {
        breakdownByVehicleType[type] += itemValue;
      });
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalValueINR,
        breakdownByVehicleType,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getLowStockItems,
  getValuation,
};

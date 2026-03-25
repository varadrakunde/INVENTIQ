const Supplier = require('../models/Supplier');

const createSupplier = async (req, res, next) => {
  try {
    const { companyName, phone, contactPerson, email, address } = req.body;

    if (!companyName || !phone || !contactPerson) {
      return res.status(400).json({
        status: 'error',
        message: 'companyName, phone, and contactPerson are required.',
      });
    }

    const existing = await Supplier.findOne({
      companyName: { $regex: new RegExp(`^${companyName}$`, 'i') },
    });

    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: `Supplier "${existing.companyName}" already exists.`,
      });
    }

    const supplier = await Supplier.create({
      companyName,
      phone,
      contactPerson,
      email,
      address,
    });

    res.status(201).json({
      status: 'success',
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().select(
      '_id companyName contactPerson phone'
    );

    res.status(200).json({
      status: 'success',
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        status: 'error',
        message: 'Supplier not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: supplier,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid supplier ID format.',
      });
    }
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { companyName, contactPerson, phone, email, address } = req.body;

    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        status: 'error',
        message: 'Supplier not found.',
      });
    }

    if (companyName !== undefined) {
      const duplicate = await Supplier.findOne({
        companyName: { $regex: new RegExp(`^${companyName}$`, 'i') },
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({
          status: 'error',
          message: `Supplier "${duplicate.companyName}" already exists.`,
        });
      }

      supplier.companyName = companyName;
    }
    if (contactPerson !== undefined) supplier.contactPerson = contactPerson;
    if (phone !== undefined) supplier.phone = phone;
    if (email !== undefined) supplier.email = email;
    if (address !== undefined) supplier.address = address;

    const updated = await supplier.save();

    res.status(200).json({
      status: 'success',
      data: updated,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid supplier ID format.',
      });
    }
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        status: 'error',
        message: 'Supplier not found.',
      });
    }

    await supplier.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Supplier deleted successfully.',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid supplier ID format.',
      });
    }
    next(error);
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};

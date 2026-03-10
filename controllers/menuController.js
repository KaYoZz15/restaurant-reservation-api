const menuModel = require('../models/menuModel');

async function getMenu(req, res) {
  try {
    const menuItems = await menuModel.getAllMenuItems();

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = {
  getMenu
};
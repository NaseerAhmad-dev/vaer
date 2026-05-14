const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const Order   = require('../models/Order');
const Product = require('../models/Product');
const User    = require('../models/User');

// GET /api/admin/analytics
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const [revenueAgg, totalOrders, totalProducts, totalCustomers] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [revenueByDay, ordersByStatus, topProducts] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%m/%d', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: '$_id', revenue: 1, orders: 1 } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: '$count' } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        {
          $group: {
            _id:       '$items.product',
            name:      { $first: '$items.name' },
            totalSold: { $sum: '$items.qty' },
            revenue:   { $sum: { $multiply: ['$items.price', '$items.qty'] } },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $project: { name: 1, totalSold: 1, revenue: 1 } },
      ]),
    ]);

    res.json({
      overview: {
        totalRevenue:   revenueAgg[0]?.total || 0,
        totalOrders,
        totalProducts,
        totalCustomers,
      },
      revenueByDay,
      ordersByStatus,
      topProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

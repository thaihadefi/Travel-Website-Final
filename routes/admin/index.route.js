const router = require("express").Router();
const accountRoutes = require("./account.route");
const dashboardRoutes = require("./dashboard.route");
const categoryRoutes = require("./category.route");
const tourRoutes = require("./tour.route");
const orderRoutes = require("./order.route");
const contactRoutes = require("./contact.route");
const messageRoutes = require("./message.route");
const settingRoutes = require("./setting.route");
const profileRoutes = require("./profile.route");
const uploadRoutes = require("./upload.route");
const userRoutes = require("./user.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");
const settingMiddleware = require("../../middlewares/admin/setting.middleware");

router.get('/', authMiddleware.verifyToken, (req, res) => {
  res.redirect(`/${pathAdmin}/dashboard`);
})

router.use('/account', settingMiddleware.websiteInfo, accountRoutes)
router.use('/dashboard', authMiddleware.verifyToken, settingMiddleware.websiteInfo, dashboardRoutes)
router.use('/category', authMiddleware.verifyToken, settingMiddleware.websiteInfo, categoryRoutes)
router.use('/tour', authMiddleware.verifyToken, settingMiddleware.websiteInfo, tourRoutes)
router.use('/order', authMiddleware.verifyToken, settingMiddleware.websiteInfo, orderRoutes)
router.use('/contact', authMiddleware.verifyToken, settingMiddleware.websiteInfo, contactRoutes)
router.use('/message', authMiddleware.verifyToken, settingMiddleware.websiteInfo, messageRoutes)
router.use('/user', authMiddleware.verifyToken, settingMiddleware.websiteInfo, userRoutes)
router.use('/setting', authMiddleware.verifyToken, settingMiddleware.websiteInfo, settingRoutes)
router.use('/profile', authMiddleware.verifyToken, settingMiddleware.websiteInfo, profileRoutes)
router.use('/upload', authMiddleware.verifyToken, settingMiddleware.websiteInfo, uploadRoutes)

router.use(authMiddleware.verifyToken, (req, res) => {
  res.render("admin/pages/error-404", {
    pageTitle: "404 Not Found"
  });
})

module.exports = router;
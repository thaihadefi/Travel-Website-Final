const router = require("express").Router();
const orderController = require("../../controllers/client/order.controller");
const orderValidate = require("../../validates/client/order.validate");

router.get('/track', orderController.track)

router.post('/track', orderValidate.trackPost, orderController.trackPost)

router.post('/create', orderValidate.createPost, orderController.createPost)

router.get('/success', orderController.success)

router.get('/payment-zalopay', orderController.paymentZaloPay)

router.post('/payment-zalopay-result', orderController.paymentZaloPayResultPost)

router.get('/payment-vnpay', orderController.paymentVNPay)

router.get('/payment-vnpay-result', orderController.paymentVNPayResult)

module.exports = router;
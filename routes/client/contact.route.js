const router = require("express").Router();
const contactController = require("../../controllers/client/contact.controller");
const contactValidate = require("../../validates/client/contact.validate");

router.get('/', contactController.index)
router.post('/send-message', contactValidate.sendMessage, contactController.sendMessagePost)
router.post('/create', contactController.createPost)

module.exports = router;
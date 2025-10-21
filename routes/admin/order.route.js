const router = require("express").Router();
const orderController = require("../../controllers/admin/order.controller");
const orderValidate = require("../../validates/admin/order.validate");

router.get('/list', orderController.list)

router.get('/edit/:id', orderController.edit)

router.patch('/edit/:id', orderValidate.editPatch, orderController.editPatch)

router.patch('/change-multi', orderController.changeMultiPatch)

router.patch('/delete/:id', orderController.deletePatch)

router.get('/trash', orderController.trash)

router.patch('/undo/:id', orderController.undoPatch)

router.delete('/destroy/:id', orderController.destroyDelete)

module.exports = router;
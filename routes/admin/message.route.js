const router = require("express").Router();
const messageController = require("../../controllers/admin/message.controller");

router.get('/list', messageController.list)
router.patch('/change-multi', messageController.changeMultiPatch)
router.patch('/delete/:id', messageController.deletePatch)
router.get('/trash', messageController.trash)
router.patch('/undo/:id', messageController.undoPatch)
router.delete('/destroy/:id', messageController.destroyDelete)

module.exports = router;

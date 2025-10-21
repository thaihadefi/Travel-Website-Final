const router = require("express").Router();
const settingController = require("../../controllers/admin/setting.controller");
const settingValidate = require("../../validates/admin/setting.validate");
const multer  = require('multer');
const cloudinaryHelper = require("../../helpers/cloudinary.helper");
const upload = multer({ storage: cloudinaryHelper.storage });

router.get('/list', settingController.list)

router.get('/website-info', settingController.websiteInfo)

router.patch(
  '/website-info', 
  upload.fields([
    { name: 'logo', maxCount: 1 }, 
    { name: 'favicon', maxCount: 1 },
    { name: 'backgroundSection1', maxCount: 1 },
    { name: 'bannersSection3', maxCount: 10 },
    { name: 'bannerSection5', maxCount: 1 },
    { name: 'bannerSection7', maxCount: 1 }
  ]),
  settingValidate.websiteInfoPatch,
  settingController.websiteInfoPatch
)

router.get('/account-admin/list', settingController.accountAdminList)

router.get('/account-admin/create', settingController.accountAdminCreate)

router.post(
  '/account-admin/create', 
  upload.single('avatar'),
  settingValidate.accountAdminCreatePost,
  settingController.accountAdminCreatePost
)

router.get('/account-admin/edit/:id', settingController.accountAdminEdit)

router.patch(
  '/account-admin/edit/:id', 
  upload.single('avatar'),
  settingValidate.accountAdminEditPatch,
  settingController.accountAdminEditPatch
)

router.get('/role/list', settingController.roleList)

router.get('/role/create', settingController.roleCreate)

router.post('/role/create', settingValidate.roleCreatePost, settingController.roleCreatePost)

router.get('/role/edit/:id', settingController.roleEdit)

router.patch('/role/edit/:id', settingValidate.roleEditPatch, settingController.roleEditPatch)

router.patch('/account-admin/change-multi', settingController.accountAdminChangeMultiPatch)

router.patch('/account-admin/delete/:id', settingController.accountAdminDeletePatch)

router.get('/account-admin/trash', settingController.accountAdminTrash)

router.patch('/account-admin/undo/:id', settingController.accountAdminUndoPatch)

router.delete('/account-admin/destroy/:id', settingController.accountAdminDestroyDelete)

router.patch('/role/change-multi', settingController.roleChangeMultiPatch)

router.patch('/role/delete/:id', settingController.roleDeletePatch)

router.get('/role/trash', settingController.roleTrash)

router.patch('/role/undo/:id', settingController.roleUndoPatch)

router.delete('/role/destroy/:id', settingController.roleDestroyDelete)

module.exports = router;
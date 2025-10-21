const router = require("express").Router();
const searchController = require("../../controllers/client/search.controller");
const searchValidate = require("../../validates/client/search.validate");

router.get('/', searchValidate.searchGet, searchController.list)

module.exports = router;
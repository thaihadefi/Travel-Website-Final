const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const moment = require("moment");
const Tour = require("../../models/tour.model");
const { paginationLimit } = require("../../config/variable.config");

module.exports.list = async (req, res) => {
  const slug = req.params.slug;

  // Category detail
  const categoryDetail = await Category
    .findOne({
      slug: slug,
      deleted: false,
      status: "active"
    })

  if(!categoryDetail) {
    res.redirect("/");
    return;
  }
  // End Category detail

  // Breadcrumb
  const breadcrumb = [];

  if(categoryDetail.parent) {
    const categoryParentList = await categoryHelper.getCategoryParent(categoryDetail.parent);
    for (const item of categoryParentList) {
      breadcrumb.push(item);
    }
  }

  breadcrumb.push({
    id: categoryDetail.id,
    name: categoryDetail.name,
    avatar: categoryDetail.avatar,
    slug: categoryDetail.slug,
  });
  // End Breadcrumb

  // Pagination
  const limitItems = paginationLimit.limitItemsClient;
  let page = 1;
  if(req.query.page && parseInt(req.query.page) > 0) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  // End Pagination

  // Tour list
  const categoryId = categoryDetail.id;
  const categoryChild = await categoryHelper.getCategoryChild(categoryId);
  const categoryChildId = categoryChild.map(item => item.id);

  const find = {
    category: {
      $in: [
        categoryId,
        ...categoryChildId
      ]
    },
    deleted: false,
    status: "active"
  };

  const totalRecord = await Tour.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);

  const tourList = await Tour
    .find(find)
    .sort({
      position: "desc"
    })
    .limit(limitItems)
    .skip(skip);

  for (const item of tourList) {
    item.discount = Math.floor(((item.priceAdult - item.priceNewAdult) / item.priceAdult) * 100);

    if(item.departureDate) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    }
  }

  const pagination = {
    skip: skip,
    currentPage: page,
    totalPage: totalPage,
    totalRecord: totalRecord,
    currentCount: tourList.length
  };
  // End Tour list

  res.render("client/pages/tour-list", {
    pageTitle: "Tour list",
    categoryDetail: categoryDetail,
    breadcrumb: breadcrumb,
    tourList: tourList,
    pagination: pagination
  });
}
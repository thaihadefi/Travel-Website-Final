const Tour = require("../../models/tour.model");
const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const moment = require("moment");
const slugify = require('slugify');
const { paginationLimit } = require("../../config/variable.config");

module.exports.list = async (req, res) => {
  try {
    const find = {
      deleted: false,
      status: "active"
    };

    // Search by tour name/keyword
    if(req.query.locationTo) {
      const keyword = slugify(req.query.locationTo, { lower: true, strict: true });
      const keywordRegex = new RegExp(keyword, "i");
      find.slug = keywordRegex;
    }
    // End Search by tour name/keyword

    // Departure from
    if(req.query.locationFrom) {
      find.locations = req.query.locationFrom;
    }
    // End Departure from

    // Departure date
    if(req.query.departureDate) {
      find.departureDate = new Date(req.query.departureDate);
    }
    // End Departure date

    // Number of passengers
    // Adult
    if(req.query.stockAdult) {
      find.stockAdult = {
        $gte: parseInt(req.query.stockAdult)
      };
    }

    // Children
    if(req.query.stockChildren) {
      find.stockChildren = {
        $gte: parseInt(req.query.stockChildren)
      };
    }

    // Babies
    if(req.query.stockBaby) {
      find.stockBaby = {
        $gte: parseInt(req.query.stockBaby)
      };
    }
    // End number of passengers

    // Price range
    if(req.query.price) {
      const [priceMin, priceMax] = req.query.price.split("-").map(item => parseInt(item));
      find.priceNewAdult = {
        $gte: priceMin,
        $lte: priceMax
      };
    }
    // End price range

    // Pagination
    const limitItems = paginationLimit.limitItemsClient;
    let page = 1;
    if(req.query.page && parseInt(req.query.page) > 0) {
      page = parseInt(req.query.page);
    }
    const skip = (page - 1) * limitItems;
    // End Pagination

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

    // Breadcrumb
    const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});
    const breadcrumb = [
      {
        name: "Search Results",
        slug: "/search",
        avatar: settingWebsiteInfo.logo
      }
    ];
    // End Breadcrumb

    res.render("client/pages/search", {
      pageTitle: "Search results",
      tourList: tourList,
      pagination: pagination,
      breadcrumb: breadcrumb
    });
  } catch (error) {
    res.redirect("/");
  }
}
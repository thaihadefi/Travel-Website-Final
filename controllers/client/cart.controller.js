const Tour = require("../../models/tour.model");
const City = require("../../models/city.model");
const moment = require("moment");

module.exports.cart = async (req, res) => {
  res.render("client/pages/cart", {
    pageTitle: "Cart"
  });
}

module.exports.detailPost = async (req, res) => {
  try {
    console.log("Received cart data:", req.body);
    console.log("Type of cart:", typeof req.body);
    console.log("Is array:", Array.isArray(req.body));
    
    const cart = req.body;
    const cartDetail = [];

    // Check if cart is valid
    if (!cart || !Array.isArray(cart)) {
      console.log("Cart is not an array or is null/undefined");
      res.json({
        code: "success",
        message: "Cart is empty!",
        cart: []
      })
      return;
    }

    for (const item of cart) {
      const tourInfo = await Tour
        .findOne({
          _id: item.tourId,
          status: "active",
          deleted: false
        })
      if(tourInfo) {
        let cityInfo = null;
        if (item.locationFrom) {
          cityInfo = await City.findOne({
            _id: item.locationFrom
          });
        }

        const itemDetail = {
          ...item,
          avatar: tourInfo.avatar,
          name: tourInfo.name,
          slug: tourInfo.slug,
          departureDate: moment(tourInfo.departureDate).format("DD/MM/YYYY"),
          cityName: cityInfo ? cityInfo.name : "Not specified",
          priceNewAdult: tourInfo.priceNewAdult,
          priceNewChildren: tourInfo.priceNewChildren,
          priceNewBaby: tourInfo.priceNewBaby,
          stockAdult: tourInfo.stockAdult,
          stockChildren: tourInfo.stockChildren,
          stockBaby: tourInfo.stockBaby,
        };
        cartDetail.push(itemDetail);
      }
    }

    res.json({
      code: "success",
      message: "Success!",
      cart: cartDetail
    })
  } catch (error) {
    console.error("Error in cart detailPost:", error);
    console.error("Error stack:", error.stack);
    res.json({
      code: "error",
      message: "Invalid data: " + error.message
    })
  }
}
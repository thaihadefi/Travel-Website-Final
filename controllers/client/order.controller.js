const { generateRandomNumber } = require("../../helpers/generate.helper");
const Order = require("../../models/order.model");
const Tour = require("../../models/tour.model");
const City = require("../../models/city.model");
const { paymentMethodList, paymentStatusList, statusList } = require("../../config/variable.config");
const moment = require("moment");
const axios = require('axios').default;
const CryptoJS = require('crypto-js');

module.exports.track = async (req, res) => {
  res.render("client/pages/order-track", {
    pageTitle: "Track Order"
  });
}

module.exports.trackPost = async (req, res) => {
  try {
    const { orderCode, phone } = req.body;
    
    if(!orderCode || !phone) {
      res.json({
        code: "error",
        message: "Please enter order code and phone number!"
      })
      return;
    }

    let orderDetail = await Order.findOne({
      code: orderCode,
      phone: phone,
      deleted: false
    })

    if(!orderDetail) {
      res.json({
        code: "error",
        message: "Order not found!"
      })
      return;
    }

    // Convert to plain object
    orderDetail = orderDetail.toObject();

    orderDetail.paymentMethodName = paymentMethodList.find(item => item.value == orderDetail.paymentMethod).label;
    orderDetail.paymentStatusName = paymentStatusList.find(item => item.value == orderDetail.paymentStatus).label;
    orderDetail.statusName = statusList.find(item => item.value == orderDetail.status).label;
    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");

    for (const item of orderDetail.items) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      const city = await City.findOne({
        _id: item.locationFrom
      })
      if(city) {
        item.cityName = city.name;
      }
    }

    res.json({
      code: "success",
      orderDetail: orderDetail
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.createPost = async (req, res) => {
  try {
    // Code
    req.body.code = "OD" + generateRandomNumber(10);

    // Estimated
    req.body.subTotal = 0;

    // Tour list
    for (const item of req.body.items) {
      const tourInfo = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active"
      })
      if(tourInfo) {
        // Estimated
        req.body.subTotal += (item.quantityAdult * tourInfo.priceNewAdult + item.quantityChildren * tourInfo.priceNewChildren + item.quantityBaby * tourInfo.priceNewBaby);

        // Add price
        item.priceNewAdult = tourInfo.priceNewAdult;
        item.priceNewChildren = tourInfo.priceNewChildren;
        item.priceNewBaby = tourInfo.priceNewBaby;

        // Departure date, avatar, name, slug
        item.departureDate = tourInfo.departureDate;
        item.avatar = tourInfo.avatar;
        item.name = tourInfo.name;
        item.slug = tourInfo.slug;

        // Update remaining stock of tour
        await Tour.updateOne({
          _id: item.tourId,
          deleted: false,
          status: "active"
        }, {
          stockAdult: tourInfo.stockAdult - item.quantityAdult,
          stockChildren: tourInfo.stockChildren - item.quantityChildren,
          stockBaby: tourInfo.stockBaby - item.quantityBaby,
        })
      }
    }

    // Discount
    req.body.discount = 0;

    // Total
    req.body.total = req.body.subTotal - req.body.discount;

    // Payment status
    req.body.paymentStatus = "unpaid";

    // Order status
    req.body.status = "initial";

    const newRecord = new Order(req.body);
    await newRecord.save();

    res.json({
      code: "success",
      message: "Success!",
      orderCode: req.body.code,
      phone: req.body.phone,
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Invalid data!"
    })
  }
}

module.exports.success = async (req, res) => {
  try {
    const { orderCode, phone } = req.query;
    
    if(!orderCode && !phone) {
      res.redirect("/");
      return;
    }

    const orderDetail = await Order.findOne({
      code: orderCode,
      phone: phone,
      deleted: false
    })

    if(!orderDetail) {
      res.redirect("/");
      return;
    }

    orderDetail.paymentMethodName = paymentMethodList.find(item => item.value == orderDetail.paymentMethod).label;
    orderDetail.paymentStatusName = paymentStatusList.find(item => item.value == orderDetail.paymentStatus).label;
    orderDetail.statusName = statusList.find(item => item.value == orderDetail.status).label;

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");

    for (const item of orderDetail.items) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      const city = await City.findOne({
        _id: item.locationFrom
      })
      item.cityName = city.name;
    }

    res.render("client/pages/order-success", {
      pageTitle: "Order Success",
      orderDetail: orderDetail
    });
  } catch (error) {
    res.redirect("/");
  }
}

module.exports.paymentZaloPay = async (req, res) => {
  try {
    const { orderCode, phone } = req.query;
    
    if(!orderCode && !phone) {
      res.redirect("/");
      return;
    }

    const orderDetail = await Order.findOne({
      code: orderCode,
      phone: phone,
      deleted: false
    })

    if(!orderDetail) {
      res.redirect("/");
      return;
    }

    // APP INFO
    const config = {
      app_id: process.env.ZALOPAY_APPID,
      key1: process.env.ZALOPAY_KEY1,
      key2: process.env.ZALOPAY_KEY2,
      endpoint: `${process.env.ZALOPAY_DOMAIN}/v2/create`
    };

    const embed_data = {
      redirecturl: `${process.env.WEBSITE_DOMAIN}/order/success?orderCode=${orderCode}&phone=${phone}`
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: `${orderCode}-${phone}`,
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: orderDetail.total,
      description: `Order ${orderCode}`,
      bank_code: "",
      callback_url: `${process.env.WEBSITE_DOMAIN}/order/payment-zalopay-result`
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    axios.post(config.endpoint, null, { params: order })
      .then(response => {
        if(response.data.return_code == 1) {
          res.redirect(response.data.order_url);
        } else {
          res.redirect("/");
        }
      })
      .catch(err => console.log(err));
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

module.exports.paymentZaloPayResultPost = async (req, res) => {
  const config = {
    key2: process.env.ZALOPAY_KEY2
  };
  
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // Check valid callback (from ZaloPay server)
    if (reqMac !== mac) {
      // Invalid callback
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // Payment successful
      // merchant updates order status to paid
      let dataJson = JSON.parse(dataStr, config.key2);

      // Update order status to paid
      const [orderCode, phone] = dataJson.app_user.split("-");
      await Order.updateOne({
        code: orderCode,
        phone: phone
      }, {
        paymentStatus: "paid"
      })

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server will callback (up to 3 times)
    result.return_message = ex.message;
  }

  // Notify result to ZaloPay server
  res.json(result);
}

module.exports.paymentVNPay = async (req, res) => {
  try {
    const { orderCode, phone } = req.query;
    
    if(!orderCode && !phone) {
      res.redirect("/");
      return;
    }

    const orderDetail = await Order.findOne({
      code: orderCode,
      phone: phone,
      deleted: false
    })

    if(!orderDetail) {
      res.redirect("/");
      return;
    }

    let date = new Date();
    let createDate = moment(date).utcOffset(7).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    
    let tmnCode = process.env.VNPAY_TMNCODE;
    let secretKey = process.env.VNPAY_SECRET;
    let vnpUrl = process.env.VNPAY_URL;
    let returnUrl = `${process.env.WEBSITE_DOMAIN}/order/payment-vnpay-result`;
    let orderId = `${orderCode}-${phone}-${Date.now()}`;
    let amount = orderDetail.total;
    let bankCode = "";
    
    let locale = "vn";
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.redirect(vnpUrl);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

module.exports.paymentVNPayResult = async (req, res) => {
  try {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let secretKey = process.env.VNPAY_SECRET;

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        // Check if data in db is valid and notify result
        const [orderCode, phone] = vnp_Params["vnp_TxnRef"].split("-");
        await Order.updateOne({
          code: orderCode,
          phone: phone
        }, {
          paymentStatus: "paid"
        })
        res.redirect(`${process.env.WEBSITE_DOMAIN}/order/success?orderCode=${orderCode}&phone=${phone}`);
    } else{
        res.render('success', {code: '97'})
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

function sortObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError('Input must be a plain object');
  }

  let sorted = {};
  let str = [];
  let key;

  // Iterate through the object's properties
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }

  // Sort keys
  str.sort();

  // Create new object with sorted keys
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }

  return sorted;
}
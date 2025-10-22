const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    websiteName: String,
    phone: String,
    email: String,
    address: String,
    logo: String,
    favicon: String,
    categoryIdSection4: String,
    categoryIdSection6: String,
    backgroundSection1: String,
    bannersSection3: [String],
    bannerSection5: String,
    bannerSection7: String,
    workingHours: String,
  }
);

const SettingWebsiteInfo = mongoose.model('SettingWebsiteInfo', schema, "setting-website-info");

module.exports = SettingWebsiteInfo;
const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const { swiperConfig } = require("../../config/variable.config");

module.exports.websiteInfo = async (req, res, next) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  res.locals.settingWebsiteInfo = settingWebsiteInfo;
  res.locals.swiperConfig = swiperConfig;
  req.settingWebsiteInfo = settingWebsiteInfo;

  next();
}
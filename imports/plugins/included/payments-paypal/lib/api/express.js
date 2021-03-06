/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Packages } from "/lib/collections";
import Reaction from "/lib/api";

function getSettings(settings, ref, valueName) {
  if (settings !== null) {
    return settings[valueName];
  } else if (ref !== null) {
    return ref[valueName];
  }
  return {};
}

// using global instance of Reaction
// Paypal is a shared client/server stub
// to provide normalized PayPal tooling

export const Express = {
  expressCheckoutAccountOptions: function () {
    const prefix = Reaction.getShopPrefix();
    const shopId = Reaction.getShopId();
    const settings = Packages.findOne({
      name: "reaction-paypal",
      shopId: shopId,
      enabled: true
    }).settings;
    let mode;

    if ((settings !== null ? settings.express_mode : void 0) === true) {
      mode = "production";
    } else {
      mode = "sandbox";
    }
    const ref = Meteor.settings.paypal;

    const options = {
      enabled: settings !== null ? settings.express.enabled : void 0,
      mode: mode,
      username: getSettings(settings, ref, "username"),
      password: getSettings(settings, ref, "password"),
      signature: getSettings(settings, ref, "signature"),
      merchantId: getSettings(settings, ref, "merchantId"),
      return_url: Meteor.absoluteUrl(`${prefix}/paypal/done`),
      cancel_url: Meteor.absoluteUrl(`${prefix}/paypal/cancel`)
    };
    if (options.mode === "sandbox") {
      options.url = "https://api-3t.sandbox.paypal.com/nvp";
    } else {
      options.url = "https://api-3t.paypal.com/nvp";
    }
    return options;
  },
  config: function (options) {
    this.accountOptions = options;
  }
};

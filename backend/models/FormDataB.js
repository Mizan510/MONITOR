const mongoose = require("mongoose");

const FormDataBSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // Forecast Section
  salesForecast: { type: Number, required: true },
  strategicRxForecast: { type: Number },
  focusRxForecast: { type: Number },
  newProductRxForecast: { type: Number },
  opdRxForecast: { type: Number },
  gpRxForecast: { type: Number },
  dischargeRxForecast: { type: Number },

  // Rx Section
  totalStrategicRx: { type: Number },
  totalFocusRx: { type: Number },
  totalNewProductRx: { type: Number },
  otherProductsRxSBUB: { type: Number },
  totalRxs: { type: Number },
  opdRx: { type: Number },
  dischargeRx: { type: Number },
  gpRx: { type: Number },

  // Order Section
  SBUBOrderRouteName: { type: String },
  noOfPartySBUBOrderRoute: { type: Number },
  noOfCollectedOrderSBUB: { type: Number },
  noOfNotGivingOrderParty: { type: Number },
  causeOfNotGivingOrder: { type: String },
  marketTotalOrder: { type: Number },

  nexumMUPSOrder: { type: Number },
  secloOrder: { type: Number },
  newProductOrder: { type: Number },

  // Survey Section
  rxSendInDIDS: { type: Number },
  writtenRxInSurveyPad: { type: Number },
  indoorSurvey: { type: String },
});

module.exports = mongoose.model("FormDataB", FormDataBSchema);

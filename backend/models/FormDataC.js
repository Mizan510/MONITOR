const mongoose = require("mongoose");

const FormDataCSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // Forecast Section
  salesForecast: { type: Number, required: true },
  colboralDxRxForecast: { type: Number },
  neuroBRxForecast: { type: Number },
  zimaxRxForecast: { type: Number },
  urologicalRxForecast: { type: Number },
  hormoneRxForecast: { type: Number },
  torax10RxForecast: { type: Number },
  opdRxForecast: { type: Number },
  gpRxForecast: { type: Number },
  dischargeRxForecast: { type: Number },

  // Rx Section
  colboralDxRx: { type: Number },
  neuroBRx: { type: Number },
  zimaxRx: { type: Number },
  urologicalRx: { type: Number },
  hormonalRx: { type: Number },
  aceBrand: { type: Number },
  totalStrategicRx: { type: Number },
  otherProductsRxSBUC: { type: Number },
  totalRxs: { type: Number },
  opdRx: { type: Number },
  dischargeRx: { type: Number },
  gpRx: { type: Number },

  // Order Section
  sbuCOrderRouteName: { type: String },
  noOfPartySBUCOrderRoute: { type: Number },
  noOfCollectedOrderSBUC: { type: Number },
  noOfNotGivingOrderParty: { type: Number },
  causeOfNotGivingOrder: { type: String },
  marketTotalOrder: { type: Number },
  acetab250Order: { type: Number },
  acetab500Order: { type: Number },
  torax10TabOrder: { type: Number },
  amenavirOrder: { type: Number },
  aceDuoOrder: { type: Number },
  feozaOrder: { type: Number },

  // Survey Section
  rxSendInDIDS: { type: Number },
  writtenRxInSurveyPad: { type: Number },
  indoorSurvey: { type: String },
});

module.exports = mongoose.model("FormDataC", FormDataCSchema);

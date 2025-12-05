// SBU-C.jsx
import React from "react";

const SBUC = ({ FormDataC, handleChange, disabled }) => {
  const inputClasses =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500";

   // Helper functions to restrict input
  const allowOnlyNumbers = (e) => {
    if (!/^[0-9]+$/.test(e.data)) {
      e.preventDefault();
    }
  };

  const allowOnlyText = (e) => {
    if (/[0-9]/.test(e.data)) {
      e.preventDefault();
    }
  };
  
  const sections = [
    {
      title: "Forecast Section",
      subtitle: "(Send Today's Forecast)",
      colorClass: "border-blue-500 bg-blue-50",
      fields: [
        { name: "salesForecast", label: "Sales Forecast" },
        { name: "colboralDxRxForecast", label: "Colboral-D/DX Rx Forecast" },
        { name: "neuroBRxForecast", label: "Neuro B Rx Forecast" },
        { name: "zimaxRxForecast", label: "Zimax Rx Forecast" },
        { name: "urologicalRxForecast", label: "Urological Rx Forecast" },
        { name: "hormoneRxForecast", label: "Hormone Rx Forecast" },
        { name: "torax10RxForecast", label: "Torax 10 Rx Forecast" },
        { name: "opdRxForecast", label: "OPD Rx Forecast" },
        { name: "gpRxForecast", label: "GP Rx Forecast" },
        { name: "dischargeRxForecast", label: "Discharge Rx Forecast" },
      ],
    },
    {
      title: "Rx Section",
      subtitle: "(Send actual Rx of Yesterday)",
      colorClass: "border-green-500 bg-green-50",
      fields: [
        { name: "colboralDxRx", label: "Colboral-D/DX Rx" },
        { name: "neuroBRx", label: "Neuro B Rx" },
        { name: "zimaxRx", label: "Zimax Rx" },
        { name: "urologicalRx", label: "Urological Rx" },
        { name: "hormonalRx", label: "Hormonal Rx" },
        { name: "aceBrand", label: "ACE Brand" },
        { name: "totalStrategicRx", label: "Total Strategic Rx" },
        { name: "otherProductsRxSBUC", label: "Other Products Rx SBUC" },
        { name: "totalRxs", label: "Total Rxs" },
        { name: "opdRx", label: "OPD Rx" },
        { name: "dischargeRx", label: "Discharge Rx" },
        { name: "gpRx", label: "GP Rx" },
      ],
    },
    {
      title: "Order Section",
      subtitle: "(Send Collected Order Information)",
      colorClass: "border-yellow-500 bg-yellow-50",
      fields: [
        { name: "sbuCOrderRouteName", label: "SBU C Order Route Name", type: "text" },
        { name: "noOfPartySBUCOrderRoute", label: "No Of Party SBU C Order Route" },
        { name: "noOfCollectedOrderSBUC", label: "No Of Collected Order SBU C" },
        { name: "noOfNotGivingOrderParty", label: "No Of Not Giving Order Party" },
        { name: "causeOfNotGivingOrder", label: "Cause Of Not Giving Order", type: "text" },
        { name: "marketTotalOrder", label: "Market Total Order" },
        { name: "acetab250Order", label: "Acetab 250 Order" },
        { name: "acetab500Order", label: "Acetab 500 Order" },
        { name: "torax10TabOrder", label: "Torax 10 Tab Order" },
        { name: "amenavirOrder", label: "Amenavir Order" },
        { name: "aceDuoOrder", label: "AceDuo Order" },
        { name: "feozaOrder", label: "Feoza Order" },
      ],
    },
    {
      title: "Survey Section",
      subtitle: "(Send your Survey Status)",
      colorClass: "border-purple-500 bg-purple-50",
      fields: [
        { name: "rxSendInDIDS", label: "Rx Send In DIDS" },
        { name: "writtenRxInSurveyPad", label: "Written Rx In Survey Pad" },
        { name: "indoorSurvey", label: "Indoor Survey", type: "text" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title} className={`p-4 border-l-4 rounded ${section.colorClass}`}>
          <h2 className="text-lg font-bold">{section.title}</h2>
          <p className="text-base font-semibold text-red-600">{section.subtitle}</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <div key={field.name}>
                <label className="block mb-1 text-sm font-semibold">{field.label}:</label>
                <input
                  type={field.type || "number"}
                  name={field.name}
                  value={FormDataC[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.label}
                  className={inputClasses}
                  required
                  disabled={disabled}
                  onBeforeInput={field.type === "text" ? allowOnlyText : allowOnlyNumbers}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SBUC;

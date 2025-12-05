// SBUE.jsx
import React from "react";

const SBUE = ({ FormDataE, handleChange, disabled }) => {
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
        { name: "strategicRxForecast", label: "Strategic Rx Forecast" },
        { name: "focusRxForecast", label: "Focus Rx Forecast" },
        { name: "newProductRxForecast", label: "New Product Rx Forecast" },
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
        { name: "totalStrategicRx", label: "Total Strategic Rx" },
        { name: "totalFocusRx", label: "Total Focus Rx" },
        { name: "totalNewProductRx", label: "Total New Product Rx" },
        { name: "otherProductsRxSBUE", label: "Other Products Rx SBUE" },
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
        { name: "SBUEOrderRouteName", label: "SBU E Order Route Name", type: "text" },
        { name: "noOfPartySBUEOrderRoute", label: "No Of Party SBU E Order Route" },
        { name: "noOfCollectedOrderSBUE", label: "No Of Collected Order SBU E" },
        { name: "noOfNotGivingOrderParty", label: "No Of Not Giving Order Party" },
        { name: "causeOfNotGivingOrder", label: "Cause Of Not Giving Order", type: "text" },
        { name: "marketTotalOrder", label: "Market Total Order" },
        { name: "rosuvaOrder", label: "Rosuva Order" },
        { name: "camlosartOrder", label: "Camlosart Order" },
        { name: "newProductOrder", label: "New Product Order" },
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
                  value={FormDataE[field.name] || ""}
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

export default SBUE;

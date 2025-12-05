import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const UserReportA = ({ loggedInUser, allReports, usersUnderAdmin }) => {
  const [records, setRecords] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const pad = (n) => n.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const time = d.toLocaleTimeString("en-US", { hour12: true });
    return `${day}/${month}/${year}, ${time}`;
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStart(today);
    setEnd(today);
  }, []);

  const fetchRecords = () => {
    if (!start || !end) return alert("Select start and end dates");
    setLoading(true);

    const s = new Date(start); s.setHours(0, 0, 0, 0);
    const e = new Date(end); e.setHours(23, 59, 59, 999);

    const filtered = allReports.filter((r) => {
      const created = new Date(
        new Date(r.createdAt).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
      );

      if (created < s || created > e) return false;

      const reportUser = r.userName?.trim().toLowerCase();
      const selectedUserLower = loggedInUser?.trim().toLowerCase();

      if (loggedInUser) return reportUser === selectedUserLower;
      if (!usersUnderAdmin || !Array.isArray(usersUnderAdmin)) return true;

      const adminUserSet = new Set(
        usersUnderAdmin.map((u) => u.name?.trim().toLowerCase())
      );
      return adminUserSet.has(reportUser);
    });

    setRecords(filtered);
    setLoading(false);
  };

  const handleReset = () => {
    const today = new Date().toISOString().split("T")[0];
    setStart(today);
    setEnd(today);
    setRecords([]);
  };

  const headerMap = {
    salesForecast: "Sales Forecast",
    strategicRxForecast: "Strategic Rx Forecast",
    focusRxForecast: "Focus Rx Forecast",
    newProductRxForecast: "New Product Rx Forecast",
    opdRxForecast: "OPD Rx Forecast",
    gpRxForecast: "GP Rx Forecast",
    dischargeRxForecast: "Discharge Rx Forecast",
    totalStrategicRx: "Total Strategic Rx",
    totalFocusRx: "Total Focus Rx",
    totalNewProductRx: "Total New Product Rx",
    otherProductsRxSBUA: "Other Products Rx SBUA",
    totalRxs: "Total Rxs",
    opdRx: "OPD Rx",
    dischargeRx: "Discharge Rx",
    gpRx: "GP Rx",
    SBUAOrderRouteName: "SBU A Order Route Name",
    noOfPartySBUAOrderRoute: "No Of Party SBU A Order Route",
    noOfCollectedOrderSBUA: "No Of Collected Order SBU A",
    noOfNotGivingOrderParty: "No Of Not Giving Order Party",
    causeOfNotGivingOrder: "Cause Of Not Giving Order",
    marketTotalOrder: "Market Total Order",
    cef3DSOrder: "Cef-3/DS Order",
    cefotilOrder: "Cefotil Order",
    newProductOrder: "New Product Order",
    rxSendInDIDS: "Rx Send In DIDS",
    writtenRxInSurveyPad: "Written Rx In Survey Pad",
    indoorSurvey: "Indoor Survey",
  };

  const dynamicFields = records[0]
    ? Object.keys(records[0]).filter((k) => k !== "_id" && k !== "userId")
    : [];

  const numericFields = [];
  const totals = {};
  if (records.length > 0) {
    dynamicFields.forEach((f) => {
      if (records.every((r) => !isNaN(parseFloat(r[f])) && r[f] !== null)) {
        numericFields.push(f);
      }
    });
    numericFields.forEach((f) => {
      totals[f] = records.reduce((sum, r) => sum + parseFloat(r[f] || 0), 0);
    });
  }

  const sections = [
    {
      title: "Forecast Section",
      color: "FFFACD",
      fields: [
        "salesForecast",
        "strategicRxForecast",
        "focusRxForecast",
        "newProductRxForecast",
        "opdRxForecast",
        "gpRxForecast",
        "dischargeRxForecast",
      ],
    },
    {
      title: "Rx Section",
      color: "90EE90",
      fields: [
        "totalStrategicRx",
        "totalFocusRx",
        "totalNewProductRx",
        "otherProductsRxSBUA",
        "totalRxs",
        "opdRx",
        "dischargeRx",
        "gpRx",
      ],
    },
    {
      title: "Order Section",
      color: "87CEEB",
      fields: [
        "SBUAOrderRouteName",
        "noOfPartySBUAOrderRoute",
        "noOfCollectedOrderSBUA",
        "noOfNotGivingOrderParty",
        "causeOfNotGivingOrder",
        "marketTotalOrder",
        "cef3DSOrder",
        "cefotilOrder",
        "newProductOrder",
      ],
    },
    {
      title: "Survey Section",
      color: "FFB6C1",
      fields: ["rxSendInDIDS", "writtenRxInSurveyPad", "indoorSurvey"],
    },
  ];

  const exportExcel = async () => {
    if (!records.length) return alert("No records to export");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reports");

    // Section headers
    let colIndex = 3;
    sections.forEach((sec) => {
      const startCol = colIndex;
      const endCol = colIndex + sec.fields.length - 1;
      if (sec.fields.length > 1) worksheet.mergeCells(1, startCol, 1, endCol);
      const cell = worksheet.getCell(1, startCol);
      cell.value = sec.title;
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: sec.color } };
      colIndex = endCol + 1;
    });

    const headerRowValues = [
      "Created At",
      "User Name",
      ...sections.flatMap((sec) => sec.fields.map((f) => headerMap[f] || f)),
    ];
    worksheet.addRow(headerRowValues);

    worksheet.getRow(2).eachCell((cell, colNumber) => {
      let fillColor = colNumber <= 2 ? "ADD8E6" : "FFFFFF";
      let tmpIndex = 3;
      sections.forEach((sec) => {
        if (colNumber >= tmpIndex && colNumber < tmpIndex + sec.fields.length) fillColor = sec.color;
        tmpIndex += sec.fields.length;
      });
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillColor } };
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });

    records.forEach((r) => {
      const rowValues = [
        formatDate(r.createdAt),
        r.userName,
        ...sections.flatMap((sec) => sec.fields.map((f) => r[f] ?? "")),
      ];
      const row = worksheet.addRow(rowValues);
      row.eachCell((cell, colNumber) => {
        let fillColor = colNumber <= 2 ? "ADD8E6" : "FFFFFF";
        let tmpIndex = 3;
        sections.forEach((sec) => {
          if (colNumber >= tmpIndex && colNumber < tmpIndex + sec.fields.length) fillColor = sec.color;
          tmpIndex += sec.fields.length;
        });
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillColor } };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
      });
    });

    const textFields = ["SBUAOrderRouteName", "causeOfNotGivingOrder", "indoorSurvey"];
    const totalRowValues = [
      "Total",
      "",
      ...sections.flatMap((sec) =>
        sec.fields.map((f) => (textFields.includes(f) ? "" : numericFields.includes(f) ? totals[f] : ""))
      ),
    ];
    const totalRow = worksheet.addRow(totalRowValues);
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D3D3D3" } };
      cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
    });

    worksheet.getColumn(1).width = 22;
    worksheet.getColumn(2).width = 25;
    for (let i = 3; i <= worksheet.columns.length; i++) worksheet.getColumn(i).width = 12;
    worksheet.getRow(1).height = 35;
    worksheet.getRow(2).height = 65;
    for (let i = 3; i <= worksheet.rowCount; i++) worksheet.getRow(i).height = 25;

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `report_${loggedInUser}_${start}_to_${end}.xlsx`);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Reports ({loggedInUser || "All Users"})</h3>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">Start Date:</label>
          <input type="date" value={start} max={new Date().toISOString().split("T")[0]} onChange={(e) => setStart(e.target.value)} className="border px-2 py-1 rounded" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold">End Date:</label>
          <input type="date" value={end} max={new Date().toISOString().split("T")[0]} onChange={(e) => setEnd(e.target.value)} className="border px-2 py-1 rounded" />
        </div>
        <div className="self-end flex gap-2">
          <button onClick={fetchRecords} disabled={loading} className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Loading..." : "View"}
          </button>
          <button onClick={handleReset} className="bg-yellow-700 text-white px-4 py-2 rounded hover:bg-yellow-800">Reset</button>
          <button onClick={exportExcel} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Export Excel</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left border border-gray-300">Created At</th>
              {dynamicFields.map((f) => <th key={f} className="p-2 text-left border border-gray-300">{headerMap[f] || f}</th>)}
            </tr>
          </thead>
          <tbody>
            {records.length ? records.map((r) => (
              <tr key={r._id} className="border-t border-gray-300">
                <td className="p-2 text-sm border border-gray-300">{formatDate(r.createdAt)}</td>
                {dynamicFields.map((f) => <td key={f} className="p-2 border border-gray-300">{r[f] ?? ""}</td>)}
              </tr>
            )) : <tr><td colSpan={dynamicFields.length + 1} className="p-4 text-center text-gray-500 border border-gray-300">Please filter records</td></tr>}

            {records.length > 0 && (
              <tr className="bg-gray-200 font-semibold border-t border-gray-300">
                <td className="p-2 border border-gray-300">Total</td>
                {dynamicFields.map((f) => <td key={f} className="p-2 border border-gray-300">{numericFields.includes(f) ? totals[f] : ""}</td>)}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReportA;

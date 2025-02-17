import * as fs from "fs";
import ExcelJS from "exceljs";

const FILE_PATH = "data.xlsx";

/**
 * Saves flight price data into an Excel file using `exceljs`.
 * - Creates the file if it doesn't exist.
 * - Stores all flights (both best & other).
 * - Includes price level with conditional formatting.
 * - Tracks query date, outbound date, return date.
 * - Ensures a row is saved even if no flights exist.
 */
export async function savePrice(
  flights: any[],
  queryDate: string,
  outboundDate: string,
  returnDate: string,
  origin: string,
  destination: string,
  priceLevel: string,
  lowestPrice: number
) {
  const workbook = new ExcelJS.Workbook();
  let worksheet: ExcelJS.Worksheet;

  // If file exists, load it; otherwise, create a new one
  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH);
    worksheet = workbook.getWorksheet("Flight Prices") || workbook.addWorksheet("Flight Prices");
  } else {
    worksheet = workbook.addWorksheet("Flight Prices");
    worksheet.addRow([
      "Query Date",
      "Outbound Date",
      "Return Date",
      "Best Flight?",
      "Airline",
      "From",
      "To",
      "Departure Time",
      "Arrival Time",
      "Duration (min)",
      "Layovers",
      "Price (MYR)",
      "Lowest Price (MYR)",
      "Price Level",
      "Remarks"
    ]);
  }

  if (flights.length > 0) {
    flights.forEach((flight) => {
      const firstLeg = flight.flights[0]; // Get first leg of the journey

      const row = worksheet.addRow([
        queryDate,
        outboundDate,
        returnDate,
        flight.best_flight ? "✅ Yes" : "❌ No", // Boolean flag
        firstLeg.airline || "NULL",
        firstLeg.departure_airport?.id || "NULL",
        firstLeg.arrival_airport?.id || "NULL",
        firstLeg.departure_airport?.time || "NULL",
        firstLeg.arrival_airport?.time || "NULL",
        flight.total_duration || "NULL",
        flight.layovers?.length || 0,
        flight.price || "NULL",
        lowestPrice, // ✅ Store lowest price
        priceLevel.toUpperCase(),
        "Flight available" // ✅ Default remark for available flights
      ]);

      // ✅ Color-code Price Level column
      const priceLevelCell = row.getCell(14);
      if (priceLevel === "high") {
        priceLevelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0000" } }; // Red
      } else if (priceLevel === "medium") {
        priceLevelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } }; // Yellow
      } else if (priceLevel === "typical") {
        priceLevelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "00FF00" } }; // Green
      }
    });
  } else {
    // ✅ Save a row even if no flights were found
    worksheet.addRow([
      queryDate,
      outboundDate,
      returnDate,
      "NULL",
      "NULL",
      origin,
      destination,
      "NULL",
      "NULL",
      "NULL",
      "NULL",
      "NULL",
      lowestPrice,
      priceLevel.toUpperCase(),
      "No direct flights found"
    ]);
  }

  console.log(`💾 Saved ${flights.length} flight(s) to Excel.`);

  // Save workbook
  await workbook.xlsx.writeFile(FILE_PATH);
}

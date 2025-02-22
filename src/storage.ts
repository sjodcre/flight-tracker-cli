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
  outboundFlights: any[],
  returnFlights: any[],
  queryDate: string,
  outboundDate: string,
  returnDate: string,
  origin: string,
  destination: string,
  priceLevel: string,
  lowestPrice: number
) {
  if (outboundFlights.length !== returnFlights.length) {
    console.log("Error: Outbound and return flights arrays have different lengths");
    return;
  }


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
      "Outbound Airline",
      "From",
      "To", 
      "Departure Time Outbound",
      "Arrival Time Outbound",
      "Duration Outbound (min)",
      "Outbound Layovers",
      "Return Airline",
      "Return From",
      "Return To",
      "Departure Time Return",
      "Arrival Time Return", 
      "Duration Return (min)",
      "Return Layovers",
      "Lowest Price (MYR)",
      "Price Level",
      "Remarks"
    ]);
  }

  if (outboundFlights.length > 0) {
    outboundFlights.forEach((outboundFlight, index) => {
      const firstLegOutbound = outboundFlight.flights[0]; // Get first leg of outbound journey
      const returnFlight = returnFlights[index]; // Get matching return flight
      const firstLegReturn = returnFlight.flights[0]; // Get first leg of return journey

      const row = worksheet.addRow([
        queryDate,
        outboundDate,
        returnDate,
        outboundFlight.best_flight ? "✅ Yes" : "❌ No", // Boolean flag
        firstLegOutbound.airline || "NULL",
        firstLegOutbound.departure_airport?.id || "NULL",
        firstLegOutbound.arrival_airport?.id || "NULL",
        firstLegOutbound.departure_airport?.time || "NULL",
        firstLegOutbound.arrival_airport?.time || "NULL",
        outboundFlight.total_duration || "NULL",
        outboundFlight.layovers?.length || 0,
        firstLegReturn.airline || "NULL",
        firstLegReturn.departure_airport?.id || "NULL", 
        firstLegReturn.arrival_airport?.id || "NULL",
        firstLegReturn.departure_airport?.time || "NULL",
        firstLegReturn.arrival_airport?.time || "NULL",
        returnFlight.total_duration || "NULL",
        returnFlight.layovers?.length || 0,
        lowestPrice, // ✅ Store lowest price
        priceLevel.toUpperCase(),
        "Flight available" // ✅ Default remark for available flights
      ]);

      // ✅ Color-code Price Level column
      const priceLevelCell = row.getCell(20); // Updated cell index since we added more columns
      if (priceLevel === "high") {
        priceLevelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0000" } }; // Red
      } else if (priceLevel === "medium") {
        priceLevelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } }; // Yellow
      } else if (priceLevel === "typical") {
        priceLevelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "00FF00" } }; // Green
      } else if (priceLevel === "low") {
        priceLevelCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "0000FF" } }; // Blue
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
      "NULL", // Outbound departure time
      "NULL", // Outbound arrival time
      "NULL", // Outbound duration
      "NULL", // Outbound layovers
      "NULL", // Outbound price
      "NULL", // Return airline
      "NULL", // Return departure airport
      "NULL", // Return arrival airport
      "NULL", // Return departure time
      "NULL", // Return arrival time
      "NULL", // Return duration
      "NULL", // Return layovers
      lowestPrice,
      priceLevel.toUpperCase(),
      "No direct flights found"
    ]);
  }

  console.log(`💾 Saved ${outboundFlights.length} flight(s) to Excel.`);

  // Save workbook
  await workbook.xlsx.writeFile(FILE_PATH);
}

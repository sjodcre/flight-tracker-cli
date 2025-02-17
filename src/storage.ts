import * as fs from "fs";
import ExcelJS from "exceljs";

const FILE_PATH = "data.xlsx";

/**
 * Saves flight price data into an Excel file using `exceljs`.
 * - Creates the file if it doesn't exist.
 * - Appends data without reading the entire file.
 * @param from - Departure airport code.
 * @param to - Destination airport code.
 * @param date - Flight date (YYYY-MM-DD).
 * @param price - Flight price.
 */
export async function savePrice(from: string, to: string, date: string, price: number) {
  const workbook = new ExcelJS.Workbook();
  let worksheet: ExcelJS.Worksheet;

  // If file exists, load it; otherwise, create a new one
  if (fs.existsSync(FILE_PATH)) {
    await workbook.xlsx.readFile(FILE_PATH);
    worksheet = workbook.getWorksheet("Flight Prices") || workbook.addWorksheet("Flight Prices");
  } else {
    worksheet = workbook.addWorksheet("Flight Prices");
    worksheet.addRow(["Date", "From", "To", "Price"]); // Header row
  }

  // Append new data as a new row
  worksheet.addRow([date, from, to, price]);
  console.log(`💾 Saved: ${date} | ${from} → ${to} | ${price} MYR`);

  // Save workbook
  await workbook.xlsx.writeFile(FILE_PATH);
}

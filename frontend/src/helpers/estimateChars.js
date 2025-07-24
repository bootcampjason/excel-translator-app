// src/utils/estimateTotalCharsAcrossFiles.js
import * as XLSX from "xlsx";

export async function estimateChars(file) {
  let numOfChars = 0;
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    rows.forEach((row) => {
      row.forEach((cell) => {
        if (typeof cell === "string") {
          numOfChars += cell.length;
        }
      });
    });
  });
  return numOfChars;
}

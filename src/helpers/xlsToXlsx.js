import * as XLSX from 'xlsx';

/**
 * Converts an .xls file to .xlsx format using SheetJS (XLSX).
 * @param {File} file - The uploaded .xls file.
 * @returns {Promise<Blob>} - A Promise that resolves with the converted .xlsx Blob.
 */
export function convertXlsToXlsx(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Write workbook as .xlsx Blob
        const xlsxArray = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const xlsxBlob = new Blob([xlsxArray], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        resolve(xlsxBlob);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(file);
  });
}

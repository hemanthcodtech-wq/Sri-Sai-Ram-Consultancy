import * as XLSX from 'xlsx';

/**
 * Exports data to an Excel (.xlsx) file
 * @param {Array<Object>} data - Array of objects representing rows
 * @param {string} fileNamePrefix - Prefix for the downloaded file name
 * @param {string} sheetName - Name of the worksheet
 */
export const exportToExcel = (data, fileNamePrefix = 'SSRC_Export', sheetName = 'Records') => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  try {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Auto-calculate column widths
    const columnKeys = Object.keys(data[0] || {});
    const colWidths = columnKeys.map((key) => {
      let maxLen = key.length;
      data.forEach((row) => {
        const val = row[key];
        if (val !== undefined && val !== null) {
          const str = String(val);
          if (str.length > maxLen) {
            maxLen = str.length;
          }
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 12), 50) };
    });
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const dateStr = new Date().toISOString().slice(0, 10);
    const timeStr = new Date().toTimeString().slice(0, 5).replace(':', '');
    const fullFileName = `${fileNamePrefix}_${dateStr}_${timeStr}.xlsx`;

    XLSX.writeFile(workbook, fullFileName);
  } catch (err) {
    console.error('Failed to export to Excel:', err);
    alert('Error generating Excel file. Please try again.');
  }
};

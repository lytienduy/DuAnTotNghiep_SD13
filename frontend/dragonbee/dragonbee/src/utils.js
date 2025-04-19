import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
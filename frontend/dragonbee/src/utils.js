import * as XLSX from 'xlsx';

// Hàm xuất Excel
export const exportToExcel = (data, fileName) => {
    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
// Hàm đăng nhập
export const login = async (username, password) => {
    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Đăng nhập thất bại");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};
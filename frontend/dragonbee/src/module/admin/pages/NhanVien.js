import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Avatar,
  Box,
  Tooltip,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  ChevronLeft,
  ChevronRight,
  Search,
} from "@mui/icons-material";
import * as XLSX from "sheetjs-style";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Swal from "sweetalert2";

const NhanVien = () => {
  const [nhanViens, setNhanViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [trangThai, setTrangThai] = useState(""); // Trạng thái được
  const [gioiTinh, setGioiTinh] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/nhanvien")
      .then((response) => {
        const sortedData = response.data.sort(
          (a, b) => new Date(b.ngayTao) - new Date(a.ngayTao)
        );
        setNhanViens(sortedData);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu nhân viên:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenConfirm = (id) => {
    Swal.fire({
      title: "Xác nhận đổi trạng thái?",
      text: "Bạn có chắc chắn muốn đổi trạng thái nhân viên này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#d33",
      width: "400px",
      height: "100px",
      customClass: {
        popup: "custom-alert", // Thêm class tùy chỉnh
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirmToggle(id);
      }
    });
  };

  const handleConfirmToggle = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/nhanvien/${id}/doi-trang-thai`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        Swal.fire(
          "Thành công!",
          "Trạng thái nhân viên đã được cập nhật.",
          "success"
        );
        window.location.reload();
      } else {
        Swal.fire("Lỗi!", "Không thể đổi trạng thái.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
    }
  };

  useEffect(() => {
    fetchNhanViensFilter();
  }, [trangThai, gioiTinh]); // Gọi API khi thay đổi trạng thái hoặc giới tính
  
  const fetchNhanViensFilter = async () => {
    setLoading(true);
    let url = "http://localhost:8080/api/nhanvien/loc?";
    if (trangThai) url += `trangThai=${trangThai}&`;
    if (gioiTinh) url += `gioiTinh=${gioiTinh}`;
  
    try {
      const response = await axios.get(url);
      setNhanViens(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy nhân viên:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchNhanViensSearch = (searchKeyword = "") => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/nhanvien/tim-kiem?keyword=${searchKeyword}`)
      .then((response) => {
        setNhanViens(response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu nhân viên:", error))
      .finally(() => setLoading(false));
  };
  
  const handleSearch = () => {
    fetchNhanViensSearch(keyword);
  };
  
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (keyword.trim() !== "") {
        fetchNhanViensSearch(keyword);
      } else {
        try {
          const response = await axios.get(
            "http://localhost:8080/api/nhanvien"
          );
          const data = response.data;

          setNhanViens((prevNhanViens) => {
            // Đảm bảo nhân viên mới thêm đứng đầu
            const updatedList = [...data];

            prevNhanViens.forEach((nhanVien) => {
              if (!updatedList.some((nv) => nv.id === nhanVien.id)) {
                updatedList.unshift(nhanVien);
              }
            });

            return updatedList;
          });
        } catch (error) {
          console.error("Lỗi khi lấy danh sách nhân viên:", error);
        }
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [keyword]);

  const handleToggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/nhanvien/${id}/doi-trang-thai`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const message = await response.text();
        alert(message); // Hiển thị thông báo
        window.location.reload(); // Cập nhật giao diện
      } else {
        alert("Lỗi khi đổi trạng thái!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };
  // // Lấy danh sách nhân viên
  // useEffect(() => {
  //   fetchNhanViens();
  // }, []);

  // // Xử lý chọn file
  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };

  // // Import Excel
  // const importExcel = async () => {
  //   if (!file) {
  //     Swal.fire("Lỗi!", "Vui lòng chọn file Excel!", "error");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/api/nhanvien/import",
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );

  //     Swal.fire("Thành công!", response.data.message, "success");
  //     fetchNhanViens(); // Load lại danh sách nhân viên
  //   } catch (error) {
  //     Swal.fire(
  //       "Lỗi!",
  //       error.response?.data?.message || "Có lỗi xảy ra!",
  //       "error"
  //     );
  //   }
  // };

  const exportToExcel = () => {
    const data = nhanViens.map((nv, index) => [
      index + 1,
      nv.ma, // Thêm Mã Nhân Viên
      nv.tenNhanVien,
      nv.email,
      nv.sdt,
      new Date(nv.ngaySinh).toLocaleDateString(),
      nv.gioiTinh,
      nv.trangThai,
      nv.diaChi, // Địa chỉ
    ]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "STT",
        "Mã",
        "Tên",
        "Email",
        "Số Điện Thoại",
        "Ngày Sinh",
        "Giới Tính",
        "Trạng Thái",
        "Địa chỉ",
      ], // Thêm cột Mã Nhân Viên
      ...data,
    ]);

    // Định dạng tiêu đề
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "228B22" } }, // Màu xanh lá
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    const cellStyle = {
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    const addressStyle = {
      alignment: { indent: 1 },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    // Áp dụng định dạng cho tiêu đề
    const headerRow = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"]; // Thêm cột I1
    headerRow.forEach((cell) => {
      ws[cell] = ws[cell] || {};
      ws[cell].s = headerStyle;
    });

    // Áp dụng định dạng cho dữ liệu
    const numRows = data.length + 1;
    for (let row = 2; row <= numRows + 1; row++) {
      for (let col = 0; col < 9; col++) {
        // 9 cột thay vì 8
        const cellRef = XLSX.utils.encode_cell({ r: row - 1, c: col });
        if (!ws[cellRef]) ws[cellRef] = {};
        ws[cellRef].s = col === 8 ? addressStyle : cellStyle; // Cột địa chỉ có style riêng
      }
    }

    // Thiết lập độ rộng cột
    ws["!cols"] = [
      { wch: 5 }, // STT
      { wch: 15 }, // Mã Nhân Viên
      { wch: 20 }, // Tên
      { wch: 30 }, // Email
      { wch: 15 }, // Số Điện Thoại
      { wch: 15 }, // Ngày Sinh
      { wch: 10 }, // Giới Tính
      { wch: 15 }, // Trạng Thái
      { wch: 70 }, // Địa chỉ
    ];

    // Xuất file
    XLSX.utils.book_append_sheet(wb, ws, "Nhân Viên");
    XLSX.writeFile(wb, "DanhSachNhanVien.xlsx");
  };

  const totalPages = Math.ceil(nhanViens.length / rowsPerPage);
  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
        pages.push(
          <Button
            key={i}
            variant={i === page ? "contained" : "text"}
            onClick={() => setPage(i)}
            sx={{
              minWidth: "36px",
              height: "38px",
              borderRadius: "55%",
              mx: 0.5,
              "&:hover": { backgroundColor: "#ddd" },
            }}
          >
            {i}
          </Button>
        );
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <Box >
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Quản Lý Nhân Viên
      </Typography>
      <Box
        component={Paper}
        elevation={2}
        sx={{ p: 2, mb: 2, backgroundColor: "white" }}
       >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Bộ lọc
        </Typography>

        <Box display="flex" gap={3} alignItems="center">
          {/* Ô tìm kiếm */}

          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Tìm kiếm
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm theo mã, tên, sđt,..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{ backgroundColor: "white", width: 420 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Trạng thái + Giới tính cùng hàng */}
          <Box display="flex" gap={3} alignItems="center">
            {/* Trạng thái */}
            <Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Trạng thái
              </Typography>
              <Select
                value={trangThai}
                onChange={(e) => setTrangThai(e.target.value)}
                displayEmpty
                variant="outlined"
                size="small"
                sx={{ width: 150, backgroundColor: "white" }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Vô hiệu hóa">Vô hiệu hóa</MenuItem>
              </Select>
            </Box>

            {/* Giới tính */}
            <Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Giới tính
              </Typography>
              <Select
                value={gioiTinh}
                onChange={(e) => setGioiTinh(e.target.value)}
                displayEmpty
                variant="outlined"
                size="small"
                sx={{ width: 150, backgroundColor: "white" }}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        {/* Import Excel */}
        {/* <Button variant="contained" color="primary">
          Nhập Excel
        </Button> */}
        <Button variant="contained" color="primary" onClick={exportToExcel}>
          Xuất Excel
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate("/admin/nhanvien/tao-moi")}
        >
          Thêm Nhân Viên
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>STT</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ảnh</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Mã</strong>
                  </TableCell>{" "}
                  {/* Thêm cột này */}
                  <TableCell>
                    <strong>Tên Nhân Viên</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Số Điện Thoại</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ngày Sinh</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Giới Tính</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Trạng Thái</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Hành Động</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {nhanViens
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((nv, index) => (
                    <TableRow key={nv.id}>
                      <TableCell>
                        {(page - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell>
                        <Avatar src={nv.anh} alt={nv.tenNhanVien} />
                      </TableCell>
                      <TableCell>{nv.ma}</TableCell>{" "}
                      {/* Hiển thị mã nhân viên */}
                      <TableCell>{nv.tenNhanVien}</TableCell>
                      <TableCell>{nv.email}</TableCell>
                      <TableCell>{nv.sdt}</TableCell>
                      <TableCell>
                        {new Date(nv.ngaySinh).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{nv.gioiTinh}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor:
                              nv.trangThai === "Hoạt động"
                                ? "#DFFFD6"
                                : "#FFD6D6",
                            color:
                              nv.trangThai === "Hoạt động" ? "green" : "red",
                            borderRadius: "14px",
                            padding: "4px 8px",
                            display: "inline-block",
                          }}
                        >
                          {nv.trangThai}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Chỉnh sửa" arrow placement="top">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate(`/admin/nhanvien/chinh-sua/${nv.id}`)
                            }
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Chuyển trạng thái"
                          arrow
                          placement="top"
                        >
                          <IconButton
                            color={
                              nv.trangThai === "Hoạt động"
                                ? "primary"
                                : "default"
                            }
                            onClick={() => handleOpenConfirm(nv.id)}
                          >
                            <SwapHorizIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            mt={2}
          >
            <Box display="flex" alignItems="center">
              <Typography mr={2}>Xem</Typography>
              <Select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value)}
                sx={{
                  height: "32px", // Giảm chiều cao
                  minWidth: "60px",
                  borderRadius: "8px",
                  "&.Mui-focused": {
                    borderColor: "#1976D2", // Màu xanh dương khi chọn
                    borderWidth: "2px",
                  },
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </Select>

              <Typography ml={2}>Nhân viên</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft />
              </IconButton>
              {renderPageNumbers()}
              <IconButton
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default NhanVien;

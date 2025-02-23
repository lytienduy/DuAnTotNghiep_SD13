import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
  Edit,
} from "@mui/icons-material";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
  Pagination,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Slider,
} from "@mui/material";

const SanPhamChiTiet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [chiTietList, setChiTietList] = useState([]); // Khởi tạo mặc định là mảng trống
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Mở đóng Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Nội dung thông báo
  const [filters, setFilters] = useState({
    search: "",
    trangThai: "",
    thuongHieu: "",
    danhMuc: "",
    phongCach: "",
    chatLieu: "",
    xuatXu: "",
    mauSac: "",
    size: "",
    kieuDang: "",
    kieuDaiQuan: "",
    priceRange: [100000, 5000000],
  });
  const [size, setSize] = useState(5); // Hoặc giá trị mặc định phù hợp
  const [commonPrice, setCommonPrice] = useState("");
  const [commonQuantity, setCommonQuantity] = useState("");
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [open, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Mặc định là 5 item mỗi trang
  const [selectedItems, setSelectedItems] = useState([]); // Dùng để lưu trữ các sản phẩm được chọn
  const [danhMucs, setDanhMucs] = useState("");
  const [thuongHieus, setThuongHieus] = useState("");
  const [phongCachs, setPhongCachs] = useState("");
  const [chatLieus, setChatLieus] = useState("");
  const [kieuDangs, setKieuDangs] = useState("");
  const [kieuDaiQuans, setKieuDaiQuans] = useState("");
  const [xuatXus, setXuatXus] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  // Hàm tải mã QR cho sản phẩm chi tiết
  const handleDownloadQRCode = async (productDetailId) => {
    try {
      // Kiểm tra nếu sản phẩm chi tiết đã có trong chiTietList
      const productDetail = chiTietList.find(
        (item) => item.id === productDetailId
      );
      if (!productDetail) {
        alert("Sản phẩm chi tiết không tồn tại.");
        return;
      }

      // Lấy mã sản phẩm chi tiết
      const response = await axios.get(
        `http://localhost:8080/api/qr-code/${productDetailId}`,
        {
          responseType: "arraybuffer", // Để nhận dữ liệu hình ảnh dưới dạng binary
        }
      );

      const blob = new Blob([response.data], { type: "image/png" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${productDetail.ma}.png`; // Tên file là mã sản phẩm
      link.click();
    } catch (error) {
      console.error("Lỗi khi tải mã QR:", error);
      alert("Có lỗi khi tải mã QR.");
    }
  };
  const fetchSanPhamChiTietById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/sanpham/by-san-pham/${id}`,
        {
          params: {
            page: page - 1,
            size: itemsPerPage,
          },
        }
      );
      setChiTietList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết theo ID:", error);
    }
  };

  // Hàm lấy tất cả sản phẩm chi tiết
  const fetchAllSanPhamChiTiet = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/sanpham/chi-tiet/all",
        {
          params: {
            page: page - 1,
            size: itemsPerPage,
          },
        }
      );
      setChiTietList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
    }
  };

  // useEffect để gọi API khi id, page, hoặc itemsPerPage thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!showAllDetails) {
          // Nếu không hiển thị toàn bộ sản phẩm, lấy theo ID sản phẩm cha
          await fetchSanPhamChiTietById(id);
        } else {
          // Nếu hiển thị toàn bộ, lấy tất cả sản phẩm chi tiết
          await fetchAllSanPhamChiTiet();
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
        setChiTietList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, page, itemsPerPage, showAllDetails]); // Gọi lại khi id, page, itemsPerPage, showAllDetails thay đổi

  const handleShowAllToggle = () => {
    setShowAllDetails(!showAllDetails);
    setPage(1); // Khi đổi trạng thái, reset lại trang về 1

    setSnackbarMessage(
      !showAllDetails
        ? "Đang hiển thị toàn bộ sản phẩm chi tiết."
        : "Đã ẩn sản phẩm chi tiết."
    );
    setOpenSnackbar(true);
  };
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  // Kiểm tra chiTietList có phải là mảng và lọc dữ liệu hợp lý
  const filteredData = chiTietList.filter(
    (item) =>
      item.tenSanPham.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.trangThai === "" || item.trangThai === filters.trangThai) &&
      (filters.thuongHieu === "" || item.thuongHieu === filters.thuongHieu) &&
      (filters.danhMuc === "" || item.danhMuc === filters.danhMuc) &&
      (filters.phongCach === "" || item.phongCach === filters.phongCach) &&
      (filters.chatLieu === "" || item.chatLieu === filters.chatLieu) &&
      (filters.xuatXu === "" || item.xuatXu === filters.xuatXu) &&
      (filters.mauSac === "" || item.mauSac === filters.mauSac) &&
      (filters.size === "" || item.size === filters.size) &&
      (filters.kieuDang === "" || item.kieuDang === filters.kieuDang) &&
      (filters.kieuDaiQuan === "" ||
        item.kieuDaiQuan === filters.kieuDaiQuan) &&
      item.gia >= filters.priceRange[0] &&
      item.gia <= filters.priceRange[1]
  );
  const fieldLabels = {
    thuongHieu: "Thương Hiệu",
    danhMuc: "Danh Mục",
    phongCach: "Phong Cách",
    chatLieu: "Chất Liệu",
    xuatXu: "Xuất Xứ",
    mauSac: "Màu Sắc",
    size: "Kích Cỡ",
    kieuDang: "Kiểu Dáng",
    kieuDaiQuan: "Kiểu Đai Quần",
  };
  // đổ danh mục
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/danhmuc")
      .then((res) => {
        console.log("Danh Mục API Response:", res.data); // Kiểm tra dữ liệu API
        if (Array.isArray(res.data)) {
          setDanhMucs(res.data); // Đảm bảo res.data là một mảng
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", res.data);
        }
      })
      .catch((error) => {
        console.error(
          "Lỗi API Danh Mục:",
          error.response ? error.response.data : error.message
        );
      });
  }, []);

  // đổ thương hiệu
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/thuonghieu")
      .then((res) => {
        console.log("Thương Hiệu API Response:", res.data); // Kiểm tra dữ liệu API
        setThuongHieus(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Thương Hiệu:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ phong cách
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/phongcach")
      .then((res) => {
        console.log("Phong Cách API Response:", res.data); // Kiểm tra dữ liệu API
        setPhongCachs(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Phong Cách:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ chất liệu
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/chatlieu")
      .then((res) => {
        console.log("Chất Liệu API Response:", res.data); // Kiểm tra dữ liệu API
        setChatLieus(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Chất Liệu:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ kiểu dáng
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kieudang")
      .then((res) => {
        console.log("Kiểu Dáng APi Response:", res.data);
        setKieuDangs(res.data);
        // Cập nhật danh sách kiểu dáng
      })
      .catch((error) =>
        console.error(
          "Lỗi API Phong Cách:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // đổ kiểu đai quần
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kieudaiquan")
      .then((response) => {
        setKieuDaiQuans(response.data);
        console.log(response.data); // Kiểm tra xem dữ liệu có được tải chính xác không
      })
      .catch((error) => {
        console.error("Lỗi khi lấy kiểu đai quần:", error);
      });
  }, []);

  // đổ xuất xứ
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/xuatxu")
      .then((res) => {
        console.log("Xuất Xứ API Response:", res.data); // Kiểm tra dữ liệu API
        setXuatXus(res.data);
      })
      .catch((error) =>
        console.error(
          "Lỗi API Xuất Xứ:",
          error.response ? error.response.data : error.message
        )
      );
  }, []);
  // màu sắc
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/mausac")
      .then((res) => {
        console.log("Dữ liệu màu sắc từ API:", res.data);
        setColors(res.data);
      })
      .catch((error) => console.error(error));
  }, []);
  // size
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/size")
      .then((res) => {
        console.log("Dữ liệu kích cỡ từ API:", res.data);
        setSizes(res.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // update
  const handlePriceChange = (event, newValue) => {
    setFilters({ ...filters, priceRange: newValue });
  };
  // Hàm xử lý thay đổi số lượng và giá

  const handleCheckboxChange = (id) => {
    setSelectedItems(
      (prevSelectedItems) =>
        prevSelectedItems.includes(id)
          ? prevSelectedItems.filter((itemId) => itemId !== id) // Bỏ chọn
          : [...prevSelectedItems, id] // Chọn
    );
  };
  const handleInputChange = (e, id, field) => {
    const value = e.target.value;

    setChiTietList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCommonValueChange = (type) => {
    const updatedItems = chiTietList.map((item) => {
      // Kiểm tra nếu sản phẩm đã được chọn, thì cập nhật thông tin
      if (selectedItems.includes(item.id)) {
        if (type === "soLuong") {
          return { ...item, soLuong: parseInt(commonQuantity) || item.soLuong }; // Cập nhật số lượng
        } else if (type === "gia") {
          return { ...item, gia: parseFloat(commonPrice) || item.gia }; // Cập nhật giá
        }
      }
      return item; // Không thay đổi với các sản phẩm không được chọn
    });

    setChiTietList(updatedItems); // Cập nhật lại bảng với dữ liệu mới
  };
  const handleEdit = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/san-pham-chi-tiet/${id}`
      );

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Phản hồi không phải JSON: ${contentType}`);
      }

      const productDetails = await response.json();
      console.log("Dữ liệu sản phẩm:", productDetails); // Kiểm tra dữ liệu trong console

      setSelectedItem(productDetails);
      setOpen(true);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setSnackbarMessage("Không thể lấy dữ liệu sản phẩm!");
      setOpenSnackbar(true);
    }
  };

  const handleSave = async () => {
    console.log("Dữ liệu gửi lên API:", selectedItem); // Kiểm tra dữ liệu frontend

    try {
      await axios.put(
        `http://localhost:8080/api/san-pham-chi-tiet/${selectedItem.id}`,
        selectedItem
      );

      console.log("Cập nhật thành công! Reload lại trang...");
      setSnackbarMessage("Cập nhật sản phẩm chi tiết thành công!");
      setOpenSnackbar(true);

      // Reload lại trang sau khi cập nhật thành công
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm chi tiết:", error);
      setSnackbarMessage("Lỗi khi cập nhật sản phẩm chi tiết!");
      setOpenSnackbar(true);
    }
  };

  const fetchSanPhamChiTiet = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/san-pham/by-san-pham/${selectedItem.id}`
      );
      console.log("Bảng sau khi cập nhật:", response.data.content); // Kiểm tra dữ liệu trả về
      setChiTietList(response.data.content);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm chi tiết:", error);
    }
  };

  const handleClose = () => {
    setOpen(false); // Chỉ đóng khi người dùng nhấn "Hủy"
  };

  // Hàm lưu và cập nhật thông tin sản phẩm

  return (
    <Container maxWidth="lg">
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Chi Tiết Sản Phẩm</Typography>
      </Grid>
      <Button color="black" sx={{ mr: 2 }} onClick={() => navigate("/sanpham")}>
        <ArrowBack />
      </Button>

      {/* Bộ lọc */}
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Tìm kiếm theo tên"
              variant="outlined"
              fullWidth
              size="small"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </Grid>

          {Object.keys(fieldLabels).map((field) => (
            <Grid item xs={6} md={2} key={field}>
              <FormControl fullWidth size="small">
                <Typography variant="caption">{fieldLabels[field]}</Typography>
                <Select
                  name={field}
                  value={filters[field]}
                  onChange={handleFilterChange}
                  displayEmpty
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {Array.isArray(chiTietList) &&
                    chiTietList.length > 0 &&
                    Array.from(
                      new Set(chiTietList.map((item) => item[field]))
                    ).map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          ))}

          <Grid item xs={5} md={3}>
            <Typography variant="body2">
              Khoảng giá: {filters.priceRange[0].toLocaleString()} VNĐ -{" "}
              {filters.priceRange[1].toLocaleString()} VNĐ
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={100000}
              max={5000000}
              step={100000}
              sx={{ mt: -1 }}
            />
          </Grid>
        </Grid>
      </Paper>
      {/* Toggle Button */}
      <Grid container justifyContent="flex-end" spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleShowAllToggle}
            sx={{
              backgroundColor: "lightblue",
              "&:hover": { backgroundColor: "lightblue" },
            }}
            startIcon={showAllDetails ? <VisibilityOff /> : <Visibility />}
          >
            {showAllDetails ? "Ẩn chi tiết" : "Hiển thị toàn bộ"}
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Các ô nhập số lượng chung và giá chung */}
          <div>
            <TextField
              label="Giá Chung"
              type="number"
              value={commonPrice}
              onChange={(e) => {
                setCommonPrice(e.target.value); // Cập nhật giá chung
                handleCommonValueChange("gia"); // Cập nhật bảng với giá mới
              }}
            />

            <TextField
              label="Số Lượng Chung"
              type="number"
              value={commonQuantity}
              onChange={(e) => {
                setCommonQuantity(e.target.value); // Cập nhật số lượng chung
                handleCommonValueChange("soLuong"); // Cập nhật bảng với số lượng mới
              }}
            />

            {/* Bảng hiển thị sản phẩm */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <strong>STT</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Mã SP Chi Tiết</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tên Sản Phẩm</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Danh Mục</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Thương Hiệu</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Phong Cách</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Chất Liệu</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Màu Sắc</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Kích Cỡ</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Kiểu Dáng</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Kiểu Đai Quần</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Xuất Xứ</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Số Lượng</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Giá</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Trạng Thái</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Hành Dộng</strong>
                    </TableCell>
                    <TableCell>Download QR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chiTietList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={17} align="center">
                        Không có dữ liệu phù hợp
                      </TableCell>
                    </TableRow>
                  ) : (
                    chiTietList.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                          />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.ma}</TableCell>
                        <TableCell>{item.tenSanPham}</TableCell>
                        <TableCell>{item.danhMuc}</TableCell>
                        <TableCell>{item.thuongHieu}</TableCell>
                        <TableCell>{item.phongCach}</TableCell>
                        <TableCell>{item.chatLieu}</TableCell>
                        <TableCell>{item.mauSac}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.kieuDang}</TableCell>
                        <TableCell>{item.kieuDaiQuan}</TableCell>
                        <TableCell>{item.xuatXu}</TableCell>
                        <TableCell>
                          <input
                            type="number"
                            value={item.soLuong}
                            onChange={(e) =>
                              handleInputChange(e, item.id, "soLuong")
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="number"
                            value={item.gia}
                            onChange={(e) =>
                              handleInputChange(e, item.id, "gia")
                            }
                          />
                        </TableCell>
                        <TableCell>{item.trangThai}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Edit />}
                            onClick={() => handleEdit(item.id)}
                          ></Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleDownloadQRCode(item.id)}
                          >
                            Download QR
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Modal chỉnh sửa */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
              <DialogTitle>Chỉnh Sửa Sản Phẩm</DialogTitle>
              <DialogContent>
                {selectedItem && (
                  <>
                    {/* Hàng 1: Danh Mục, Thương Hiệu, Phong Cách, Chất Liệu */}
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Danh Mục</InputLabel>
                          <Select
                            value={selectedItem?.danhMucId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                danhMucId: e.target.value,
                              }))
                            }
                          >
                            {danhMucs.map((dm) => (
                              <MenuItem key={dm.id} value={dm.id}>
                                {dm.tenDanhMuc}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Thương Hiệu</InputLabel>
                          <Select
                            value={selectedItem?.thuongHieuId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                thuongHieuId: e.target.value,
                              }))
                            }
                          >
                            {thuongHieus.map((th) => (
                              <MenuItem key={th.id} value={th.id}>
                                {th.tenThuongHieu}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Phong Cách</InputLabel>
                          <Select
                            value={selectedItem?.phongCachId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                phongCachId: e.target.value,
                              }))
                            }
                          >
                            {phongCachs.map((pc) => (
                              <MenuItem key={pc.id} value={pc.id}>
                                {pc.tenPhongCach}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Chất Liệu</InputLabel>
                          <Select
                            value={selectedItem?.chatLieuId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                chatLieuId: e.target.value,
                              }))
                            }
                          >
                            {chatLieus.map((cl) => (
                              <MenuItem key={cl.id} value={cl.id}>
                                {cl.tenChatLieu}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Hàng 2: Kiểu Dáng, Kiểu Đai Quần, Xuất Xứ */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={4}>
                      <FormControl fullWidth>
                          <InputLabel>Kiểu Dáng</InputLabel>
                          <Select
                            value={selectedItem?.kieuDangId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                kieuDangId: e.target.value,
                              }))
                            }
                          >
                            {kieuDangs.map((kd) => (
                              <MenuItem key={kd.id} value={kd.id}>
                                {kd.tenKieuDang}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Kiểu Đai Quần</InputLabel>
                          <Select
                            value={selectedItem?.kieuDaiQuanId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                kieuDaiQuanId: e.target.value,
                              }))
                            }
                          >
                            {kieuDaiQuans.map((kdq) => (
                              <MenuItem key={kdq.id} value={kdq.id}>
                                {kdq.tenKieuDaiQuan}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl fullWidth>
                          <InputLabel>Xuất Xứ</InputLabel>
                          <Select
                            value={selectedItem?.xuatXuId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                xuatXuId: e.target.value,
                              }))
                            }
                          >
                            {xuatXus.map((xx) => (
                              <MenuItem key={xx.id} value={xx.id}>
                                {xx.tenXuatXu}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Hàng 3: Màu Sắc, Kích Cỡ, Số Lượng, Giá */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Màu Sắc</InputLabel>
                          <Select
                            value={selectedItem?.mauSacId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                mauSacId: e.target.value,
                              }))
                            }
                          >
                            {colors.map((mauSac) => (
                              <MenuItem key={mauSac.id} value={mauSac.id}>
                                {mauSac.tenMauSac}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <FormControl fullWidth>
                          <InputLabel>Kích Cỡ</InputLabel>
                          <Select
                            value={selectedItem?.sizeId || ""}
                            onChange={(e) =>
                              setSelectedItem((prev) => ({
                                ...prev,
                                sizeId: e.target.value,
                              }))
                            }
                          >
                            {sizes.map((s) => (
                              <MenuItem key={s.id} value={s.id}>
                                {s.tenSize}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Số Lượng"
                          type="number"
                          value={selectedItem.soLuong}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              soLuong: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Giá Bán"
                          type="number"
                          value={selectedItem.gia}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              gia: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </Grid>

                    {/* Hàng 4: Mô Tả */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Mô Tả"
                          multiline
                          rows={3}
                          value={selectedItem.moTa}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              moTa: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Hủy
                </Button>
                <Button
                  onClick={handleSave}
                  color="primary"
                  variant="contained"
                >
                  Lưu
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={openSnackbar}
              onClose={() => setOpenSnackbar(false)}
            />
          </div>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2, p: 1, background: "#f1f1f1", borderRadius: "5px" }}
          >
            {/* Dropdown to select number of items per page */}
            <Box display="flex" alignItems="center">
              <Typography variant="body2" sx={{ mr: 1 }}>
                Xem
              </Typography>
              <Select
                value={size}
                onChange={(e) => {
                  setSize(e.target.value);
                  setPage(1); // Reset to first page
                }}
                size="small"
                sx={{ width: 70, backgroundColor: "white" }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
              </Select>
              <Typography variant="body2" sx={{ ml: 1 }}>
                sản phẩm
              </Typography>
            </Box>

            {/* Pagination controls */}
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              variant="outlined"
              shape="rounded"
              color="primary"
              siblingCount={0} // Keep it compact
              sx={{
                "& .MuiPaginationItem-root": {
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  "&.Mui-selected": {
                    backgroundColor: "lightblue",
                    color: "white",
                  },
                },
              }}
            />
          </Box>
        </>
      )}

      {/* Snackbar thông báo */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Hiển thị ở góc phải trên
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default SanPhamChiTiet;

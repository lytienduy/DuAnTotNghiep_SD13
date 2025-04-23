import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  Box,
  Select,
  MenuItem,
  FormControl,
  TableContainer,
  TableHead,
  Modal,
  TextField,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Add,
  ChevronLeft,
  ChevronRight,
  Visibility,
} from "@mui/icons-material";
import { Autorenew } from "@mui/icons-material";
import { Sync } from "@mui/icons-material"; // hoặc bất kỳ icon nào bạn thích
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ChatLieu = () => {
  const [chatLieuList, setChatLieuList] = useState([]);
  const [searchTenChatLieu, setSearchTenChatLieu] = useState("");
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5); // Số lượng phần tử mỗi trang
  const [open, setOpen] = useState(false);
  const [tenChatLieu, setTenChatLieu] = useState("");
  const [moTa, setMoTa] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [message, setMessage] = useState(""); // Thông báo thêm chất liệu thành công
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedChatLieu, setSelectedChatLieu] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [reload, setReload] = useState(false); // ✅ trigger reload sau khi thêm

  const navigate = useNavigate();
  // Gọi API từ Spring Boot
  // Gọi API để lấy dữ liệu phân trang
  useEffect(() => {
    setLoading(true);

    // Sử dụng searchTenChatLieu trong URL
    const url =
      trangThai === ""
        ? `http://localhost:8080/api/chatlieu/search?tenChatLieu=${searchTenChatLieu}&page=${page}&size=${rowsPerPage}`
        : `http://localhost:8080/api/chatlieu/search?tenChatLieu=${searchTenChatLieu}&trangThai=${trangThai}&page=${page}&size=${rowsPerPage}`;

    axios
      .get(url)
      .then((response) => {
        console.log("Dữ liệu API: ", response.data); // Kiểm tra dữ liệu trả về
        if (response.data && Array.isArray(response.data.content)) {
          setChatLieuList(response.data.content); // Nếu có dữ liệu, gán cho chatLieuList
          setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
        } else {
          setChatLieuList([]); // Nếu không có dữ liệu trả về, gán mảng rỗng
        }
        setLoading(false); // Đặt loading là false khi nhận được dữ liệu
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false); // Đặt loading là false khi có lỗi
      });
  }, [page, rowsPerPage, searchTenChatLieu, trangThai,reload]); // Đảm bảo sử dụng searchTenChatLieu trong dependencies

  const handleSearchTenChatLieuChange = (e) => {
    setSearchTenChatLieu(e.target.value);
  };

  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page + 1 && i <= page + 2)) {
        pages.push(
          <Button
            key={i}
            variant={i === page + 1 ? "contained" : "text"} // Đánh dấu trang hiện tại
            onClick={() => setPage(i - 1)} // Cập nhật trang
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

  // Mở/đóng modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Gọi API thêm chất liệu
  const handleAddChatLieu = async () => {
    const confirm = window.confirm("Bạn có muốn thêm mới chất liệu không?");
    if (!confirm) return;

    try {
      const response = await axios.post("http://localhost:8080/api/chatlieu/add", {
        tenChatLieu,
        moTa,
      });

      setMessage({ type: "success", text: "Thêm chất liệu thành công!" });
      setTenChatLieu("");
      setMoTa("");
      handleClose();

      setPage(0); // Quay về trang đầu
      setReload(prev => !prev); // Kích hoạt reload danh sách
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra, vui lòng thử lại." });
    }
  };
  
  
  // chuyển đổi trạng thái
  const handleOpenConfirm = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleToggleTrangThai = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/chatlieu/doi-trang-thai/${selectedId}`
      );

      // Cập nhật lại danh sách
      const updatedList = chatLieuList.map((item) =>
        item.id === selectedId ? response.data : item
      );
      setChatLieuList(updatedList);

      // Đóng confirm & hiện thông báo
      setConfirmOpen(false);
      setSnackbarMessage("Chuyển đổi trạng thái thành công!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi đổi trạng thái:", error);
      alert("Có lỗi xảy ra khi đổi trạng thái chất liệu.");
    }
  };
  // cập nhật chất liệu
  const handleOpenEdit = (chatLieu) => {
    setSelectedChatLieu({ ...chatLieu }); // clone object
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedChatLieu(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedChatLieu((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/chatlieu/cap-nhat/${selectedChatLieu.id}`,
        selectedChatLieu
      );
      const updated = res.data;

      // Cập nhật lại danh sách
      setChatLieuList((prev) =>
        prev.map((cl) => (cl.id === updated.id ? updated : cl))
      );

      setSnackbar({ open: true, message: "Cập nhật chất liệu thành công!" });
      handleCloseEdit();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Đã xảy ra lỗi khi cập nhật chất liệu.");
    }
  };

  return (
    <Box>
      {/* Header */}
      <Grid container alignItems="center" justifyContent="space-between">
        {/* Tiêu đề */}
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Quản Lý Chất Liệu
          </Typography>
        </Grid>

        {/* Nút Tạo Mới */}
        <Grid item>
          <Button
            variant="outlined"
            sx={{
              color: "lightblue",
              backgroundColor: "white",
              borderColor: "lightblue",
              "&:hover": {
                backgroundColor: "lightblue",
                color: "white",
                borderColor: "lightblue",
              },
            }}
            startIcon={<Add sx={{ color: "lightblue" }} />}
            onClick={handleOpen}
          >
            Tạo Mới
          </Button>
        </Grid>
      </Grid>

      {/* Ô tìm kiếm tên chất liệu */}
      <Paper sx={{ padding: 3, mb: 3 }}>
        {/* Sử dụng Grid container để thẳng hàng ô tìm kiếm, bộ lọc và nút tạo mới */}
        <Grid container spacing={2} alignItems="center">
          {/* Tìm kiếm */}
          <Grid item xs={12} md={4}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Tìm kiếm
            </Typography>
            <TextField
              label="Tìm kiếm theo tên chất liệu"
              value={searchTenChatLieu}
              onChange={handleSearchTenChatLieuChange}
              fullWidth
              size="small" // Giảm kích thước của TextField
            />
          </Grid>

          {/* Bộ lọc trạng thái */}
          <Grid item xs={12} md={3}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              Trạng thái
            </Typography>
            <FormControl fullWidth size="small" variant="outlined">
              <Select
                value={trangThai}
                onChange={(e) => setTrangThai(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Nút tạo mới */}
        </Grid>

        {/* Modal */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "white",
              padding: 3,
              borderRadius: 2,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" component="h2">
              Thêm Mới Chất Liệu
            </Typography>

            <TextField
              label="Tên Chất Liệu"
              variant="outlined"
              fullWidth
              margin="normal"
              value={tenChatLieu}
              onChange={(e) => setTenChatLieu(e.target.value)}
            />

            <TextField
              label="Mô Tả"
              variant="outlined"
              fullWidth
              margin="normal"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
            />
            {/* Nút Thêm */}
            <Button
              variant="contained"
              sx={{ marginTop: 2 }}
              onClick={handleAddChatLieu}
              disabled={!tenChatLieu || !moTa} // Disable nếu tên hoặc mô tả trống
            >
              Thêm
            </Button>
          </Box>
        </Modal>
        
        {message && (
        <Snackbar
          open={Boolean(message)}
          autoHideDuration={4000}  // Thông báo tự động ẩn sau 4 giây
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Vị trí góc phải phía trên
          onClose={() => setMessage(null)}
        >
          <Alert
            severity={message.type === "success" ? "success" : "error"}
            sx={{ my: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        </Snackbar>
      )}

      </Paper>

      {/* Nút tạo mới */}

      {/* Hiển thị loading */}
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
                    <strong>Tên Chất Liệu</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Mô Tả</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Trạng Thái</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Hoạt động</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(chatLieuList) && chatLieuList.length > 0 ? (
                  chatLieuList.map((chatLieu, index) => (
                    <TableRow key={chatLieu.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{chatLieu.tenChatLieu}</TableCell>
                      <TableCell>{chatLieu.moTa || "Không có mô tả"}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            chatLieu.trangThai === "Hoạt động"
                              ? "green"
                              : "red",
                        }}
                      >
                        {chatLieu.trangThai === "Hoạt động"
                          ? "Hoạt động"
                          : "Ngừng hoạt động"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEdit(chatLieu)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleOpenConfirm(chatLieu.id)}
                          title="Chuyển đổi trạng thái"
                        >
                          <Sync />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Dialog chỉnh sửa chất liệu */}
          <Dialog open={openEdit} onClose={handleCloseEdit}>
            <DialogTitle>Chỉnh sửa chất liệu</DialogTitle>
            <DialogContent
              sx={{
                minWidth: 400,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 1,
              }}
            >
              <TextField
                label="Tên chất liệu"
                name="tenChatLieu"
                value={selectedChatLieu?.tenChatLieu || ""}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Mô tả"
                name="moTa"
                value={selectedChatLieu?.moTa || ""}
                onChange={handleChange}
                fullWidth
                multiline
              />
              <TextField
                select
                label="Trạng thái"
                name="trangThai"
                value={selectedChatLieu?.trangThai || ""}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEdit}>Hủy</Button>
              <Button onClick={handleUpdate} variant="contained">
                Cập nhật
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar thông báo */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ open: false, message: "" })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success" sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
          <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
            <DialogTitle>Xác nhận chuyển đổi trạng thái</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Bạn có chắc muốn chuyển đổi trạng thái chất liệu này không?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirm} color="error">
                Hủy
              </Button>
              <Button onClick={handleToggleTrangThai} color="primary" autoFocus>
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {/* Phân trang */}
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

              <Typography ml={2}>Chất Liệu</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                <ChevronLeft />
              </IconButton>
              {renderPageNumbers()}
              <IconButton
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
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

export default ChatLieu;

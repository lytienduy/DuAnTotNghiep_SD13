import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Box, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddChatLieu = () => {
  const [ma, setMa] = useState("");
  const [tenChatLieu, setTenChatLieu] = useState("");
  const [moTa, setMoTa] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate(); // Hook để điều hướng sau khi thêm thành công

  // Xử lý khi người dùng nhấn nút "Thêm"
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!ma || !tenChatLieu || !trangThai) {
      setError("Mã, Tên chất liệu và Trạng thái không được để trống!");
      return;
    }

    // Reset lỗi
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/api/chatlieu/add_cl", {
        ma,
        tenChatLieu,
        moTa,
        trangThai,
      });

      if (response.status === 201) {
        setSuccess(true);
        setMa("");
        setTenChatLieu("");
        setMoTa("");
        setTrangThai("");

        // Hiển thị Snackbar thành công
        setOpenSnackbar(true);

        // Điều hướng về trang ChatLieu sau khi thêm thành công
        setTimeout(() => {
          navigate("/chatlieu"); // Điều hướng về trang ChatLieu (hoặc đường dẫn bạn muốn)
        }, 2000); // Điều hướng sau 2 giây để người dùng có thời gian xem thông báo
      }
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Đóng thông báo Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Tạo mới chất liệu
  const handleCreateNew = () => {
    setMa("");
    setTenChatLieu("");
    setMoTa("");
    setTrangThai("");
    setError(null);
    setSuccess(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Thêm Chất Liệu Mới
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Mã Chất Liệu"
              variant="outlined"
              fullWidth
              required
              value={ma}
              onChange={(e) => setMa(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tên Chất Liệu"
              variant="outlined"
              fullWidth
              required
              value={tenChatLieu}
              onChange={(e) => setTenChatLieu(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mô Tả"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="trangThai-label">Trạng Thái</InputLabel>
              <Select
                labelId="trangThai-label"
                value={trangThai}
                label="Trạng Thái"
                onChange={(e) => setTrangThai(e.target.value)}
              >
                <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                <MenuItem value="Ngừng hoạt động">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} container justifyContent="space-between">
              <Button type="submit" variant="contained" fullWidth>
                Thêm Chất Liệu
              </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar thông báo thành công */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Chất liệu đã được thêm thành công!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddChatLieu;

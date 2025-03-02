import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Grid,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NhanVienEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Khởi tạo useSnackbar
  const [errorNgaySinh, setErrorNgaySinh] = useState("");
  const [errorSdt, setErrorSdt] = useState("");
  const [originalSdt, setOriginalSdt] = useState(""); // Lưu số điện thoại ban đầu
  const [openConfirm, setOpenConfirm] = useState(false);
  const [file, setFile] = useState(null); // Lưu file ảnh mới

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const [nhanVien, setNhanVien] = useState({
    tenNhanVien: "",
    email: "",
    sdt: "",
    ngaySinh: "",
    gioiTinh: "",
    trangThai: "",
    diaChi: "",
    anh: "",
  });

  const [tinhList, setTinhList] = useState([]);
  const [quanList, setQuanList] = useState([]);
  const [xaList, setXaList] = useState([]);
  const handleBack = () => {
    navigate("/nhanvien"); // Điều hướng về trang phiếu giảm giá
  };

  const [diaChiParts, setDiaChiParts] = useState({
    tinh: "",
    quan: "",
    xa: "",
    soNha: "",
  });

  useEffect(() => {
    // Lấy thông tin nhân viên theo ID
    const fetchNhanVien = async () => {
      const response = await fetch(`http://localhost:8080/api/nhanvien/${id}`);
      if (response.ok) {
        const data = await response.json();
        setNhanVien(data);
      } else {
        enqueueSnackbar("Không tìm thấy nhân viên!", { variant: "error" });
        navigate("/nhanvien");
      }
    };
    fetchNhanVien();
  }, [id, enqueueSnackbar, navigate]);

  // Xử lý chọn ảnh mới
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setNhanVien({ ...nhanVien, anh: URL.createObjectURL(selectedFile) }); // Hiển thị ảnh tạm
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/nhanvien/${id}`)
      .then((response) => {
        setNhanVien(response.data);
        setOriginalSdt(response.data.sdt);

        // Tách địa chỉ từ dữ liệu API
        const parts = response.data.diaChi.split(", ");
        setDiaChiParts({
          tinh: parts[3] || "", // Tỉnh/Thành phố
          quan: parts[2] || "", // Quận/Huyện
          xa: parts[1] || "", // Xã/Phường
          soNha: parts[0] || "", // Số nhà
        });
      })
      .catch((error) => console.error("Lỗi khi tải dữ liệu nhân viên:", error));
  }, [id]);

  useEffect(() => {
    if (tinhList.length > 0 && diaChiParts.tinh) {
      const selectedTinh = tinhList.find(
        (tinh) => tinh.name === diaChiParts.tinh
      );
      if (selectedTinh) {
        setDiaChiParts((prev) => ({ ...prev, tinh: selectedTinh.code }));
      }
    }
  }, [tinhList, diaChiParts.tinh]);

  useEffect(() => {
    if (quanList.length > 0 && diaChiParts.quan) {
      const selectedQuan = quanList.find(
        (quan) => quan.name === diaChiParts.quan
      );
      if (selectedQuan) {
        setDiaChiParts((prev) => ({ ...prev, quan: selectedQuan.code }));
      }
    }
  }, [quanList, diaChiParts.quan]);

  useEffect(() => {
    if (xaList.length > 0 && diaChiParts.xa) {
      const selectedXa = xaList.find((xa) => xa.name === diaChiParts.xa);
      if (selectedXa) {
        setDiaChiParts((prev) => ({ ...prev, xa: selectedXa.code }));
      }
    }
  }, [xaList, diaChiParts.xa]);

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=1")
      .then((response) => setTinhList(response.data))
      .catch((error) =>
        console.error("Lỗi khi tải danh sách tỉnh/thành phố:", error)
      );
  }, []);

  useEffect(() => {
    if (diaChiParts.tinh) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${diaChiParts.tinh}?depth=2`)
        .then((response) => {
          setQuanList(response.data.districts || []);
        })
        .catch((error) =>
          console.error("Lỗi khi tải danh sách quận/huyện:", error)
        );
    }
  }, [diaChiParts.tinh]);

  useEffect(() => {
    if (diaChiParts.quan) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${diaChiParts.quan}?depth=2`)
        .then((response) => {
          console.log("Danh sách Xã/Phường:", response.data.wards);
          setXaList(response.data.wards || []);

          // // Kiểm tra nếu xã cũ tồn tại trong danh sách thì giữ lại
          // const selectedXa = response.data.wards.find(x => x.name === diaChiParts.xa);
          // setDiaChiParts(prev => ({
          //   ...prev,
          //   xa: selectedXa ? selectedXa.code : ""
          // }));
        })
        .catch((error) =>
          console.error("Lỗi khi tải danh sách xã/phường:", error)
        );
    }
  }, [diaChiParts.quan]);

  // useEffect(() => {
  //   if (diaChiParts?.xa) {
  //     // Nếu có giá trị xã/phường, sẽ đặt lại giá trị mặc định trong form
  //     setDiaChiParts((prev) => ({
  //       ...prev,
  //       xa: diaChiParts.xa,
  //     }));
  //   }
  // }, [diaChiParts?.xa]); // Chạy lại khi giá trị xa thay đổi

  const checkDuplicatePhone = async (phone) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/nhanvien/check-phone?sdt=${phone}`
      );
      return response.data.exists; // Trả về true nếu số điện thoại đã tồn tại
    } catch (error) {
      console.error("Lỗi khi kiểm tra số điện thoại:", error);
      return false;
    }
  };

  const handleDiaChiChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value); // Kiểm tra giá trị thay đổi
    setDiaChiParts((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = async (e) => {
    setNhanVien({ ...nhanVien, [e.target.name]: e.target.value });

    if (e.target.name === "sdt") {
      const phoneRegex = /^(0[1-9][0-9]{8})$/;
      if (!phoneRegex.test(e.target.value)) {
        setErrorSdt("Số điện thoại không đúng định dạng!");
      } else {
        const isDuplicate = await checkDuplicatePhone(e.target.value);
        if (isDuplicate && e.target.value !== nhanVien.sdt) {
          setErrorSdt("Số điện thoại đã tồn tại!");
        } else {
          setErrorSdt("");
        }
      }
    }

    if (e.target.name === "ngaySinh") {
      const today = new Date();
      const birthDate = new Date(e.target.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (
        age < 18 ||
        (age === 18 &&
          today < new Date(birthDate.setFullYear(today.getFullYear())))
      ) {
        setErrorNgaySinh("Nhân viên phải đủ 18 tuổi trở lên!");
      } else {
        setErrorNgaySinh("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullDiaChi = `${diaChiParts.soNha}, ${
      xaList.find((x) => x.code === diaChiParts.xa)?.name
    }, ${quanList.find((q) => q.code === diaChiParts.quan)?.name}, ${
      tinhList.find((t) => t.code === diaChiParts.tinh)?.name
    }`;

    // const updatedNhanVien = { ...nhanVien, diaChi: fullDiaChi };

    const phoneRegex = /^(0[1-9][0-9]{8})$/;
    if (!phoneRegex.test(nhanVien.sdt)) {
      enqueueSnackbar("Số điện thoại không đúng định dạng!", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    const isDuplicate = await checkDuplicatePhone(nhanVien.sdt);
    if (isDuplicate && nhanVien.sdt !== originalSdt) {
      enqueueSnackbar("Số điện thoại đã tồn tại!", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }

    const today = new Date();
    const birthDate = new Date(nhanVien.ngaySinh);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (
      age < 18 ||
      (age === 18 &&
        today < new Date(birthDate.setFullYear(today.getFullYear())))
    ) {
      enqueueSnackbar("Nhân viên phải đủ 18 tuổi trở lên!", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      return;
    }
    let newAnhUrl = nhanVien.anh; // Giữ nguyên ảnh cũ nếu không chọn ảnh mới

    if (file) {
      // Nếu có ảnh mới, upload lên server trước
      const formData = new FormData();
      formData.append("anh", file);

      try {
        const uploadResponse = await axios.post(
          "http://localhost:8080/api/nhanvien/upload-anh",
          formData
        );
        newAnhUrl = uploadResponse.data; // Nhận URL ảnh từ server
      } catch (error) {
        console.error("Lỗi khi upload ảnh:", error);
        enqueueSnackbar("Lỗi khi tải ảnh lên!", { variant: "error" });
        return;
      }
    }

    // Cập nhật nhân viên với ảnh mới hoặc giữ ảnh cũ
    const updatedNhanVien = { ...nhanVien, anh: newAnhUrl };

    axios
      .put(`http://localhost:8080/api/nhanvien/${id}`, updatedNhanVien)
      .then(() => {
        enqueueSnackbar("Cập nhật thông tin thành công!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });

        setTimeout(() => navigate("/nhanvien"), 1000);
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật nhân viên:", error);
        enqueueSnackbar("Lỗi khi cập nhật nhân viên!", { variant: "error" });
      });
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBack} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Quản Lý Nhân Viên{" "}
          <Box component="span" sx={{ color: "#b0b0b0", fontWeight: "bold" }}>
            / Chỉnh Sửa Nhân Viên
          </Box>
        </Typography>
      </Box>
      <Grid container sx={{ height: "110vh" }}>
        {/* Cột bên trái - Ảnh đại diện */}
        <Grid
          item
          xs={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "80%",
              padding: "20px",
              textAlign: "center",
              height: "83%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginBottom: "90px",
              position: "relative", // Để đặt trạng thái ở góc
            }}
          >
            {/* Hiển thị trạng thái ở góc phải */}
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor:
                  nhanVien.trangThai === "Hoạt động" ? "#DFFFD6" : "#FFF7CD", // Xanh lá nhạt hoặc đỏ nhạt
                color:
                  nhanVien.trangThai === "Hoạt động" ? "#008000" : "#A68B00", // Xanh lá đậm hoặc đỏ đậm
                padding: "5px 10px",
                borderRadius: "10px",
                fontSize: "0.9rem",
                border:
                  nhanVien.trangThai === "Hoạt động"
                    ? "1px solid #008000"
                    : "1px solid #A68B00", // Viền màu phù hợp
              }}
            >
              {nhanVien.trangThai === "Hoạt động" ? "Hoạt động" : "Vô hiệu hóa"}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "390px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginTop: "50px" }}
              ></Typography>
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <img
                src={nhanVien.anh || "https://via.placeholder.com/160"} // Hiển thị ảnh hiện tại hoặc ảnh mặc định
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("fileInput").click()} // Khi ấn vào ảnh, mở hộp thoại chọn ảnh
              />
              {/* {file && <button onClick={handleUpload}>Cập nhật ảnh</button>} */}
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#444",
                  marginTop: "10px",
                }}
              >
                {nhanVien.tenNhanVien || "Chưa xác định"}
              </Typography>

              <Typography variant="body2" sx={{ color: "#777" }}>
                Mã nhân viên: {nhanVien.ma || "Chưa xác định"}
              </Typography>
              <Box sx={{ justifyContent: "center", marginTop: "2px" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    color: "#777",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#555" }}
                  >
                    Người tạo:
                  </Typography>
                  <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                    {nhanVien.nguoiTao || "Chưa xác định"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-start",
                    color: "#777",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#555" }}
                  >
                    {" "}
                    Ngày tạo:
                  </Typography>
                  <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                    {nhanVien.ngayTao || "Chưa xác định"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-start",
                    color: "#777",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#555" }}
                  >
                    Người sửa:
                  </Typography>
                  <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                    {nhanVien.nguoiSua || "Chưa xác định"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-start",
                    color: "#777",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#555" }}
                  >
                    Ngày sửa:
                  </Typography>
                  <Typography variant="body2" sx={{ marginLeft: "8px" }}>
                    {nhanVien.ngaySua || "Chưa xác định"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Cột bên phải - Thông tin nhân viên */}
        <Grid
          item
          xs={8}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "90px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "90%",
              padding: "30px",
              height: "90%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: "30px" }}
              align="center"
            >
              Thông tin nhân viên
            </Typography>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên Nhân Viên"
                    name="tenNhanVien"
                    value={nhanVien.tenNhanVien}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={nhanVien.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số Điện Thoại"
                    name="sdt"
                    value={nhanVien.sdt}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ngày Sinh"
                    name="ngaySinh"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={nhanVien.ngaySinh}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                      Giới Tính
                    </Typography>
                    <RadioGroup
                      name="gioiTinh"
                      value={nhanVien.gioiTinh}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel
                        value="Nam"
                        control={<Radio />}
                        label="Nam"
                      />
                      <FormControlLabel
                        value="Nữ"
                        control={<Radio />}
                        label="Nữ"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* Địa chỉ */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="Tỉnh/Thành phố"
                        name="tinh"
                        value={diaChiParts?.tinh || ""}
                        onChange={handleDiaChiChange}
                        fullWidth
                        required
                      >
                        {tinhList.map((tinh) => (
                          <MenuItem key={tinh.code} value={tinh.code}>
                            {tinh.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="Quận/Huyện"
                        name="quan"
                        value={diaChiParts?.quan || ""}
                        onChange={handleDiaChiChange}
                        fullWidth
                        required
                      >
                        {quanList.map((quan) => (
                          <MenuItem key={quan.code} value={quan.code}>
                            {quan.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="Xã/Phường"
                        name="xa"
                        value={diaChiParts?.xa || ""}
                        onChange={handleDiaChiChange}
                        fullWidth
                        required
                      >
                        {xaList.map((xa) => (
                          <MenuItem key={xa.code} value={xa.code}>
                            {xa.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Số nhà/Ngõ/Đường"
                        name="soNha"
                        value={diaChiParts?.soNha || ""}
                        onChange={handleDiaChiChange}
                        fullWidth
                        required
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* Nút lưu và hủy */}
              <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/nhanvien")}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleOpenConfirm}
                >
                  Lưu Thay Đổi
                </Button>

                {/* Hộp thoại xác nhận */}
                <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                  <DialogTitle>
                    <Box display="flex" justifyContent="center">
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          border: "3px solid #FFA500",
                          backgroundColor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#FFA500",
                            fontSize: "32px",
                            fontWeight: "bold",
                          }}
                        >
                          !
                        </Typography>
                      </Box>
                    </Box>
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      sx={{
                        fontSize: "18px",
                        fontWeight: "500",
                        textAlign: "center",
                      }}
                    >
                      Bạn chắc chắn muốn cập nhật nhân viên không?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                    <Button
                      onClick={handleSubmit}
                      sx={{
                        backgroundColor: "#FFA500",
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        px: 3,
                        "&:hover": { backgroundColor: "#e69500" },
                      }}
                      autoFocus
                    >
                      Vâng!
                    </Button>
                    <Button
                      onClick={handleCloseConfirm}
                      sx={{
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        px: 3,
                        "&:hover": { backgroundColor: "#b71c1c" },
                      }}
                    >
                      Hủy
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NhanVienEdit;

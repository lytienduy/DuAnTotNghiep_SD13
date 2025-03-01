import React, { useEffect, useState, useRef } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QrCodeIcon from "@mui/icons-material/QrCode"; // Import icon
import { Html5QrcodeScanner } from "html5-qrcode";

const TaoMoiNhanVien = () => {
  const scannerRef = useRef(null);
  const [nhanVien, setNhanVien] = useState({
    ma: "",
    tenNhanVien: "",
    cccd: "",
    email: "",
    sdt: "",
    ngaySinh: "",
    gioiTinh: "Nam",
    trangThai: "Hoạt động",
    anh: null,
    diaChi: {
      tinh: "",
      quan: "",
      xa: "",
      soNha: "",
    },
  });

  const [openQR, setOpenQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [scanner, setScanner] = useState(null);
  const qrCodeScannerRef = useRef(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenConfirm = () => setOpenConfirm(true);
  const handleCloseConfirm = () => setOpenConfirm(false);

  const [tinhList, setTinhList] = useState([]);
  const [quanList, setQuanList] = useState([]);
  const [xaList, setXaList] = useState([]);
  const [diaChiParts, setDiaChiParts] = useState({
    tinh: "",
    quan: "",
    xa: "",
    soNha: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (openQR) {
      scannerRef.current = new Html5QrcodeScanner("qr-scanner", {
        fps: 10,
        qrbox: 250,
      });

      scannerRef.current.render(
        async (decodedText) => {
          try {
            console.log("📌 Raw QR Data:", decodedText);

            // Xử lý JSON & loại bỏ BOM nếu có
            const cleanedData = decodedText.replace(/\uFEFF/g, "").trim();
            const data = JSON.parse(cleanedData);
            console.log("✅ Dữ liệu JSON từ QR:", data);

            // Kiểm tra dữ liệu địa chỉ hợp lệ
            if (
              !data.diaChi?.tinh ||
              !data.diaChi?.quan ||
              !data.diaChi?.xa ||
              !data.diaChi?.soNha
            ) {
              console.warn("⚠️ Thiếu thông tin địa chỉ từ QR Code");
              return;
            }

            // Tìm `code` của tỉnh/thành phố
            const foundTinh = tinhList.find((t) => t.name === data.diaChi.tinh);
            if (!foundTinh) {
              console.warn("⚠️ Không tìm thấy tỉnh:", data.diaChi.tinh);
              return;
            }

            const tinhCode = foundTinh.code;

            // Gọi API lấy danh sách quận/huyện
            let quanList = [];
            try {
              const quanResponse = await axios.get(
                `https://provinces.open-api.vn/api/p/${tinhCode}?depth=2`
              );
              quanList = quanResponse.data.districts || [];
            } catch (error) {
              console.error("❌ Lỗi khi lấy danh sách quận/huyện:", error);
              return;
            }

            // Tìm `code` của quận/huyện
            const foundQuan = quanList.find((q) => q.name === data.diaChi.quan);
            if (!foundQuan) {
              console.warn("⚠️ Không tìm thấy quận/huyện:", data.diaChi.quan);
              return;
            }

            const quanCode = foundQuan.code;

            // Gọi API lấy danh sách xã/phường
            let xaList = [];
            try {
              const xaResponse = await axios.get(
                `https://provinces.open-api.vn/api/d/${quanCode}?depth=2`
              );
              xaList = xaResponse.data.wards || [];
            } catch (error) {
              console.error("❌ Lỗi khi lấy danh sách xã/phường:", error);
              return;
            }

            // Tìm `code` của xã/phường
            const foundXa = xaList.find((x) => x.name === data.diaChi.xa);
            if (!foundXa) {
              console.warn("⚠️ Không tìm thấy xã/phường:", data.diaChi.xa);
              return;
            }

            const xaCode = foundXa.code;

            // Cập nhật state nhân viên
            setNhanVien((prev) => ({
              ...prev,
              tenNhanVien: data.tenNhanVien || prev.tenNhanVien,
              cccd: data.cccd || prev.cccd,
              ngaySinh: data.ngaySinh || prev.ngaySinh,
              gioiTinh: data.gioiTinh || prev.gioiTinh,
              diaChi: {
                tinh: data.diaChi.tinh || prev.diaChi.tinh,
                quan: data.diaChi.quan || prev.diaChi.quan,
                xa: data.diaChi.xa || prev.diaChi.xa,
                soNha: data.diaChi.soNha || prev.diaChi.soNha,
              },
            }));

            // Cập nhật danh sách dropdown trước khi thiết lập xã
            setQuanList(quanList);
            setXaList(xaList);

            // Cập nhật `diaChiParts`
            setDiaChiParts({
              tinh: tinhCode,
              quan: quanCode,
              xa: xaCode,
              soNha: data.diaChi.soNha || "",
            });

            setOpenQR(false);
          } catch (error) {
            console.error("❌ Lỗi khi phân tích dữ liệu từ QR:", error);
          }
        },
        (errorMessage) => {
          console.log("⚠️ Không thể quét QR:", errorMessage);
        }
      );
    }

    return () => {
      scannerRef.current?.clear();
    };
  }, [openQR, tinhList]);

  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [cccdError, setCccdError] = useState("");
  const [tenError, setTenError] = useState("");
  const [ngaySinhError, setNgaySinhError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sdtError, setSdtError] = useState("");

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/nhanvien");
  };

  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/?depth=1")
      .then((response) => setTinhList(response.data))
      .catch(() =>
        enqueueSnackbar("Lỗi tải danh sách tỉnh/thành!", { variant: "error" })
      );
  }, []);

  useEffect(() => {
    if (diaChiParts.tinh) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${diaChiParts.tinh}?depth=2`)
        .then((response) => {
          setQuanList(response.data.districts || []);
          setDiaChiParts((prev) => ({ ...prev, quan: "", xa: "" })); // Reset quận & xã khi đổi tỉnh
        })
        .catch(() =>
          enqueueSnackbar("Lỗi tải danh sách quận/huyện!", { variant: "error" })
        );
    }
  }, [diaChiParts.tinh]);

  useEffect(() => {
    if (diaChiParts.quan) {
      axios
        .get(`https://provinces.open-api.vn/api/d/${diaChiParts.quan}?depth=2`)
        .then((response) => {
          setXaList(response.data.wards || []);
          setDiaChiParts((prev) => ({ ...prev, xa: "" })); // Reset xã khi đổi quận
        })
        .catch(() =>
          enqueueSnackbar("Lỗi tải danh sách xã/phường!", { variant: "error" })
        );
    }
  }, [diaChiParts.quan]);

  // Cập nhật địa chỉ khi thay đổi
  const handleDiaChiChange = (event) => {
    const { name, value } = event.target;
    setDiaChiParts((prev) => ({ ...prev, [name]: value }));
  };

  // Gộp địa chỉ trước khi gửi lên API
  const getDiaChiFull = () => {
    const tinh = tinhList.find((t) => t.code === diaChiParts.tinh)?.name || "";
    const quan = quanList.find((q) => q.code === diaChiParts.quan)?.name || "";
    const xa = xaList.find((x) => x.code === diaChiParts.xa)?.name || "";
    return `${
      diaChiParts.soNha ? diaChiParts.soNha + ", " : ""
    }${xa}, ${quan}, ${tinh}`;
  };

  const handleFileChange = (e) => {
    setNhanVien({ ...nhanVien, anh: e.target.files[0] });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Tính tuổi từ ngày sinh nhập vào
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const isUnderage =
      age < 18 ||
      (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

    if (name === "ngaySinh" && isUnderage) {
      setErrors({ ...errors, ngaySinh: "Nhân viên phải đủ 18 tuổi trở lên!" });
      enqueueSnackbar("Nhân viên phải đủ 18 tuổi trở lên!", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        autoHideDuration: 3000,
      });
    } else {
      setErrors({ ...errors, ngaySinh: "" });
    }

    setNhanVien({ ...nhanVien, [name]: value });
  };

  // Submit

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullDiaChi = getDiaChiFull();
    setLoading(true);
    handleCloseConfirm(); // Đóng hộp thoại xác nhận
    setError(null);

    const cccdRegex = /^[0-9]{12}$/; // CCCD phải có 12 chữ số

    if (!nhanVien.tenNhanVien.trim()) {
      setTenError("Vui lòng nhập tên nhân viên!");
      enqueueSnackbar("Vui lòng nhập tên nhân viên!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }
    setTenError("");

    // Kiểm tra ngày sinh rỗng
    if (!nhanVien.ngaySinh) {
      setNgaySinhError("Vui lòng nhập ngày sinh!");
      enqueueSnackbar("Vui lòng nhập ngày sinh!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    const today = new Date();
    const birthDate = new Date(nhanVien.ngaySinh);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (
      age < 18 ||
      (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
    ) {
      setNgaySinhError("Nhân viên phải đủ 18 tuổi trở lên!");
      enqueueSnackbar("Nhân viên phải đủ 18 tuổi trở lên!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    // Nếu hợp lệ, xóa lỗi
    setNgaySinhError("");

    if (!nhanVien.cccd.trim()) {
      setCccdError("Vui lòng nhập số CCCD!");
      enqueueSnackbar("Vui lòng nhập số CCCD!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    if (!cccdRegex.test(nhanVien.cccd)) {
      setCccdError("Số CCCD không hợp lệ! Vui lòng nhập 12 chữ số.");
      enqueueSnackbar("Số CCCD không hợp lệ! Vui lòng nhập 12 chữ số.", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    try {
      // 🛠 Kiểm tra trùng số CCCD
      const { data } = await axios.get(
        "http://localhost:8080/api/nhanvien/check-cccd",
        {
          params: { cccd: nhanVien.cccd },
        }
      );

      if (data.exists) {
        setCccdError("Số CCCD đã tồn tại!");
        enqueueSnackbar("Số CCCD đã tồn tại!", {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      enqueueSnackbar("Lỗi kiểm tra số CCCD!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    // Xóa lỗi nếu hợp lệ
    setCccdError("");

    if (!nhanVien.email.trim()) {
      setEmailError("Vui lòng nhập email!");
      enqueueSnackbar("Vui lòng nhập email!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(nhanVien.email)) {
      setEmailError("Email không hợp lệ!");
      enqueueSnackbar("Email không hợp lệ!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    setEmailError("");

    // Kiểm tra số điện thoại rỗng
    if (!nhanVien.sdt.trim()) {
      setSdtError("Vui lòng nhập số điện thoại!");
      enqueueSnackbar("Vui lòng nhập số điện thoại!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    // Kiểm tra định dạng số điện thoại (Việt Nam: 10 số, bắt đầu từ 03, 05, 07, 08, 09)
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    if (!phoneRegex.test(nhanVien.sdt)) {
      setSdtError("Số điện thoại không hợp lệ!");
      enqueueSnackbar("Số điện thoại không hợp lệ!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    // Xóa lỗi nếu hợp lệ
    setSdtError("");

    try {
      // Kiểm tra số điện thoại đã tồn tại
      const { data } = await axios.get(
        "http://localhost:8080/api/nhanvien/check-phone",
        {
          params: { sdt: nhanVien.sdt },
        }
      );

      if (data.exists) {
        setSdtError("Số điện thoại đã tồn tại!");
        enqueueSnackbar("Số điện thoại đã tồn tại!", {
          variant: "error",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      enqueueSnackbar("Lỗi kiểm tra số điện thoại!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
      setLoading(false);
      return;
    }

    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append("ma", nhanVien.ma);
    formData.append("tenNhanVien", nhanVien.tenNhanVien);
    formData.append("cccd", nhanVien.cccd);
    formData.append("email", nhanVien.email);
    formData.append("sdt", nhanVien.sdt);
    formData.append("ngaySinh", nhanVien.ngaySinh);
    formData.append("gioiTinh", nhanVien.gioiTinh);
    formData.append("trangThai", nhanVien.trangThai);
    formData.append(
      "tinhThanh",
      tinhList.find((t) => t.code === diaChiParts.tinh)?.name || ""
    );
    formData.append(
      "quanHuyen",
      quanList.find((q) => q.code === diaChiParts.quan)?.name || ""
    );
    formData.append(
      "xaPhuong",
      xaList.find((x) => x.code === diaChiParts.xa)?.name || ""
    );
    formData.append("soNha", diaChiParts.soNha);
    // formData.append("diaChi", fullDiaChi);
    formData.append("nguoiTao", "admin");
    formData.append("idTaiKhoan", 3);

    if (nhanVien.anh) {
      formData.append("anh", nhanVien.anh);
    }

    try {
      await axios.post(
        "http://localhost:8080/api/nhanvien/them-moi",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      enqueueSnackbar("Thêm nhân viên thành công!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

      // Reset form sau khi thêm thành công
      setNhanVien({
        ma: "",
        tenNhanVien: "",
        cccd: "",
        email: "",
        sdt: "",
        ngaySinh: "",
        gioiTinh: "Nam",
        trangThai: "Hoạt động",
        anh: null,
        diaChi: "",
      });

      setDiaChiParts({ tinh: "", quan: "", xa: "", soNha: "" });
      setQuanList([]);
      setXaList([]);

      navigate("/nhanvien");
    } catch (error) {
      enqueueSnackbar("Lỗi khi thêm nhân viên!", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleBack} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Quản Lý Nhân Viên{" "}
          <Box component="span" sx={{ color: "#b0b0b0", fontWeight: "bold" }}>
            / Thêm Mới Nhân Viên
          </Box>
        </Typography>
      </Box>

      {error && (
        <Typography
          variant="body1"
          sx={{ color: "red", marginBottom: "20px", textAlign: "center" }}
        >
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              padding: 3,
              borderRadius: 2,
              textAlign: "center",
              boxShadow: 3,
              position: "relative",
              cursor: "pointer",
              height: "100%",
            }}
            onClick={() => document.getElementById("upload-photo").click()}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", marginBottom: "20px" }}
            >
              Ảnh Đại Diện
            </Typography>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={
                  nhanVien.anh
                    ? URL.createObjectURL(nhanVien.anh)
                    : "https://via.placeholder.com/150"
                }
                sx={{ width: 150, height: 150 }}
              />
              <input
                type="file"
                accept="image/*"
                id="upload-photo"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {!nhanVien.anh && (
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: "bold",
                    boxShadow: 2,
                  }}
                >
                  + Upload
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              height: "100%",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: 3 }}
              align="center"
            >
              Thông tin nhân viên
            </Typography>

            {/* Dialog mở modal quét QR */}
            {/* QR Scan Button */}
            {/* QR Scan Button */}
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<QrCodeIcon />}
                onClick={() => setOpenQR(true)}
              >
                Quét QR
              </Button>
            </Box>

            {/* Modal Quét QR */}
            {openQR && (
              <Box
                sx={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1300,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    padding: 3,
                    borderRadius: 2,
                    width: "90%",
                    maxWidth: "300px",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" mb={2}>
                    Quét mã QR
                  </Typography>
                  <Box
                    id="qr-scanner"
                    sx={{ width: "300px", height: "300px", marginBottom: 2 }}
                  ></Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenQR(false)}
                  >
                    Đóng
                  </Button>
                </Box>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    <span style={{ color: "red" }}>*</span> Tên Nhân Viên
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="tenNhanVien"
                    value={nhanVien.tenNhanVien}
                    onChange={handleInputChange}
                    error={!!tenError} // Hiển thị lỗi nếu có
                    helperText={tenError} // Thông báo lỗi ngay dưới ô nhập
                    sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    <span style={{ color: "red" }}>*</span> Ngày Sinh
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    name="ngaySinh"
                    value={nhanVien.ngaySinh}
                    onChange={handleInputChange}
                    error={!!ngaySinhError} // Nếu có lỗi, hiển thị trạng thái lỗi
                    helperText={ngaySinhError} // Hiển thị lỗi ngay dưới ô nhập
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        // color: "text.secondary",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    <span style={{ color: "red" }}>*</span> CCCD
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="cccd"
                    value={nhanVien.cccd}
                    onChange={handleInputChange}
                    error={!!cccdError} // Hiển thị lỗi nếu có
                    helperText={cccdError} // Thông báo lỗi ngay dưới ô nhập
                    sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    <span style={{ color: "red" }}>*</span> Email
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="email"
                    value={nhanVien.email}
                    onChange={handleInputChange}
                    error={!!emailError} // Hiển thị lỗi nếu có
                    helperText={emailError} // Thông báo lỗi ngay dưới ô nhập
                    sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    <span style={{ color: "red" }}>*</span> Giới Tính
                  </Typography>
                  <FormControl required>
                    <RadioGroup
                      row
                      name="gioiTinh"
                      value={nhanVien.gioiTinh}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel
                        value="Nam"
                        control={<Radio />}
                        label="Nam"
                        sx={{ color: "text.secondary" }}
                      />
                      <FormControlLabel
                        value="Nữ"
                        control={<Radio />}
                        label="Nữ"
                        sx={{ color: "text.secondary" }}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    <span style={{ color: "red" }}>*</span> Số Điện Thoại
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="sdt"
                    value={nhanVien.sdt}
                    onChange={handleInputChange}
                    error={!!sdtError} // Nếu có lỗi, `error` sẽ là `true`
                    helperText={sdtError} // Hiển thị lỗi ngay dưới ô nhập
                    sx={{ "& .MuiOutlinedInput-root": { height: "40px" } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        select
                        label="*Tỉnh/Thành phố"
                        name="tinh"
                        value={diaChiParts?.tinh || ""}
                        onChange={handleDiaChiChange}
                        fullWidth
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
                        label=" *Quận/Huyện"
                        name="quan"
                        value={diaChiParts?.quan || ""}
                        onChange={handleDiaChiChange}
                        fullWidth
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
                        label="*Xã/Phường"
                        name="xa"
                        value={diaChiParts?.xa || ""}
                        onChange={handleDiaChiChange}
                        fullWidth
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
                        label="*Số nhà/Ngõ/Đường"
                        name="soNha"
                        value={diaChiParts?.soNha || ""}
                        onChange={handleDiaChiChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenConfirm}
                      disabled={loading}
                    >
                      {loading ? "Đang thêm..." : "Thêm"}
                    </Button>
                  </Box>

                  {/* Hộp thoại xác nhận */}
                  <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                    <DialogTitle>
                      <Box display="flex" justifyContent="center">
                        {/* Hình tròn có viền cam, nền trắng */}
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
                        Xác nhận thêm mới nhân viên?
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
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
      {/* Snackbar thông báo thành công */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TaoMoiNhanVien;

import React, { useRef, useEffect, useState } from "react";
import axios from "axios"; // Import axios
import {
  Box, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography, Button, Chip, Paper, Container, CircularProgress, Grid, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Stack, Snackbar, Alert

} from "@mui/material";
import { Delete, History, Close, ArrowBack, ArrowForward } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";


const HoaDonChiTiet = () => {
  //Khai báo useState
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); //Lấy id khi truyền đến trang này bằng useParams
  const [hoaDon, setHoaDon] = useState({}); //Biến lưu dữ liệu hóa đơn
  const [loading, setLoading] = useState(true);//Biến lưu giá trị loading dữ liệu
  const [error, setError] = useState(false);//Biến báo lỗi
  const [imageIndexes, setImageIndexes] = useState({});//Biến lưu giá trị key(idSPCT từ HDCT) cùng index hình ảnh hiện tại 
  const [openLyDo, setOpenLyDo] = useState(false);  // Biến lưu giá trị mở modal nhập lý do khi thực hiện chức năng hủy hóa đơn
  const [openConfirm, setOpenConfirm] = useState(false); // Mở modal xác nhận
  const [open, setOpen] = useState(false);//Biến lưu giá trị mở modal xem lịch sử hóa đơn
  const [openGhiChuPrevious, setOpenGhiChuPrevious] = useState(false);  // Biến lưu giá trị mở modal nhập lý do khi thực hiện chức năng hủy hóa đơn
  const [openConfirmPrevious, setOpenConfirmPrevious] = useState(false); // Mở modal xác nhận
  const [openGhiChuNext, setOpenGhiChuNext] = useState(false);
  const [openConfirmNext, setOpenConfirmNext] = useState(false); // Mở modal xác nhận
  const [ghiChuTrangThai, setGhiChuTrangThai] = useState("");

  //Thông báo thành công
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#1976D2", // Màu nền xanh đẹp hơn
        color: "white", // Chữ trắng nổi bật
        fontSize: "14px", // Nhỏ hơn một chút
        fontWeight: "500",
        borderRadius: "8px",
      }
    });
  };
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: {
        backgroundColor: "#D32F2F", // Màu đỏ cảnh báo
        color: "white", // Chữ trắng nổi bật
        fontSize: "14px", // Nhỏ hơn một chút
        fontWeight: "500",
        borderRadius: "8px",
      }
    });
  };

  //Hàm mở modal nhập lý do hủy hóa đơn khi thực hiện chức năng hủy hóa đơn
  const handleOpenLyDo = () => {
    setOpenLyDo(true);
  };

  //Hàm kiểm tra check nhạp lý do chưa để mở confirm khi thực hiện chức năng hủy hóa đơn
  const handleNextConfirm = () => {
    if (!ghiChuTrangThai.trim()) { //Check nếu nhập lý do hủy hóa đơn
      setError(true);
    } else {
      setError(false);
      setOpenLyDo(false);
      setOpenConfirm(true);
    }
  };
  const handleNextConfirmPrevious = () => {
    if (!ghiChuTrangThai.trim()) { //Check nếu nhập lý do hủy hóa đơn
      setError(true);
    } else {
      setError(false);
      setOpenGhiChuPrevious(false);
      setOpenConfirmPrevious(true);
    }

  };
  const handleNextConfirmNext = () => {
    setOpenGhiChuNext(false);
    setOpenConfirmNext(true);
  };

  //Hàm thực hiện chức năng hủy hóa đơn gọi api
  const handleHuyHoaDon = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/hoa-don/cap-nhat-trang-thai-hoa-don/${hoaDon.id}`, {
        lyDo: ghiChuTrangThai,
        trangThai: "Đã hủy",
        hanhDong: "Hủy"
      });
      if (response.data) {
        setOpenConfirm(false);
        setGhiChuTrangThai("");
        fetchHoaDon();
        showSuccessToast("Hủy hóa đơn thành công")
      } else {
        showErrorToast("Hủy hóa đơn đã có lỗi xảy ra");
      }
    } catch (error) {
      showErrorToast("Hủy hóa đơn đã có lỗi xảy ra");
      console.error(error);
    }
  };


  //Hàm trả về CSS khung theo trạng thái
  const getStatusStyles = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return { backgroundColor: "#FFF9C4", color: "#9E9D24" }; // Vàng nhạt
      case "Đã xác nhận":
        return { backgroundColor: "#C8E6C9", color: "#388E3C" }; // Xanh lá nhạt
      case "Chờ giao hàng":
        return { backgroundColor: "#FFE0B2", color: "#E65100" }; // Cam nhạt
      case "Đang vận chuyển":
        return { backgroundColor: "#BBDEFB", color: "#1976D2" }; // Xanh dương nhạt
      case "Đã giao hàng":
        return { backgroundColor: "#DCEDC8", color: "#689F38" }; // Xanh lá nhạt hơn
      case "Đã thanh toán":
        return { backgroundColor: "#E1BEE7", color: "#8E24AA" }; // Tím nhạt
      case "Chờ thanh toán":
        return { backgroundColor: "#FFCCBC", color: "#D84315" }; // Đỏ cam nhạt
      case "Hoàn thành":
        return { backgroundColor: "#CFD8DC", color: "#455A64" }; // Xám nhạt
      case "Đã hủy":
        return { backgroundColor: "#FFCDD2", color: "#C62828" }; // Đỏ nhạt
      default:
        return { backgroundColor: "#E3F2FD", color: "#000" }; // Màu mặc định (xanh siêu nhẹ)
    }
  };

  //List trạng thái hóa đơn
  const steps = hoaDon.loaiHoaDon === "Tại quầy"
    ? ["Chờ thanh toán", "Đã thanh toán", "Hoàn thành"]
    : [
      "Chờ xác nhận", "Đã xác nhận", "Chờ giao hàng", "Đang vận chuyển",
      "Đã giao hàng", "Chờ thanh toán", "Đã thanh toán", "Hoàn thành"
    ];


  //Hàm gọi api lấy hóa đơn
  const fetchHoaDon = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/hoa-don/${id}`);
      setHoaDon(response.data); // Dữ liệu được lấy từ response.data
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  //Lấy dữ liệu hóa đơn
  useEffect(() => {
    fetchHoaDon();
  }, [id]);


  //Hàm load ảnh
  useEffect(() => {
    if (!hoaDon || !hoaDon.listDanhSachSanPham) return; // Kiểm tra nếu hoaDon chưa load hoặc hoaDon.listDanhSachSanPham rỗng
    const interval = setInterval(() => {
      setImageIndexes((prevIndexes) => {
        const newIndexes = { ...prevIndexes };
        hoaDon.listDanhSachSanPham.forEach((product) => {
          if (product.hinhAnh.length > 1) {
            newIndexes[product.id] = (prevIndexes[product.id] + 1) % product.hinhAnh.length || 0;
          }
        });
        return newIndexes;
      });
    }, 3000); // Chuyển ảnh sau mỗi 3 giây
    return () => clearInterval(interval);
  }, [hoaDon?.listDanhSachSanPham]);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography ml={2}>Đang tải dữ liệu...</Typography>
      </Box>
    );
  }

  const currentStep = hoaDon ? steps.indexOf(hoaDon.trangThai) : -1; //Biến lưu index trạng thái hiện tại của hóa đơn trong steps
  const isCanceled = hoaDon?.trangThai === "Đã hủy";//Biến true false có phải hóa đơn trạng thái Hủy không
  const isComplete = hoaDon?.trangThai === "Hoàn thành";//Biến true false có phải hóa đơn trạng thái Hoàn Thành không

  const handleWheel = (event) => {
    if (scrollRef.current) {
      event.preventDefault();
      scrollRef.current.scrollLeft += event.deltaY;
    }
  };

  //Hàm trờ lại trạng thái trước
  const handlePrevious = async () => {
    if (currentStep === 0) return;

    try {
      // Lấy trạng thái trước đó
      const trangThaiCanDoi = steps[currentStep - 1];
      // Gọi API để thay đổi trạng thái
      const response = await axios.post(
        `http://localhost:8080/hoa-don/cap-nhat-trang-thai-hoa-don/${hoaDon.id}`, { trangThai: trangThaiCanDoi, hanhDong: "Hoàn tác", lyDo: ghiChuTrangThai }
      );
      if (response.data) {
        setGhiChuTrangThai("");
        setOpenConfirmPrevious(false);
        fetchHoaDon();
        showSuccessToast("Hoàn tác trạng thái hóa đơn thành công");
      } else {
        showErrorToast("Hoàn tác thất bại, thử lại!");
      }
    } catch (error) {
      showErrorToast("Lỗi khi hoàn tác hóa đơn!");
      console.error(error.response || error.message);
    }
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) return;

    try {
      // Lấy trạng thái trước đó
      const trangThaiCanDoi = steps[currentStep + 1];
      // Gọi API để thay đổi trạng thái
      const response = await axios.post(
        `http://localhost:8080/hoa-don/cap-nhat-trang-thai-hoa-don/${hoaDon.id}`, { trangThai: trangThaiCanDoi, hanhDong: trangThaiCanDoi === "Hoàn thành" ? "Hoàn thành" : "Cập nhật", lyDo: ghiChuTrangThai }
      );
      if (response.data) {
        setGhiChuTrangThai("");
        setOpenConfirmNext(false);
        fetchHoaDon();
        showSuccessToast("Cập nhật trạng thái hóa đơn thành công");
      } else {
        showErrorToast("Cập nhật thất bại, thử lại!");
      }
      console.log(response.data);  // In kết quả trả về
    } catch (error) {
      showErrorToast("Lỗi khi cập nhật hóa đơn!");
      console.error(error.response || error.message);
    }
  };



  return (
    <Container>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate(`/hoaDon`)} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Quản lý đơn hàng{" "}
          <Box component="span" sx={{ color: "#b0b0b0", fontWeight: "bold" }} >
            / Chi tiết hóa đơn {hoaDon.ma}
          </Box>
        </Typography>
      </Box>
      {/* Trạng thái hóa đơn */}
      <Box sx={{ textAlign: "center", width: "100%", mb: 3, display: "flex", justifyContent: "center" }}>
        {isCanceled ? (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "error.dark",
              bgcolor: "#FFEBEE",
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(211, 47, 47, 0.2)",
              display: "inline-block",
              maxWidth: "90%",
            }}
          >
            🚫 Hóa đơn này đã bị hủy!
          </Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", overflow: "hidden" }}>
              <Box
                ref={scrollRef}
                onWheel={handleWheel}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  scrollbarWidth: "thin",
                  "&::-webkit-scrollbar": { height: 4 },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "grey.400", borderRadius: 2 },
                  width: "100%",
                  p: 1,
                  whiteSpace: "nowrap",
                  alignItems: "center",
                }}
              >
                {steps.map((step, index) => {
                  const isPast = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isSameStatus = step === steps[currentStep]; // Kiểm tra trùng trạng thái                
                  return (
                    <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                      <Chip
                        label={step}
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontWeight: isCurrent ? 700 : 500,
                          bgcolor: isSameStatus ? "#3498EA" : isPast ? "success.main" : isCurrent ? "warning.main" : "grey.300",
                          color: "white",
                          transition: "0.3s",
                          boxShadow: isCurrent ? "0px 2px 8px rgba(78, 172, 235, 0.16)" : "none",
                        }}
                      />
                      {index < steps.length - 1 && (
                        <Box
                          sx={{
                            width: 30,
                            height: 3,
                            bgcolor: isPast ? "success.light" : "grey.400",
                            mx: 1,
                            transition: "0.3s",
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </>)}
      </Box>
      <Box display="flex" gap={2} justifyContent="center" mb={3}>
        <Stack direction="row" spacing={2}>
          {/* Nút Previous */}
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{
              borderRadius: 3,
              px: 3,
              boxShadow: 2,
              background: "#2e7d32",
              "&:hover": { background: "#2e7d32" },
            }}
            onClick={() => setOpenGhiChuPrevious(true)}
            disabled={currentStep === 0 || isCanceled || isComplete} // Vô hiệu hóa khi ở trạng thái đầu tiên hoặc khi hóa đơn đã hủy hoặc hoàn thành
          >
            Previous
          </Button>
          <Dialog open={openGhiChuPrevious} onClose={() => setOpenGhiChuPrevious(false)}>
            <DialogTitle>Nhập lý do hoàn tác trạng thái</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="* Nhập lý do hoàn tác trạng thái:"
                variant="outlined"
                value={ghiChuTrangThai}
                onChange={(e) => { setGhiChuTrangThai(e.target.value); setError(false) }}
                error={error} // Hiển thị lỗi nếu có
                helperText={error ? "Bạn chưa nhập lý do!" : ""} // Nội dung lỗi
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenGhiChuPrevious(false)} color="primary">
                Hủy bỏ
              </Button>
              <Button onClick={handleNextConfirmPrevious} color="warning" variant="contained">
                Tiếp tục
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openConfirmPrevious} onClose={() => setOpenConfirmPrevious(false)}>
            <DialogTitle>Xác nhận hoàn tác trạng thái hóa đơn</DialogTitle>
            <DialogContent>
              <p><b>Lý do hoàn tác trạng thái:</b> {ghiChuTrangThai}</p>
              <p>Bạn có chắc chắn muốn hoàn tác trạng thái hóa đơn này không?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmPrevious(false)} color="primary">
                Quay lại
              </Button>
              <Button onClick={handlePrevious} color="warning" variant="contained">
                Xác nhận hoàn tác
              </Button>
            </DialogActions>
          </Dialog>

          {/* Nút Next */}
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 3,
              px: 3,
              boxShadow: 2,
              background: "#3498EA",
              "&:hover": { background: "#3498EA" },
            }}
            onClick={() => setOpenGhiChuNext(true)}
            disabled={isCanceled || isComplete ||
              (hoaDon.trangThai === "Chờ thanh toán" &&  // Nếu trạng thái là "Chờ thanh toán"
                (!hoaDon.listThanhToanHoaDon ||              // Nếu danh sách lịch sử thanh toán không tồn tại
                  hoaDon.listThanhToanHoaDon.length === 0 ||  // Hoặc danh sách rỗng
                  hoaDon.listThanhToanHoaDon.reduce((sum, item) => sum + item.soTien, 0) < hoaDon.tongTienHang)) ||
              (hoaDon.trangThai === "Đã xác nhận" &&  // Nếu trạng thái là "Đã xác nhận"
                (!hoaDon.listDanhSachSanPham || hoaDon.listDanhSachSanPham.length === 0)) ||  // Nếu danh sách sản phẩm rỗng thì vô hiệu hóa
              (hoaDon.trangThai === "Chờ thanh toán" &&  // Nếu trạng thái là "Đã xác nhận"
                (!hoaDon.listDanhSachSanPham || hoaDon.listDanhSachSanPham.length === 0))
            }
          >
            Next
          </Button>
          <Dialog open={openGhiChuNext} onClose={() => setOpenGhiChuNext(false)}>
            <DialogTitle>Nhập lý do thay đổi trạng thái</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Nhập lý do cập nhật trạng thái trạng thái(Có thể nhập hoặc không):"
                variant="outlined"
                placeholder="Có thể nhập hoặc để trống"
                value={ghiChuTrangThai}
                onChange={(e) => { setGhiChuTrangThai(e.target.value); setError(false) }}
              // error={error} // Hiển thị lỗi nếu có
              // helperText={error ? "Bạn chưa nhập lý do!" : ""} // Nội dung lỗi
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenGhiChuNext(false)} color="primary">
                Hủy bỏ
              </Button>
              <Button onClick={handleNextConfirmNext} color="primary" variant="contained">
                Tiếp tục
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openConfirmNext} onClose={() => setOpenConfirmNext(false)}>
            <DialogTitle>Xác nhận hoàn tác trạng thái hóa đơn</DialogTitle>
            <DialogContent>
              <p><b>Lý do hoàn tác trạng thái:</b> {ghiChuTrangThai}</p>
              <p>Bạn có chắc chắn muốn hoàn tác trạng thái hóa đơn này không?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenConfirmNext(false)} color="primary">
                Quay lại
              </Button>
              <Button onClick={handleNext} color="primary" variant="contained">
                Xác nhận cập nhật
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>

        <Button disabled={isCanceled || isComplete} variant="outlined" color="error" startIcon={<Delete />} sx={{ borderRadius: 3, px: 3 }} onClick={() => handleOpenLyDo()}>
          Hủy hóa đơn
        </Button>
        <Dialog open={openLyDo} onClose={() => setOpenLyDo(false)}>
          <DialogTitle>Nhập lý do hủy hóa đơn</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Lý do hủy"
              variant="outlined"
              value={ghiChuTrangThai}
              onChange={(e) => { setGhiChuTrangThai(e.target.value); setError(false) }}
              error={error} // Hiển thị lỗi nếu có
              helperText={error ? "Bạn chưa nhập lý do!" : ""} // Nội dung lỗi
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLyDo(false)} color="primary">
              Hủy bỏ
            </Button>
            <Button onClick={handleNextConfirm} color="error" variant="contained">
              Tiếp tục
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Xác nhận hủy hóa đơn</DialogTitle>
          <DialogContent>
            <p><b>Lý do hủy:</b> {ghiChuTrangThai}</p>
            <p>Bạn có chắc chắn muốn hủy hóa đơn này không?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)} color="primary">
              Quay lại
            </Button>
            <Button onClick={handleHuyHoaDon} color="error" variant="contained">
              Xác nhận hủy
            </Button>
          </DialogActions>
        </Dialog>
        <Button variant="outlined" color="secondary" startIcon={<History />} sx={{ borderRadius: 3, px: 3 }} onClick={()=>setOpen(true)} >
          Lịch sử hóa đơn
        </Button>
        <Dialog open={open} onClose={()=>setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Lịch sử hóa đơn
            <IconButton onClick={()=>setOpen(false)}sx={{ position: "absolute", right: 16, top: 16 }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            {/* Table hiển thị lịch sử hóa đơn */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell><b>#</b></TableCell>
                    <TableCell><b>Hành động</b></TableCell>
                    <TableCell><b>Thời gian</b></TableCell>
                    <TableCell><b>Mô tả</b></TableCell>
                    <TableCell><b>Nhân viên xác nhận</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hoaDon.listLichSuHoaDon.map((lshd, index) => (
                    <TableRow key={index}
                      sx={{
                        backgroundColor:
                          lshd.hanhDong === "Hoàn tác" ? "#E8F5E9" :  // Xanh nhạt
                            lshd.hanhDong === "Hủy" ? "#FFEBEE" :       // Đỏ nhạt
                              lshd.hanhDong === "Hoàn thành" ? "#ECEFF1" : // Xám nhạt
                                "white", // Mặc định là màu trắng
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell >{lshd.hanhDong}</TableCell>
                      <TableCell>{new Date(lshd.ngay).toLocaleString("vi-VN")}</TableCell>
                      <TableCell>{lshd.moTa}</TableCell>
                      <TableCell>{lshd.nguoiTao}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>

          {/* Nút đóng dialog */}
          <DialogActions>
            <Button onClick={()=>setOpen(false)} color="primary" variant="contained">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Thông tin hóa đơn */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2}>
          {/* Cột 1: Thông tin hóa đơn */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#1976D2" }}>
              Thông tin hóa đơn {hoaDon.ma}
            </Typography>

            <Typography>
              <b>Trạng thái:</b>{" "}
              <Box
                component="span"
                sx={{
                  ...getStatusStyles(hoaDon.trangThai),
                  borderRadius: "8px",
                  padding: "4px 10px",
                  fontWeight: "normal",
                  display: "inline-block",
                  ml: 1,
                }}
              >
                {hoaDon.trangThai}
              </Box>
            </Typography>

            <Typography sx={{ marginTop: "5px" }}>
              <b>Loại hóa đơn:</b>{" "}
              <Box sx={{
                backgroundColor: hoaDon.loaiHoaDon === "Online" ? "#E3F2FD" : "#FFEBEE",
                color: hoaDon.loaiHoaDon === "Online" ? "#1976D2" : "#D32F2F",
                borderRadius: "8px",
                padding: "4px 10px",
                fontWeight: "normal",
                display: "inline-block",
                ml: 1,
              }}>
                {hoaDon.loaiHoaDon}
              </Box>
            </Typography>

            <Typography>
              <b>Ghi chú:</b> {hoaDon.ghiChu}
            </Typography>
          </Grid>

          {/* Cột 2: Thông tin nhận hàng */}
          {hoaDon.sdtNguoiNhanHang && (
            <Grid item xs={12} md={6}>
              <Typography variant="h7" gutterBottom sx={{ fontWeight: "bold", color: "#E65100" }}>
                Thông tin nhận hàng
              </Typography>
              <Typography>
                <b>Tên người nhận:</b> {hoaDon.tenNguoiNhanHang}
              </Typography>
              <Typography>
                <b>SDT người nhận:</b> {hoaDon.sdtNguoiNhanHang}
              </Typography>
              <Typography>
                <b>Email người nhận:</b> {hoaDon.emailNguoiNhanHang}
              </Typography>
              <Typography>
                <b>Địa chỉ người nhận:</b> {hoaDon.diaChiNguoiNhanHang}
              </Typography>
            </Grid>
          )}

          {/* Dòng mới: Thông tin khách hàng */}
          <Grid item xs={12}>
            <Typography variant="h7" gutterBottom sx={{ fontWeight: "bold", color: "#388E3C", mt: 2 }}>
              Thông tin khách hàng
            </Typography>
            <Typography>
              {hoaDon.maKhachHang} - {hoaDon.tenKhachHang} - {hoaDon.sdtKhachHang}
            </Typography>
          </Grid>
        </Grid>
      </Paper>



      {/* Lịch sử thanh toán */}
      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Typography
          variant="h6"  // Giảm kích thước tiêu đề
          align="center"
          sx={{ fontWeight: "bold", p: 2, textTransform: "uppercase", fontSize: "1.2rem" }} // Giảm size chữ
        >
          Lịch sử thanh toán
        </Typography>
        <Table sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>#</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Phương Thức</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số Tiền</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Thời Gian</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Nhân Viên Xác Nhận</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Ghi Chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hoaDon.listThanhToanHoaDon.length > 0 ? (
              hoaDon.listThanhToanHoaDon.map((payment, index) => (
                <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{payment.phuongThuc}</TableCell>
                  <TableCell align="center">{payment.soTien.toLocaleString()} VND</TableCell>
                  <TableCell align="center">{new Date(payment.ngayTao).toLocaleString("vi-VN")}</TableCell>
                  <TableCell align="center">{payment.nhanVienXacNhan}</TableCell>
                  <TableCell align="center">{payment.ghiChu}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 2, fontStyle: "italic", color: "gray" }}>
                  Không có lịch sử thanh toán nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>



      <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", p: 2, fontSize: "1.2rem", textTransform: "uppercase" }}
        >
          Danh sách sản phẩm
        </Typography>
        <Table sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>#</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Hình ảnh</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Sản phẩm</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Đơn giá</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>Số tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hoaDon.listDanhSachSanPham.length > 0 ? (
              hoaDon.listDanhSachSanPham.map((product, index) => {
                const images = product.hinhAnh || [];
                const currentIndex = imageIndexes[product.id] ?? 0;
                return (
                  <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">
                      {images.length > 0 && (
                        <img
                          src={images[currentIndex]}
                          alt={`Ảnh ${currentIndex + 1}`}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            transition: "transform 0.3s ease-in-out",
                            boxShadow: "0px 0px 8px rgba(0,0,0,0.15)",
                          }}
                          onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{}}>{product.tenMauSize}</Typography>
                      <Typography sx={{ color: "gray", fontSize: "0.85rem" }}>{product.maSanPhamChiTiet}</Typography>
                    </TableCell>
                    <TableCell align="center">{product.donGia.toLocaleString()}₫</TableCell>
                    <TableCell align="center">{product.soLuong}</TableCell>
                    <TableCell align="center">{product.soTien.toLocaleString()}₫</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 2, fontStyle: "italic", color: "gray" }}>
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, borderRadius: 2 }}>
        {/* Tổng tiền hàng */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1" fontWeight={500}>Tổng tiền hàng:</Typography>
          <Typography variant="body1" fontWeight={500}>{hoaDon.tongTienHang.toLocaleString()} ₫</Typography>
        </Box>

        {/* Phí ship */}
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1" fontWeight={500}>Phí vận chuyển:</Typography>
          <Typography variant="body1" fontWeight={500}>{hoaDon.phiVanChuyen.toLocaleString()} đ</Typography>
        </Box>

        {/* Mã voucher */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body1" fontWeight={500}>Mã giảm giá:</Typography>
          <Typography variant="body1" fontWeight={500} color="error">
            {hoaDon.maVoucher}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tổng tiền thanh toán */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" color="primary">
            Tổng thanh toán:
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: "#D32F2F",
              // textShadow: "0px 0px 5px rgba(211, 47, 47, 0.5)",
            }}
          >
            {(hoaDon.tongTienHang + hoaDon.phiVanChuyen).toLocaleString()} VNĐ
          </Typography>
        </Box>
      </Box>
      <ToastContainer /> {/* Quan trọng để hiển thị toast */}
    </Container>


  );
};

export default HoaDonChiTiet;

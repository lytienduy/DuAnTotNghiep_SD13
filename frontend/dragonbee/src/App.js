import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, } from 'react-router-dom';
import Sidebar from './module/admin/components/SideBar';
import Header from './module/admin/components/Header';
import ThongKe from './module/admin/pages/ThongKe';
import PhieuGiamGia from './module/admin/pages/PhieuGiamGia';
import ThemPhieuGiamGia from './module/admin/pages/ThemPhieuGiamGia';
import DetailPhieuGiamGia from './module/admin/pages/DetailPhieuGiamGia';
import BanTaiQuay from './module/admin/pages/BanTaiQuay';
import HoaDon from './module/admin/pages/HoaDon';
import NhanVien from './module/admin/pages/NhanVien';
import TaoMoiNhanVien from './module/admin/pages/TaoMoiNhanVien';
import NhanVienEdit from './module/admin/pages/NhanVienEdit';
import { Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import KhachHang from './module/admin/pages/KhachHang';
import ThongTinKhachHang from './module/admin/pages/ThongTinKhachHang';
import SanPham from "./module/admin/pages/SanPham";
import ChatLieu from "./module/admin/pages/ChatLieu";
import MauSac from "./module/admin/pages/MauSac";
import PhongCach from "./module/admin/pages/PhongCach";
import Size from "./module/admin/pages/Size";
import KieuDang from "./module/admin/pages/KieuDang";
import KieuDaiQuan from "./module/admin/pages/KieuDaiQuan";
import XuatSu from "./module/admin/pages/XuatSu";
import DanhMuc from "./module/admin/pages/DanhMuc";
import ThuongHieu from "./module/admin/pages/ThuongHieu";
import SanPhamChiTiet from "./module/admin/pages/SanPhamChiTiet";
import AddProduct from "./module/admin/pages/AddProduct";
import AddChatLieu from "./module/admin/pages/AddChatLieu";
import HoaDonChiTiet from './module/admin/pages/HoaDonChiTiet';
import LoginPage from "./module/admin/pages/LoginPage";

const theme = createTheme({
  components: {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "white", // Nền trắng
          color: "green", // Chữ xanh lá
          border: "1px solid green",
        },
      },
    },
  },
});


const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState); // Đảo trạng thái của sidebar
  };
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar isSidebarOpen={isSidebarOpen} />

            <Box sx={{ flexGrow: 1, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
              {/* Header */}
              <Header toggleSidebar={toggleSidebar} />

              {/* Routing */}
              <Box sx={{ padding: 3, backgroundColor: '#f3f3f3', height: '100%' }}>
                <Routes>
                  <Route path="/" element={<NavigateToThongKe />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/thongKe" element={<ThongKe />} />
                  <Route path="/banTaiQuay" element={<BanTaiQuay />} />
                  <Route path="/hoaDon" element={<HoaDon />} />
                  <Route path="/hoaDon/:id" element={<HoaDonChiTiet />} />
                  <Route path='/phieu-giam-gia' element={<PhieuGiamGia />} />
                  <Route path="/phieu-giam-gia/them-moi" element={<ThemPhieuGiamGia />} />
                  <Route path="/phieu-giam-gia/chinh-sua/:ma" element={<DetailPhieuGiamGia />} />
                  <Route path="/nhanvien" element={<NhanVien />} />
                  <Route path="/nhanvien/tao-moi" element={<TaoMoiNhanVien />} />
                  <Route path="/nhanvien/chinh-sua/:id" element={<NhanVienEdit />} />
                  <Route path="/khachHang" element={<KhachHang />} />
                  <Route path="/khachHang/detail/:id" element={<ThongTinKhachHang />} />
                  <Route path="/khachHang/add/" element={<ThongTinKhachHang />} />

                  {/* san pham */}
                  <Route path="/thongKe" element={<ThongKe />} />
                  <Route path="/banTaiQuay" element={<BanTaiQuay />} />
                  <Route path="/hoaDon" element={<HoaDon />} />
                  {/* sản phẩm */}
                  <Route path="/sanpham" element={<SanPham />} />
                  {/* chất liệu */}
                  <Route path="/chatlieu" element={<ChatLieu />} />
                  {/* màu sác */}
                  <Route path="/mausac" element={<MauSac />} />
                  {/* Phong cách */}
                  <Route path="/phongcach" element={<PhongCach />} />
                  {/* Size */}
                  <Route path="/size" element={<Size />} />
                  {/* kiểu dáng */}
                  <Route path="/kieudang" element={<KieuDang />} />
                  {/* kiểu đai quần */}
                  <Route path="/kieudaiquan" element={<KieuDaiQuan />} />
                  {/* Xuất sứ */}
                  <Route path="/xuatsu" element={<XuatSu />} />
                  {/* Danh Muc */}
                  <Route path="/danhmuc" element={<DanhMuc />} />
                  {/* Thuong Hieu */}
                  <Route path="/thuonghieu" element={<ThuongHieu />} />
                  {/* chi tiết sản phẩm */}
                  <Route path="/sanpham/:id" element={<SanPhamChiTiet />} />
                  {/* ADD San Pham */}
                  <Route path="/sanpham/addProduct" element={<AddProduct />} />
                  {/* Add Chất liệu */}
                  <Route path="/chatlieu/addChatLieu" element={<AddChatLieu />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

const NavigateToThongKe = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/thongKe'); // Điều hướng đến trang /thongKe ngay khi ứng dụng load
  }, [navigate]);

  return null;
};

export default App;
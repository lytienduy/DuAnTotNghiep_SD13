import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

import HoaDonChiTiet from './module/admin/pages/HoaDonChiTiet';
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



const Layout = ({ children }) => {
  const location = useLocation();
  const isBanTaiQuay = location.pathname === '/banTaiQuay';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState); // Đảo trạng thái của sidebar
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      {!isBanTaiQuay && <Sidebar isSidebarOpen={isSidebarOpen} />}

      <Box sx={{ flexGrow: 1, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        {/* Header */}
        {!isBanTaiQuay && <Header toggleSidebar={toggleSidebar} />}

        {/* Content */}
        <Box sx={{ padding: 0, backgroundColor: '#f5f5f5' }}>
          {children}
        </Box>
      </Box>
    </Box>
    </SnackbarProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavigateToThongKe />} />
        <Route path="/thongKe" element={<Layout><ThongKe /></Layout>} />
        <Route path="/banTaiQuay" element={<Layout><BanTaiQuay /></Layout>} />
        <Route path="/hoaDon" element={<Layout><HoaDon /></Layout>} />
        <Route path="/hoaDon/:id" element={<Layout><HoaDonChiTiet /></Layout>} />
        <Route path='/phieu-giam-gia' element={<Layout><PhieuGiamGia /></Layout>} />
        <Route path="/them-phieu-giam-gia" element={<Layout><ThemPhieuGiamGia /></Layout>} />
        <Route path="/detail-phieu-giam-gia/:ma" element={<Layout><DetailPhieuGiamGia /></Layout>} />
        <Route path="/nhanvien" element={<Layout><NhanVien /></Layout>} />
        <Route path="/nhanvien/tao-moi" element={<Layout><TaoMoiNhanVien /></Layout>} />
        <Route path="/nhanvien/chinh-sua/:id" element={<Layout><NhanVienEdit /></Layout>} />
        <Route path="/khachHang" element={<Layout><KhachHang /></Layout>} />
        <Route path="/khachHang/detail/:id" element={<Layout><ThongTinKhachHang /></Layout>} />
        <Route path="/khachHang/add/" element={<Layout><ThongTinKhachHang /></Layout>} />
      </Routes>
    </Router>
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

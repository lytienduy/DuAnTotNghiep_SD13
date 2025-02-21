import React, { useEffect } from 'react';
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
import HoaDonChiTiet from './module/admin/pages/HoaDonChiTiet';

const Layout = ({ children }) => {
  const location = useLocation();
  const isBanTaiQuay = location.pathname === '/banTaiQuay';

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      {!isBanTaiQuay && <Sidebar />}

      <Box sx={{ flexGrow: 1, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        {/* Header */}
        {!isBanTaiQuay && <Header />}

        {/* Content */}
        <Box sx={{ padding: 0, backgroundColor: '#f5f5f5' }}>
          {children}
        </Box>
      </Box>
    </Box>
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

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './module/admin/components/SideBar';
import Header from './module/admin/components/Header';
import ThongKe from './module/admin/pages/ThongKe';
import BanTaiQuay from './module/admin/pages/BanTaiQuay';
import HoaDon from './module/admin/pages/HoaDon';
import SanPham from './module/admin/pages/SanPham';
import ChatLieu from './module/admin/pages/ChatLieu';
import MauSac from './module/admin/pages/MauSac';
import { Box } from '@mui/material';
import PhongCach from './module/admin/pages/PhongCach';
import Size from './module/admin/pages/Size';
import KieuDang from './module/admin/pages/KieuDang';
import KieuDaiQuan from './module/admin/pages/KieuDaiQuan';
import XuatSu from './module/admin/pages/XuatSu';
import DanhMuc from './module/admin/pages/DanhMuc';
import ThuongHieu from './module/admin/pages/ThuongHieu';
import SanPhamChiTiet from './module/admin/pages/SanPhamChiTiet';
import AddProduct from './module/admin/pages/AddProduct';

const App = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Sidebar />

        <Box sx={{ flexGrow: 1, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
          {/* Header */}
          <Header />

          {/* Routing */}
          <Box sx={{ padding: 3 }}>
            <Routes>
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
              {/* Nhan viên */}
            
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
};

export default App;

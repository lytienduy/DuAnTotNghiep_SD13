import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
// Import Admin Components
import AdminSidebar from './module/admin/components/SideBar';
import AdminHeader from './module/admin/components/Header';
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

// Import Client Components
import ClientFooter from './module/client/components/Footer';
import ClientHeader from './module/client/components/Header';
// Import Client Pages
import Home from './module/client/pages/Home';
import SanPhamClient from './module/client/pages/SanPham';
import ChiTietSanPham from './module/client/pages/ChiTietSanPham';
import GioHang from './module/client/pages/GioHang';
import ThanhToan from './module/client/pages/ThanhToan';
import DatHangThanhCong from './module/client/pages/DatHangThanhCong';
import DonMua from './module/client/pages/DonMua';
import PaymentResult from "./module/client/pages/PaymentResult";
// Thêm các trang Client khác ở đây...

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
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <MainLayout />
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
const MainLayout = () => {
  const location = useLocation(); // Đặt useLocation() bên trong Router
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      {isAdminRoute && <AdminSidebar isSidebarOpen={isSidebarOpen} />}

      <Box sx={{ flexGrow: 1, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        {/* Header */}

        {isAdminRoute ? (
          <AdminHeader toggleSidebar={toggleSidebar} />
        ) : (
          <ClientHeader />
        )}

        {/* Routing */}
        <Box sx={{ padding: 3, backgroundColor: '#f3f3f3',  flexGrow: 1 }}>
          <Routes>
            {/* Admin Routes */}
            <Route path="/" element={<NavigateToThongKe />} />
            <Route path="/admin/thongKe" element={<ThongKe />} />
            <Route path="/admin/banTaiQuay" element={<BanTaiQuay />} />
            <Route path="/admin/hoaDon" element={<HoaDon />} />
            <Route path="/admin/hoaDon/:id" element={<HoaDonChiTiet />} />
            <Route path='/admin/phieu-giam-gia' element={<PhieuGiamGia />} />
            <Route path="/admin/phieu-giam-gia/them-moi" element={<ThemPhieuGiamGia />} />
            <Route path="/admin/phieu-giam-gia/chinh-sua/:ma" element={<DetailPhieuGiamGia />} />
            <Route path="/admin/nhanvien" element={<NhanVien />} />
            <Route path="/admin/nhanvien/tao-moi" element={<TaoMoiNhanVien />} />
            <Route path="/admin/nhanvien/chinh-sua/:id" element={<NhanVienEdit />} />
            <Route path="/admin/khachHang" element={<KhachHang />} />
            <Route path="/admin/khachHang/detail/:id" element={<ThongTinKhachHang />} />
            <Route path="/admin/khachHang/add/" element={<ThongTinKhachHang />} />
            {/* sản phẩm */}
            <Route path="/admin/sanpham" element={<SanPham />} />
            {/* chất liệu */}
            <Route path="/admin/chatlieu" element={<ChatLieu />} />
            {/* màu sác */}
            <Route path="/admin/mausac" element={<MauSac />} />
            {/* Phong cách */}
            <Route path="/admin/phongcach" element={<PhongCach />} />
            {/* Size */}
            <Route path="/admin/size" element={<Size />} />
            {/* kiểu dáng */}
            <Route path="/admin/kieudang" element={<KieuDang />} />
            {/* kiểu đai quần */}
            <Route path="/admin/kieudaiquan" element={<KieuDaiQuan />} />
            {/* Xuất sứ */}
            <Route path="/admin/xuatsu" element={<XuatSu />} />
            {/* Danh Muc */}
            <Route path="/admin/danhmuc" element={<DanhMuc />} />
            {/* Thuong Hieu */}
            <Route path="/admin/thuonghieu" element={<ThuongHieu />} />
            {/* chi tiết sản phẩm */}
            <Route path="/admin/sanpham/:id" element={<SanPhamChiTiet />} />
            {/* ADD San Pham */}
            <Route path="/admin/sanpham/addProduct" element={<AddProduct />} />
            {/* Add Chất liệu */}
            <Route path="/admin/chatlieu/addChatLieu" element={<AddChatLieu />} />
            {/* Thêm các route Admin khác... */}



            {/* Client Routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/sanPham" element={<SanPhamClient />} />
            <Route path="/sanPhamChiTiet/:id" element={<ChiTietSanPham />} />
            <Route path="/gioHang" element={<GioHang />} />
            <Route path="/thanhToan" element={<ThanhToan />} />
            <Route path="/datHangThanhCong" element={<DatHangThanhCong />} />
            <Route path="/donMua" element={<DonMua />} />
            <Route path="/payment-result" element={<PaymentResult />} />
            {/* Thêm các route Client khác... */}
          </Routes>
        </Box>
        {/* Footer */}
        {!isAdminRoute && <ClientFooter />}
      </Box>
    </Box>
  );
};
const NavigateToThongKe = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/thongKe'); // Điều hướng đến trang /thongKe ngay khi ứng dụng load
  }, [navigate]);

  return null;
};

export default App;
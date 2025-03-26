import React, { useState,useEffect } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import DiscountIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import PaletteIcon from '@mui/icons-material/Palette';
import ViewListIcon from '@mui/icons-material/ViewList';
import StraightenIcon from '@mui/icons-material/Straighten';
import StarIcon from '@mui/icons-material/Star';
import PublicIcon from '@mui/icons-material/Public';
import BrushIcon from '@mui/icons-material/Brush';
import StyleIcon from '@mui/icons-material/Style';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import PanoramaHorizontalIcon from '@mui/icons-material/PanoramaHorizontal';
import logo from '../../../img/dragonbee_logo_v1.png';
import { useNavigate } from 'react-router-dom';





const Sidebar = ({ isSidebarOpen }) => {
  const [openProducts, setOpenProducts] = useState(false); // State cho submenu
  const location = useLocation();

  const handleToggleProducts = () => setOpenProducts((prev) => !prev);
  const isActive = (path) => location.pathname === path; // Kiểm tra nếu path hiện tại là active

  const navigate = useNavigate();  // Dùng hook navigate của react-router-dom để điều hướng

  const handleLogout = () => {
    // Lấy thông tin người dùng trong localStorage để kiểm tra vai trò
    const userData = JSON.parse(localStorage.getItem('userData') || localStorage.getItem('userKH'));

    // Kiểm tra vai trò và xóa token tương ứng
    if (userData) {
      const roleId = userData.vaiTro.id;

      // Xóa token dựa trên vai trò người dùng
      if (roleId === 1) {
        localStorage.removeItem('token');  // Xóa token Admin
      } else if (roleId === 2) {
        localStorage.removeItem('token');  // Xóa token Nhân viên
      } else if (roleId === 3) {
        localStorage.removeItem('tokenKH');  // Xóa token Khách hàng
      }
    }

    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('userData');  // Xóa thông tin người dùng Admin hoặc Nhân viên

    // Điều hướng về trang login
    navigate('/login');
  };

  const [roleId, setRoleId] = useState(null); // Lưu trữ roleId

  useEffect(() => {
    // Lấy dữ liệu người dùng từ localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
      setRoleId(userData.vaiTro.id); // Set roleId từ dữ liệu người dùng
    }
  }, []);

   // Hàm để kiểm tra xem nút có bị disable không
   const isDisabled = roleId === 2;

  return (
    <Box sx={{ width: isSidebarOpen ? 240 : 72, transition: 'width 0.3s' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        SideBar
      </Typography>
      <Drawer
        variant="permanent"
        sx={{
          width: isSidebarOpen ? 240 : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? 240 : 72,
            boxSizing: 'border-box',
            transition: 'width 0.3s',
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={logo}
            alt="DragonBee Logo"
            style={{
              height: isSidebarOpen ? 120 : 70, // Giảm thêm kích thước khi sidebar đóng
              width: 'auto', // Đảm bảo giữ tỉ lệ logo
              marginRight: isSidebarOpen ? 10 : 0, // Điều chỉnh khoảng cách khi sidebar mở/đóng
            }}
          />
        </Box>

        {/* Main Menu */}
        <List>


          {/* Thống kê */}
          <ListItemButton
            component={Link}
            to="/admin/thongKe"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/admin/thongKe') ? 'rgb(52, 152, 234)' : 'transparent', // Màu xanh với opacity 50% khi được chọn
              color: isActive('/admin/thongKe') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Thống kê" placement="right" disableHoverListener={isSidebarOpen}>
              <ListItemIcon
                sx={{
                  color: isActive('/admin/thongKe') ? '#fff' : 'inherit',
                  minWidth: '40px',
                }}
              >
                <DashboardIcon sx={{ marginLeft: '5px' }} />
              </ListItemIcon></Tooltip>
            {isSidebarOpen && (
              <ListItemText
                primary="Thống Kê"
                primaryTypographyProps={{ fontSize: '13.6px' }} // Chỉnh kích thước chữ
              />
            )}
          </ListItemButton>

          {/* POS */}
          <ListItemButton
            component={Link}
            to="/admin/banTaiQuay"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/admin/banTaiQuay') ? 'rgb(52, 152, 234)' : 'transparent',
              color: isActive('/admin/banTaiQuay') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Bán tại quầy" placement="right" disableHoverListener={isSidebarOpen}>
              <ListItemIcon sx={{ color: isActive('/admin/banTaiQuay') ? '#fff' : 'inherit', minWidth: '40px', }}>
                <StoreIcon sx={{ marginLeft: '5px' }} />
              </ListItemIcon></Tooltip>
            {isSidebarOpen && <ListItemText primary="Tại Quầy" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>

          {/* Hóa Đơn */}
          <ListItemButton
            component={Link}
            to="/admin/hoaDon"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/admin/hoaDon') ? 'rgb(52, 152, 234)' : 'transparent',
              color: isActive('/admin/hoaDon') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Hóa đơn" placement="right" disableHoverListener={isSidebarOpen}>
              <ListItemIcon sx={{ color: isActive('/admin/hoaDon') ? '#fff' : 'inherit', minWidth: '40px', }}>
                <ReceiptIcon sx={{ marginLeft: '5px' }} />
              </ListItemIcon></Tooltip>
            {isSidebarOpen && <ListItemText primary="Hóa Đơn" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>

          {/* Quản Lý Sản Phẩm */}
          < ListItemButton onClick={handleToggleProducts} sx={{ borderRadius: 2 }} component={Link}
            to="/admin/sanpham" disabled={isDisabled} >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <CategoryIcon sx={{ marginLeft: '5px' }} />
            </ListItemIcon>
            {isSidebarOpen && (
              <>
                <ListItemText primary="Quản Lý Sản Phẩm" primaryTypographyProps={{ fontSize: '13.6px' }} />
                {openProducts ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItemButton>
          <Collapse in={openProducts} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {[
                { icon: <CheckroomIcon />, to: "/admin/sanpham", text: 'Sản Phẩm' },
                { icon: <WaterDropIcon />, to: "/admin/chatlieu", text: 'Chất Liệu' },
                { icon: <PaletteIcon />, to: "/admin/mausac", text: 'Màu Sắc' },
                { icon: <ViewListIcon />, to: "/admin/danhmuc", text: 'Danh Mục' },
                { icon: <StraightenIcon />, to: "/admin/size", text: 'Kích Thước' },
                { icon: <StarIcon />, to: "/admin/thuonghieu", text: 'Thương Hiệu' },
                { icon: <StyleIcon />, to: "/admin/kieudang", text: 'Kiểu Dáng' },
                { icon: <BrushIcon />, to: "/admin/phongcach", text: 'Phong Cách' },
                { icon: <PublicIcon />, to: "/admin/xuatsu", text: 'Xuất Xứ' },
                { icon: <PanoramaHorizontalIcon />, to: "/admin/kieudaiquan", text: 'Kiểu Đai Quần' }
              ].map((item, index) => (
                <ListItemButton sx={{ pl: isSidebarOpen ? 4 : 2 }} key={index} component={Link} to={item.to}>
                  <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
                  {isSidebarOpen && (
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: isSidebarOpen ? '13.6px' : '0px' }} />
                  )}
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Quản Lý Tài Khoản */}
          <ListItemButton
            component={Link}
            to="/admin/khachHang"
            disabled={isDisabled}
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/admin/khachHang') ? 'rgb(52, 152, 234)' : 'transparent',
              color: isActive('/admin/khachHang') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}>
            <Tooltip title="Khách Hàng" placement="right" disableHoverListener={isSidebarOpen}>
              <ListItemIcon sx={{ color: isActive('/admin/khachHang') ? '#fff' : 'inherit', minWidth: '40px', }}>
                <PeopleIcon sx={{ marginLeft: '5px' }} />
              </ListItemIcon>
            </Tooltip>
            {isSidebarOpen && <ListItemText primary="Khách Hàng" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>

          <ListItemButton component={Link} to="/admin/nhanvien" disabled={isDisabled}
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/admin/nhanvien') ? 'rgb(52, 152, 234)' : 'transparent', // Màu xanh với opacity 50% khi được chọn
              color: isActive('/admin/nhanvien') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Nhân viên" placement="right" disableHoverListener={isSidebarOpen}>
              <ListItemIcon sx={{
                color: isActive('/admin/nhanvien') ? '#fff' : 'inherit',
                minWidth: '40px',
              }}>
                <PersonIcon sx={{ marginLeft: '5px' }} />
              </ListItemIcon>
            </Tooltip>
            {isSidebarOpen && <ListItemText primary="Nhân Viên" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>

          {/* Phiếu giảm giá */}
          <ListItemButton
            component={Link}
            to="/admin/phieu-giam-gia"
            disabled={isDisabled}
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/admin/phieu-giam-gia') ? 'rgb(52, 152, 234)' : 'transparent', // Màu xanh với opacity 50% khi được chọn
              color: isActive('/admin/phieu-giam-gia') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Phiếu giảm giá" placement="right" disableHoverListener={isSidebarOpen}>
              <ListItemIcon
                sx={{
                  color: isActive('/admin/phieu-giam-gia') ? '#fff' : 'inherit',
                  minWidth: '40px',
                }}
              >
                <DiscountIcon sx={{ marginLeft: '5px' }} />
              </ListItemIcon></Tooltip>
            {isSidebarOpen && (
              <ListItemText
                primary="Phiếu Giảm Giá"
                primaryTypographyProps={{ fontSize: '13.6px' }} // Chỉnh kích thước chữ
              />
            )}
          </ListItemButton>

          <ListItemButton onClick={handleLogout}>
            <Tooltip title="Đăng xuất" placement="right">
              <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                <LogoutIcon sx={{ marginLeft: '5px' }} />
              </ListItemIcon>
            </Tooltip>
            {isSidebarOpen && (
              <ListItemText
                primary="Đăng xuất "
                primaryTypographyProps={{ fontSize: '13.6px' }} // Chỉnh kích thước chữ
              />
            )}
          </ListItemButton>
        </List>
      </Drawer>
    </Box >
  );
};

export default Sidebar;

import React, { useState } from 'react';
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






const Sidebar = ({ isSidebarOpen }) => {
  const [openProducts, setOpenProducts] = useState(false); // State cho submenu
  const location = useLocation();

  const handleToggleProducts = () => setOpenProducts((prev) => !prev);
  const isActive = (path) => location.pathname === path; // Kiểm tra nếu path hiện tại là active
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
            to="/thongKe"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/thongKe') ? 'rgb(52, 152, 234)' : 'transparent', // Màu xanh với opacity 50% khi được chọn
              color: isActive('/thongKe') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Thống kê" placement="right" disableHoverListener={isSidebarOpen}>
            <ListItemIcon
              sx={{
                color: isActive('/thongKe') ? '#fff' : 'inherit',
                minWidth: '40px',
              }}
            >
              <DashboardIcon />
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
            to="/banTaiQuay"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/banTaiQuay') ? 'rgb(52, 152, 234)' : 'transparent',
              color: isActive('/banTaiQuay') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Bán tại quầy" placement="right" disableHoverListener={isSidebarOpen}>
            <ListItemIcon sx={{ color: isActive('/banTaiQuay') ? '#fff' : 'inherit', minWidth: '40px', }}>
              <StoreIcon />
            </ListItemIcon></Tooltip>
            {isSidebarOpen && <ListItemText primary="Tại Quầy" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>

          {/* Hóa Đơn */}
          <ListItemButton
            component={Link}
            to="/hoaDon"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/hoaDon') ? 'rgb(52, 152, 234)' : 'transparent',
              color: isActive('/hoaDon') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Hóa đơn" placement="right" disableHoverListener={isSidebarOpen}>
            <ListItemIcon sx={{ color: isActive('/hoaDon') ? '#fff' : 'inherit', minWidth: '40px', }}>
              <ReceiptIcon />
            </ListItemIcon></Tooltip>
            {isSidebarOpen && <ListItemText primary="Hóa Đơn" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>

          {/* Quản Lý Sản Phẩm */}
          <ListItemButton onClick={handleToggleProducts} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <CategoryIcon />
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
                { icon: <CheckroomIcon />, text: 'Sản Phẩm' },
                { icon: <WaterDropIcon />, text: 'Chất Liệu' },
                { icon: <PaletteIcon />, text: 'Màu Sắc' },
                { icon: <ViewListIcon />, text: 'Danh Mục' },
                { icon: <StraightenIcon />, text: 'Kích Thước' },
                { icon: <StarIcon />, text: 'Thương Hiệu' },
                { icon: <StyleIcon />, text: 'Kiểu Dáng' },
                { icon: <BrushIcon />, text: 'Phong Cách' },
                { icon: <PublicIcon />, text: 'Xuất Xứ' },
                { icon: <PanoramaHorizontalIcon />, text: 'Kiểu Đai Quần' }
              ].map((item, index) => (
                <ListItemButton sx={{ pl: isSidebarOpen ? 4 : 2 }} key={index}>
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
            to="/khachHang"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/khachHang') ? 'rgb(52, 152, 234)' : 'transparent',
              color: isActive('/khachHang') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}>
            <Tooltip title="Khách Hàng" placement="right" disableHoverListener={isSidebarOpen}>
              <ListItemIcon sx={{ color: isActive('/khachHang') ? '#fff' : 'inherit', minWidth: '40px', }}>
                <PeopleIcon />
              </ListItemIcon>
            </Tooltip>
            {isSidebarOpen && <ListItemText primary="Khách Hàng" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>
          <ListItemButton component={Link} to="/nhanvien"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/nhanvien') ? 'rgb(52, 152, 234)' : 'transparent', // Màu xanh với opacity 50% khi được chọn
              color: isActive('/nhanvien') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Nhân viên" placement="right" disableHoverListener={isSidebarOpen}>
              <ListItemIcon sx={{
                color: isActive('/nhanvien') ? '#fff' : 'inherit',
                minWidth: '40px',
              }}>
                <PersonIcon />
              </ListItemIcon>
            </Tooltip>
            {isSidebarOpen && <ListItemText primary="Nhân Viên" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>

          {/* Phiếu giảm giá */}
          <ListItemButton
            component={Link}
            to="/phieu-giam-gia"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/phieu-giam-gia') ? 'rgb(52, 152, 234)' : 'transparent', // Màu xanh với opacity 50% khi được chọn
              color: isActive('/phieu-giam-gia') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <Tooltip title="Phiếu giảm giá" placement="right" disableHoverListener={isSidebarOpen}>
            <ListItemIcon
              sx={{
                color: isActive('/phieu-giam-gia') ? '#fff' : 'inherit',
                minWidth: '40px',
              }}
            >
              <DiscountIcon />
            </ListItemIcon></Tooltip>
            {isSidebarOpen && (
              <ListItemText
                primary="Phiếu Giảm Giá"
                primaryTypographyProps={{ fontSize: '13.6px' }} // Chỉnh kích thước chữ
              />
            )}
          </ListItemButton>
          
          <ListItemButton>
          <Tooltip title="Đăng xuất" placement="right" disableHoverListener={isSidebarOpen}>
            <ListItemIcon sx={{ minWidth: '40px',color:'inherit' }}>
              <LogoutIcon />
            </ListItemIcon></Tooltip>
            {isSidebarOpen && <ListItemText primary="Đăng xuất" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

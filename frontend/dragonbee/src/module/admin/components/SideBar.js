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






const Sidebar = ({ sx }) => {
  const [openProducts, setOpenProducts] = useState(false); // State for product submenu
  const [isSidebarOpen] = useState(true); // State for sidebar open/close
  const location = useLocation(); // Hook to get the current path

  const handleToggleProducts = () => setOpenProducts((prev) => !prev);
  const isActive = (path) => location.pathname === path; // Check if current path matches

  return (
    <Box sx={{ ...sx }}>
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
              height: isSidebarOpen ? 120 : 110, // Thay đổi chiều cao logo
              width: 'auto', // Đảm bảo giữ tỉ lệ logo
              marginRight: isSidebarOpen ? 10 : 0,
            }}
          />
        </Box>




        {/* Main Menu */}
        <List>
          <Typography variant="subtitle2" sx={{ px: 2, mt: 1, mb: 1, color: 'gray' }}>
            MAIN
          </Typography>

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
            <ListItemIcon
              sx={{
                color: isActive('/thongKe') ? '#fff' : 'inherit',
                minWidth: '40px',
              }}
            >
              <DashboardIcon />
            </ListItemIcon>
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
            <ListItemIcon sx={{ color: isActive('/banTaiQuay') ? '#fff' : 'inherit', minWidth: '40px', }}>
              <StoreIcon />
            </ListItemIcon>
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
            <ListItemIcon sx={{ color: isActive('/hoaDon') ? '#fff' : 'inherit', minWidth: '40px', }}>
              <ReceiptIcon />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Hóa Đơn" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>

          {/* Quản Lý Sản Phẩm */}
          <ListItemButton onClick={handleToggleProducts} sx={{ borderRadius: 2 }}>
            <ListItemIcon >
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
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CheckroomIcon />
                </ListItemIcon>
                <ListItemText primary="Sản Phẩm" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <WaterDropIcon />
                </ListItemIcon>
                <ListItemText primary="Chất Liệu" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PaletteIcon />
                </ListItemIcon>
                <ListItemText primary="Màu Sắc" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ViewListIcon />
                </ListItemIcon>
                <ListItemText primary="Danh Mục" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StraightenIcon />
                </ListItemIcon>
                <ListItemText primary="Kích Thước" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary="Thương Hiệu" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StyleIcon />
                </ListItemIcon>
                <ListItemText primary="Kiểu Dáng" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <BrushIcon />
                </ListItemIcon>
                <ListItemText primary="Phong Cách" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText primary="Xuất Xứ" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <PanoramaHorizontalIcon />
                </ListItemIcon>
                <ListItemText primary="Kiểu Đai Quần" primaryTypographyProps={{ fontSize: '13.6px' }} />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Quản Lý Tài Khoản */}
          <ListItemButton>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Khách Hàng" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>
          <ListItemButton component={Link} to="/nhanvien">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
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
            <ListItemIcon
              sx={{
                color: isActive('/phieu-giam-gia') ? '#fff' : 'inherit',
                minWidth: '40px',
              }}
            >
              <DiscountIcon />
            </ListItemIcon>
            {isSidebarOpen && (
              <ListItemText
                primary="Phiếu Giảm Giá"
                primaryTypographyProps={{ fontSize: '13.6px' }} // Chỉnh kích thước chữ
              />
            )}
          </ListItemButton>
          {/* Đợt giảm giá */}
          <ListItemButton
            component={Link}
            to="/discount-events"
            sx={{
              borderRadius: 3,
              backgroundColor: isActive('/discount-events') ? 'rgb(52, 152, 234)' : 'transparent', // Màu xanh với opacity 50% khi được chọn
              color: isActive('/discount-events') ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: '#d3d3d3', // Màu xám nhạt khi hover
                color: '#fff', // Chữ màu trắng khi hover
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive('/discount-events') ? '#fff' : 'inherit',
                minWidth: '40px',
              }}
            >
              <EventIcon />
            </ListItemIcon>
            {isSidebarOpen && (
              <ListItemText
                primary="Đợt Giảm Giá"
                primaryTypographyProps={{ fontSize: '13.6px' }} // Chỉnh kích thước chữ
              />
            )}
          </ListItemButton>
        </List>

        {/* Account */}
        <List>
          <Typography variant="subtitle2" sx={{ px: 2, mt: 1, mb: 1, color: 'gray' }}>
            ACCOUNT
          </Typography>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            {isSidebarOpen && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '13.6px' }} />}
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

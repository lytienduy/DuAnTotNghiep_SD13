import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './module/admin/components/SideBar';
import Header from './module/admin/components/Header';
import ThongKe from './module/admin/pages/ThongKe';
import BanTaiQuay from './module/admin/pages/BanTaiQuay';
import HoaDon from './module/admin/pages/HoaDon';
import { Box } from '@mui/material';

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
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
